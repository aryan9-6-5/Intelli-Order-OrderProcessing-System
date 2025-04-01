
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
            // Add missing UI properties with default values
            customer_name: 'Unknown Customer',
            order_id: `ORD-${item.transaction_id.substring(3)}`,
            amount: 0,
            payment_method: 'Unknown',
            flags: []
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
