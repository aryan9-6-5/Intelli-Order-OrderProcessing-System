
import { useQuery } from "@tanstack/react-query";

// Fetches agent decision explanations
export const useAgentDecisionExplanation = (productId: string) => {
  return useQuery({
    queryKey: ['agent-explanation', productId],
    queryFn: async () => {
      try {
        // In a real implementation, this would fetch from a database
        // or from an API endpoint that returns agent explanations
        
        // Mock explanation data
        return {
          product_id: productId,
          explanation: [
            "Agent evaluated 5 potential actions based on current state.",
            "Key factors: current inventory (32 units), lead time (5 days), demand forecast (420 units over 14 days).",
            "Agent chose 'restock 250 units' with expected reward of 0.85.",
            "Alternative actions considered: wait 1 day (-0.2 reward), order 100 units (0.4 reward), order 500 units (0.65 reward)."
          ],
          confidence: 0.85,
          training_iterations: 250000,
          model_version: "marl-v2.3"
        };
      } catch (error) {
        console.error('Error fetching agent decision explanation:', error);
        throw error;
      }
    },
    enabled: !!productId,
  });
};
