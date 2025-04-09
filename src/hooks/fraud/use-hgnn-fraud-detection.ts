
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { predictFraudWithHGNN, updateHGNNModelFeedback, HGNNTransactionData } from '@/services/hgnn/hgnnApiClient';
import { Transaction } from '@/services/fraudDetectionService';

/**
 * Hook for using the HGNN fraud detection model
 */
export const useHGNNFraudDetection = () => {
  const queryClient = useQueryClient();

  // Mutation for detecting fraud using the HGNN model
  const detectFraud = useMutation({
    mutationFn: async (transaction: Transaction) => {
      // Transform transaction data into the format expected by the HGNN API
      const hgnnTransactionData: HGNNTransactionData = {
        user_id: transaction.user_id,
        order_id: transaction.order_id,
        payment_method: transaction.payment_method,
        amount: transaction.amount,
        device_id: transaction.device_id,
        location_id: transaction.location_id,
        customer_name: transaction.customer_name,
        timestamp: new Date().toISOString(),
      };
      
      return predictFraudWithHGNN(hgnnTransactionData);
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['fraud-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['recent-transactions'] });
    }
  });

  // Mutation for providing feedback to the model
  const provideFeedback = useMutation({
    mutationFn: async ({ 
      transactionId, 
      isFraud, 
      feedback 
    }: {
      transactionId: string;
      isFraud: boolean;
      feedback?: string;
    }) => {
      return updateHGNNModelFeedback(transactionId, isFraud, feedback);
    },
    onSuccess: () => {
      // Invalidate relevant queries after feedback is provided
      queryClient.invalidateQueries({ queryKey: ['fraud-statistics'] });
    }
  });

  return {
    detectFraud,
    provideFeedback,
    isDetecting: detectFraud.isPending,
    isProvidingFeedback: provideFeedback.isPending,
    error: detectFraud.error || provideFeedback.error
  };
};
