
import { toast } from "sonner";

/**
 * HGNN Fraud Detection Service
 * 
 * This service connects to the FastAPI backend that runs the HGNN (Heterogeneous Graph Neural Network)
 * model for fraud detection. It handles both REST API calls and WebSocket connections.
 */

export interface Transaction {
  user_id: string;
  device_id?: string;
  location_id?: string;
  amount: number;
}

export interface TransactionResponse {
  transaction_id: number;
  user_id: string;
  device_id: string | null;
  location_id: string | null;
  amount: number;
  timestamp: string;
  risk_score: number;
}

// The base URL for the FastAPI backend
const API_BASE_URL = process.env.FRAUD_API_URL || 'http://localhost:8000';

/**
 * Submits a transaction to the fraud detection API for scoring
 * @param transaction The transaction to score
 * @returns The transaction with its computed risk score
 */
export const submitTransaction = async (transaction: Transaction): Promise<TransactionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error submitting transaction');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in fraud detection service:', error);
    toast.error('Failed to analyze transaction for fraud');
    throw error;
  }
};

/**
 * Fetches recent transactions with their fraud scores
 * @returns List of recent transactions with risk scores
 */
export const fetchRecentTransactions = async (): Promise<TransactionResponse[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error fetching transactions');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching transactions:', error);
    toast.error('Failed to load transaction history');
    throw error;
  }
};

/**
 * Class for handling real-time fraud score updates via WebSocket
 */
export class FraudWebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: number = 1000; // Start with 1s, will increase exponentially
  private callbacks: ((transactionId: number, riskScore: number) => void)[] = [];

  /**
   * Connects to the fraud detection WebSocket endpoint
   */
  connect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;

    try {
      this.ws = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/ws/updates`);
      
      this.ws.onopen = () => {
        console.log('Connected to fraud detection WebSocket');
        this.reconnectAttempts = 0;
        this.reconnectTimeout = 1000;
      };
      
      this.ws.onmessage = (event) => {
        try {
          // Parse message from "Transaction X: Risk Score = Y.ZZ" format
          const message = event.data;
          const matches = message.match(/Transaction (\d+): Risk Score = ([\d.]+)/);
          
          if (matches && matches.length >= 3) {
            const transactionId = parseInt(matches[1], 10);
            const riskScore = parseFloat(matches[2]);
            
            // Notify all registered callbacks
            this.callbacks.forEach(callback => {
              callback(transactionId, riskScore);
            });
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };
      
      this.ws.onclose = () => {
        console.log('Disconnected from fraud detection WebSocket');
        this.attemptReconnect();
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.ws?.close();
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this.attemptReconnect();
    }
  }

  /**
   * Attempts to reconnect to the WebSocket using exponential backoff
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const timeout = this.reconnectTimeout * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${timeout}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, timeout);
  }

  /**
   * Registers a callback to be invoked when a new fraud score is received
   * @param callback Function to call when a new score is received
   * @returns Function to unregister the callback
   */
  onUpdate(callback: (transactionId: number, riskScore: number) => void): () => void {
    this.callbacks.push(callback);
    
    // Return a function to unregister this callback
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Disconnects from the WebSocket
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Create a singleton instance of the WebSocket client
export const fraudWebSocketClient = new FraudWebSocketClient();
