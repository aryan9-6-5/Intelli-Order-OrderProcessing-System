
import { useQuery } from "@tanstack/react-query";
import { fetchFraudStatistics } from "@/services/fraudDetectionService";

// Hook for fetching fraud statistics
export const useFraudStatistics = () => {
  return useQuery({
    queryKey: ['fraud-statistics'],
    queryFn: async () => {
      try {
        return await fetchFraudStatistics();
      } catch (error) {
        console.error('Error fetching fraud statistics:', error);
        // Return default values if there's an error
        return {
          highRiskCount: 0,
          mediumRiskCount: 0,
          lowRiskCount: 0,
          clearedCount: 0,
          totalAmount: 0
        };
      }
    },
    refetchInterval: 60000, // Refetch every minute
  });
};
