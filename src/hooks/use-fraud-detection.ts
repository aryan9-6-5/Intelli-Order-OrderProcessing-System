
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Types for fraud detection
export interface FraudScore {
  id: string;
  transaction_id: string;
  risk_score: number;
  features: Record<string, any>;
  model_version: string;
  created_at: string;
}

export interface FraudCase {
  id: string;
  transaction_id: string;
  status: 'pending-review' | 'marked-safe' | 'confirmed-fraud';
  risk_score: number;
  assigned_to: string | null;
  notes: string | null;
  resolution: string | null;
  created_at: string;
  updated_at: string;
}

// Fetches the fraud score for a specific transaction
export const useFraudScore = (transactionId: string) => {
  return useQuery({
    queryKey: ['fraud-score', transactionId],
    queryFn: async () => {
      try {
        // First try to fetch from Supabase
        const { data, error } = await supabase
          .from('fraud_scores')
          .select('*')
          .eq('transaction_id', transactionId)
          .single();
        
        if (error) {
          console.error('Error fetching fraud score:', error);
          
          // Fallback to mock data if no data in database
          if (error.code === 'PGRST116') { // No rows returned
            return mockFraudScores[transactionId] || null;
          }
          
          throw error;
        }
        
        return data as unknown as FraudScore;
      } catch (error) {
        console.error('Error in useFraudScore:', error);
        return mockFraudScores[transactionId] || null;
      }
    },
    enabled: !!transactionId,
  });
};

// Fetches fraud cases with optional filtering
export const useFraudCases = (
  status?: 'pending-review' | 'marked-safe' | 'confirmed-fraud',
  limit: number = 10
) => {
  return useQuery({
    queryKey: ['fraud-cases', status, limit],
    queryFn: async () => {
      try {
        let query = supabase
          .from('fraud_cases')
          .select('*');
        
        // Filter cases by status if provided
        if (status) {
          query = query.eq('status', status);
        }
        
        // Limit the number of results
        query = query.limit(limit);
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching fraud cases:', error);
          
          // Fallback to mock data if no data in database
          if (error.code === 'PGRST116' || (data && data.length === 0)) {
            let filteredCases = [...mockFraudCases];
            if (status) {
              filteredCases = filteredCases.filter(c => c.status === status);
            }
            return filteredCases.slice(0, limit);
          }
          
          throw error;
        }
        
        return data as unknown as FraudCase[];
      } catch (error) {
        console.error('Error in useFraudCases:', error);
        let filteredCases = [...mockFraudCases];
        if (status) {
          filteredCases = filteredCases.filter(c => c.status === status);
        }
        return filteredCases.slice(0, limit);
      }
    },
  });
};

// Update a fraud case status
export const useUpdateFraudCase = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      caseId, 
      status, 
      notes, 
      resolution 
    }: { 
      caseId: string; 
      status: 'pending-review' | 'marked-safe' | 'confirmed-fraud'; 
      notes?: string;
      resolution?: string;
    }) => {
      try {
        const { data, error } = await supabase
          .from('fraud_cases')
          .update({
            status,
            notes: notes || null,
            resolution: resolution || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', caseId)
          .select();
          
        if (error) {
          console.error('Error updating fraud case:', error);
          throw error;
        }
        
        return data[0] as unknown as FraudCase;
      } catch (error) {
        console.error('Error in useUpdateFraudCase:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch fraud cases queries
      queryClient.invalidateQueries({ queryKey: ['fraud-cases'] });
    },
  });
};

// Fetches graph visualization data for fraud network
export const useFraudNetworkGraph = (transactionId: string) => {
  return useQuery({
    queryKey: ['fraud-network', transactionId],
    queryFn: async () => {
      try {
        // In a real implementation, this would fetch from a graph database
        // or construct the graph from related entities in the database
        
        // For now, return mock graph data
        return {
          nodes: [
            { id: "user-1", label: "User", type: "user" },
            { id: transactionId, label: "Transaction", type: "transaction" },
            { id: "device-1", label: "Device", type: "device" },
            { id: "ip-1", label: "IP Address", type: "ip" },
            { id: "product-1", label: "Product", type: "product" }
          ],
          edges: [
            { source: "user-1", target: transactionId, type: "made" },
            { source: "device-1", target: transactionId, type: "used-for" },
            { source: "device-1", target: "ip-1", type: "connected-to" },
            { source: transactionId, target: "product-1", type: "purchased" }
          ]
        };
      } catch (error) {
        console.error('Error fetching fraud network graph:', error);
        throw error;
      }
    },
    enabled: !!transactionId,
  });
};

// Mock data for development until records are added to the actual tables
const mockFraudScores: Record<string, FraudScore> = {
  "TX-1001": {
    id: "fs-1",
    transaction_id: "TX-1001",
    risk_score: 0.87,
    features: {
      unusual_location: 0.9,
      payment_method_mismatch: 0.7,
      order_value: 0.5,
      account_age: 0.4,
      multiple_shipping_addresses: 0.3
    },
    model_version: "hgnn-v1.0",
    created_at: new Date().toISOString()
  },
  "TX-1002": {
    id: "fs-2",
    transaction_id: "TX-1002",
    risk_score: 0.35,
    features: {
      unusual_location: 0.2,
      payment_method_mismatch: 0.1,
      order_value: 0.6,
      account_age: 0.1,
      multiple_shipping_addresses: 0.1
    },
    model_version: "hgnn-v1.0",
    created_at: new Date().toISOString()
  }
};

const mockFraudCases: FraudCase[] = [
  {
    id: "fc-1",
    transaction_id: "TX-1001",
    status: "pending-review",
    risk_score: 0.87,
    assigned_to: null,
    notes: null,
    resolution: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "fc-2",
    transaction_id: "TX-1002",
    status: "marked-safe",
    risk_score: 0.35,
    assigned_to: "user-1",
    notes: "Verified with customer. Legitimate purchase.",
    resolution: "Customer confirmed purchase via phone.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
