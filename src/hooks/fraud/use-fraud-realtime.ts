
import { useEffect, useCallback, useState } from 'react';
import { fraudWebSocketClient, FraudWebSocketClient } from '@/services/fraudDetectionService';
import { toast } from 'sonner';

/**
 * Hook for subscribing to real-time fraud detection updates via WebSocket
 * 
 * @returns Object containing the latest fraud score update and connection status
 */
export const useFraudRealtime = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [latestUpdate, setLatestUpdate] = useState<{
    transactionId: number;
    riskScore: number;
    timestamp: Date;
  } | null>(null);

  // Connect to the WebSocket when the component mounts
  useEffect(() => {
    // Override the onopen method to track connection status
    const originalWsOpen = WebSocket.prototype.onopen;
    WebSocket.prototype.onopen = function(this: WebSocket, ev: Event) {
      setIsConnected(true);
      if (originalWsOpen) {
        originalWsOpen.call(this, ev);
      }
    };

    // Override the onclose method to track connection status
    const originalWsClose = WebSocket.prototype.onclose;
    WebSocket.prototype.onclose = function(this: WebSocket, ev: CloseEvent) {
      setIsConnected(false);
      if (originalWsClose) {
        originalWsClose.call(this, ev);
      }
    };

    // Connect to the WebSocket
    fraudWebSocketClient.connect();

    // Register a callback for updates
    const unsubscribe = fraudWebSocketClient.onUpdate((transactionId, riskScore) => {
      setLatestUpdate({
        transactionId,
        riskScore,
        timestamp: new Date()
      });

      // Show a toast for high-risk transactions
      if (riskScore > 0.7) {
        toast.warning(`High fraud risk detected! Transaction #${transactionId} scored ${(riskScore * 100).toFixed(0)}%`, {
          duration: 10000,
        });
      }
    });

    // Clean up on component unmount
    return () => {
      unsubscribe();
      // We don't disconnect since other components might be using the connection
      // fraudWebSocketClient.disconnect();
      
      // Restore original WebSocket methods
      WebSocket.prototype.onopen = originalWsOpen;
      WebSocket.prototype.onclose = originalWsClose;
    };
  }, []);

  // Function to manually connect to the WebSocket
  const connect = useCallback(() => {
    fraudWebSocketClient.connect();
  }, []);

  return {
    isConnected,
    latestUpdate,
    connect
  };
};
