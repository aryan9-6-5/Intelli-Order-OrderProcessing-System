
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
        // Start with a basic query for fraud cases
        let query = supabase
          .from('fraud_cases')
          .select('*');
        
        // Filter cases by status if provided
        if (status) {
          query = query.eq('status', status);
        }
        
        // Order by risk score descending
        query = query.order('risk_score', { ascending: false });
        
        // Limit the number of results
        query = query.limit(limit);
        
        const { data: fraudCasesData, error: fraudCasesError } = await query;
        
        if (fraudCasesError) {
          console.error('Error fetching fraud cases:', fraudCasesError);
          return mockFraudCases.slice(0, limit);
        }
        
        if (!fraudCasesData || fraudCasesData.length === 0) {
          console.log('No fraud cases found in database, using mock data');
          return mockFraudCases.slice(0, limit);
        }
        
        // Now fetch transaction details for all the cases
        const transactionIds = fraudCasesData.map(c => c.transaction_id);
        
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .in('transaction_id', transactionIds);
          
        if (transactionsError) {
          console.error('Error fetching transactions:', transactionsError);
        }
        
        // Create a lookup map for transactions
        const transactionMap = (transactionsData || []).reduce((map, transaction) => {
          map[transaction.transaction_id] = transaction;
          return map;
        }, {} as Record<string, any>);
        
        // Map database results to FraudCase objects with all required properties
        return fraudCasesData.map(item => {
          const transaction = transactionMap[item.transaction_id] || {};
          
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
            // Add UI properties from transactions table
            customer_name: transaction.customer_name || "Unknown Customer",
            order_id: transaction.order_id || "N/A",
            amount: transaction.amount ? parseFloat(transaction.amount) : 0,
            payment_method: transaction.payment_method || "Unknown",
            flags: generateFlagsFromRiskScore(item.risk_score)
          } as FraudCase;
        });
      } catch (error) {
        console.error('Error in useFraudCases:', error);
        return mockFraudCases.slice(0, limit);
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
