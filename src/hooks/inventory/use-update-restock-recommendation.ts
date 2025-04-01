
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RestockRecommendation } from "./types";

// Update restock recommendation status
export const useUpdateRestockRecommendation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      status 
    }: { 
      id: string; 
      status: 'pending' | 'approved' | 'rejected'; 
    }) => {
      try {
        const { data, error } = await supabase
          .from('restock_recommendations')
          .update({
            status,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select();
          
        if (error) {
          console.error('Error updating restock recommendation:', error);
          throw error;
        }
        
        return data[0] as unknown as RestockRecommendation;
      } catch (error) {
        console.error('Error in useUpdateRestockRecommendation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch restock recommendations queries
      queryClient.invalidateQueries({ queryKey: ['restock-recommendations'] });
    },
  });
};
