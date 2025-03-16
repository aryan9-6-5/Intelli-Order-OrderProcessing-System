
import { useQuery } from "@tanstack/react-query";
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
      // This would be replaced with an actual call to your Edge Function
      // that uses the HGNN model to generate a fraud score
      const { data, error } = await supabase
        .from('fraud_scores')
        .select('*')
        .eq('transaction_id', transactionId)
        .single();
        
      if (error) {
        console.error('Error fetching fraud score:', error);
        return null;
      }
      
      return data as FraudScore;
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
      let query = supabase
        .from('fraud_cases')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching fraud cases:', error);
        return [];
      }
      
      return data as FraudCase[];
    },
  });
};

// Fetches graph visualization data for fraud network
export const useFraudNetworkGraph = (transactionId: string) => {
  return useQuery({
    queryKey: ['fraud-network', transactionId],
    queryFn: async () => {
      // This would call your Edge Function that generates a graph visualization
      // based on the HGNN model's internal representation
      const { data, error } = await supabase.functions.invoke('fraud-network-graph', {
        body: { transactionId },
      });
      
      if (error) {
        console.error('Error fetching fraud network graph:', error);
        return { nodes: [], edges: [] };
      }
      
      return data;
    },
    enabled: !!transactionId,
  });
};
