
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RestockRecommendation, mockRecommendations } from "./types";

// Fetches restock recommendations from the MARL model
export const useRestockRecommendations = (productId?: string) => {
  return useQuery({
    queryKey: ['restock-recommendations', productId],
    queryFn: async () => {
      try {
        let query = supabase
          .from('restock_recommendations')
          .select('*');
        
        if (productId) {
          query = query.eq('product_id', productId);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching restock recommendations:', error);
          
          // Fallback to mock data if no data in database
          if (error.code === 'PGRST116' || (data && data.length === 0)) {
            if (productId) {
              return mockRecommendations[productId] || [];
            } else {
              return Object.values(mockRecommendations).flat();
            }
          }
          
          throw error;
        }
        
        return data as unknown as RestockRecommendation[];
      } catch (error) {
        console.error('Error in useRestockRecommendations:', error);
        if (productId) {
          return mockRecommendations[productId] || [];
        } else {
          return Object.values(mockRecommendations).flat();
        }
      }
    },
  });
};
