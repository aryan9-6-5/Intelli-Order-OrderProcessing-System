
import { useQuery } from "@tanstack/react-query";

// Fetches graph visualization data for fraud network
export const useFraudNetworkGraph = (transactionId: string) => {
  return useQuery({
    queryKey: ['fraud-network', transactionId],
    queryFn: async () => {
      try {
        // In a real implementation, this would fetch from a graph database
        // or construct the graph from related entities in the database
        
        // For now, return mock graph data
        return {
          nodes: [
            { id: "user-1", label: "User", type: "user" },
            { id: transactionId, label: "Transaction", type: "transaction" },
            { id: "device-1", label: "Device", type: "device" },
            { id: "ip-1", label: "IP Address", type: "ip" },
            { id: "product-1", label: "Product", type: "product" }
          ],
          edges: [
            { source: "user-1", target: transactionId, type: "made" },
            { source: "device-1", target: transactionId, type: "used-for" },
            { source: "device-1", target: "ip-1", type: "connected-to" },
            { source: transactionId, target: "product-1", type: "purchased" }
          ]
        };
      } catch (error) {
        console.error('Error fetching fraud network graph:', error);
        throw error;
      }
    },
    enabled: !!transactionId,
  });
};
