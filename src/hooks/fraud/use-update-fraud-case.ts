
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FraudCase } from "./types";
import { toast } from "sonner";

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
          toast(`Error: ${error.message}`, {
            description: "Failed to update fraud case status."
          });
          throw error;
        }

        toast(`Fraud case status updated to ${status.replace('-', ' ')}`, {
          description: "The fraud case has been successfully updated."
        });
        
        return data[0] as FraudCase;
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
