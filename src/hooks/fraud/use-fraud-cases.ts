
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
        
        // Make sure we're returning data with all the properties expected by the UI
        return data.map(item => ({
          ...item,
          // Add any missing properties that might be used in the UI
          customer_name: item.customer_name || 'Unknown Customer',
          order_id: item.order_id || `ORD-${item.transaction_id.substr(3)}`,
          amount: item.amount || 0,
          payment_method: item.payment_method || 'Unknown',
          flags: item.flags || []
        })) as FraudCase[];
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
