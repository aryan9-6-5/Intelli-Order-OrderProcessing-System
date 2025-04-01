
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FraudScore, mockFraudScores } from "./types";

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
