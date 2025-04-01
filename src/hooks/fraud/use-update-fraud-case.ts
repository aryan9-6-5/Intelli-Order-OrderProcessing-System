
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FraudCase } from "./types";

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
