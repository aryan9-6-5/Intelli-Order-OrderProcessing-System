
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductForecast, mockForecasts } from "./types";

// Fetches demand forecast for a specific product
export const useProductForecast = (productId: string, days: number = 30) => {
  return useQuery({
    queryKey: ['product-forecast', productId, days],
    queryFn: async () => {
      try {
        // First try to fetch from Supabase
        const { data, error } = await supabase
          .from('product_forecasts')
          .select('*')
          .eq('product_id', productId)
          .single();
        
        if (error) {
          console.error('Error fetching product forecast:', error);
          
          // Fallback to mock data if no data in database
          if (error.code === 'PGRST116') { // No rows returned
            return mockForecasts[productId] || null;
          }
          
          throw error;
        }
        
        return data as unknown as ProductForecast;
      } catch (error) {
        console.error('Error in useProductForecast:', error);
        return mockForecasts[productId] || null;
      }
    },
    enabled: !!productId,
  });
};
