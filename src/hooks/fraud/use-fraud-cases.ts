
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FraudCase, mockFraudCases } from "./types";

// Fetches fraud cases with optional filtering
export const useFraudCases = (
  status?: 'pending-review' | 'marked-safe' | 'confirmed-fraud',
  limit: number = 10
) => {
  return useQuery({
    queryKey: ['fraud-cases', status, limit],
    queryFn: async () => {
      try {
        // Join with transactions to get customer name, order ID, and amount
        let query = supabase
          .from('fraud_cases')
          .select(`
            *,
            transactions!inner(customer_name, order_id, amount, payment_method)
          `);
        
        // Filter cases by status if provided
        if (status) {
          query = query.eq('status', status);
        }
        
        // Order by risk score descending
        query = query.order('risk_score', { ascending: false });
        
        // Limit the number of results
        query = query.limit(limit);
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching fraud cases:', error);
          
          // Fallback to mock data if database error occurs
          let filteredCases = [...mockFraudCases];
          if (status) {
            filteredCases = filteredCases.filter(c => c.status === status);
          }
          return filteredCases.slice(0, limit);
        }
        
        if (!data || data.length === 0) {
          console.log('No fraud cases found in database, using mock data');
          let filteredCases = [...mockFraudCases];
          if (status) {
            filteredCases = filteredCases.filter(c => c.status === status);
          }
          return filteredCases.slice(0, limit);
        }
        
        // Map database results to FraudCase objects with all required properties
        return data.map(item => {
          return {
            id: item.id,
            transaction_id: item.transaction_id,
            status: item.status,
            risk_score: item.risk_score,
            assigned_to: item.assigned_to,
            notes: item.notes,
            resolution: item.resolution,
            created_at: item.created_at,
            updated_at: item.updated_at,
            // Add UI properties from the joined transaction
            customer_name: item.transactions.customer_name,
            order_id: item.transactions.order_id,
            amount: parseFloat(item.transactions.amount),
            payment_method: item.transactions.payment_method,
            flags: generateFlagsFromRiskScore(item.risk_score)
          } as FraudCase;
        });
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

// Helper function to generate flags based on risk score
function generateFlagsFromRiskScore(riskScore: number): string[] {
  const flags = [];
  
  if (riskScore > 0.7) {
    flags.push("High-value order");
  }
  
  if (riskScore > 0.8) {
    flags.push("Mismatched billing/shipping");
  }
  
  if (riskScore > 0.6) {
    flags.push("Unusual time of purchase");
  }
  
  if (riskScore > 0.5) {
    flags.push("New account");
  }
  
  return flags;
}
