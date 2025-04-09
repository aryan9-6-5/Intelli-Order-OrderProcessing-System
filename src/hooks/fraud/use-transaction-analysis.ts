
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { submitTransaction, fetchRecentTransactions, Transaction, TransactionResponse } from '@/services/fraudDetectionService';

/**
 * Hook for analyzing transactions using the HGNN fraud detection model
 */
export const useTransactionAnalysis = () => {
  const queryClient = useQueryClient();

  // Mutation for submitting a new transaction for analysis
  const { mutate, isPending, error, data } = useMutation({
    mutationFn: submitTransaction,
    onSuccess: (data) => {
      // Invalidate and refetch the transaction list query when a new transaction is added
      queryClient.invalidateQueries({ queryKey: ['recent-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['fraud-statistics'] });
    }
  });

  return {
    analyzeTransaction: mutate,
    isAnalyzing: isPending,
    analysisError: error,
    result: data
  };
};

/**
 * Hook for fetching recent transactions with their fraud scores
 */
export const useRecentTransactions = () => {
  return useQuery({
    queryKey: ['recent-transactions'],
    queryFn: fetchRecentTransactions,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
