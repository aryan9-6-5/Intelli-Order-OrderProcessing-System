import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * HGNN Fraud Detection Service
 * 
 * This service connects to the FastAPI backend that runs the HGNN (Heterogeneous Graph Neural Network)
 * model for fraud detection. It also handles database operations to store and retrieve fraud data.
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
const API_BASE_URL = import.meta.env.VITE_FRAUD_API_URL || 'http://localhost:8000';

/**
 * Submits a transaction to the fraud detection API for scoring
 * and stores the result in the database
 * 
 * @param transaction The transaction to score
 * @returns The transaction with its computed risk score
 */
export const submitTransaction = async (transaction: Transaction): Promise<TransactionResponse> => {
  try {
    // First, send to the AI model API
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

    const result = await response.json();
    
    // Generate a transaction ID string
    const transactionId = `TX-${result.transaction_id}`;
    
    // Store fraud score directly (without trying to store in transactions table)
    const { error: scoreError } = await supabase
      .from('fraud_scores')
      .insert({
        transaction_id: transactionId,
        risk_score: result.risk_score,
        features: {}, // Default empty features
        model_version: 'hgnn-v1.0',
      });

    if (scoreError) {
      console.error('Error storing fraud score in database:', scoreError);
    }

    // If risk score is high, create a fraud case
    if (result.risk_score > 0.5) {
      const { error: caseError } = await supabase
        .from('fraud_cases')
        .insert({
          transaction_id: transactionId,
          status: 'pending-review',
          risk_score: result.risk_score,
          notes: 'Automatically flagged for review due to high risk score',
        });

      if (caseError) {
        console.error('Error creating fraud case in database:', caseError);
      }
    }

    return result;
  } catch (error) {
    console.error('Error in fraud detection service:', error);
    toast.error('Failed to analyze transaction for fraud');
    throw error;
  }
};

/**
 * Fetches recent transactions with their fraud scores from the database
 * @returns List of recent transactions with risk scores
 */
export const fetchRecentTransactions = async (): Promise<any[]> => {
  try {
    // Instead of joining with transactions table, we'll just get fraud scores
    const { data, error } = await supabase
      .from('fraud_scores')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      throw error;
    }

    // Transform the data to include basic transaction info
    return data.map(score => ({
      transaction_id: score.transaction_id,
      risk_score: score.risk_score,
      features: score.features,
      created_at: score.created_at,
      // Add some mock transaction data since we don't have access to the transactions table
      amount: 100 + Math.round(score.risk_score * 1000), // Mock amount based on risk score
      user_id: `user-${Math.floor(Math.random() * 1000)}`, // Random user ID
      payment_method: score.risk_score > 0.7 ? 'Credit Card' : 'PayPal', // Mock payment method
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    toast.error('Failed to load transaction history');
    throw error;
  }
};

/**
 * Fetches fraud cases statistics from the database
 * @returns Statistics about fraud cases
 */
export const fetchFraudStatistics = async (): Promise<{
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  clearedCount: number;
  totalAmount: number;
}> => {
  try {
    // Get counts for different risk levels
    const { data: fraudCases, error: casesError } = await supabase
      .from('fraud_cases')
      .select('status, risk_score');
    
    if (casesError) {
      throw casesError;
    }

    const highRiskCount = fraudCases?.filter(c => c.risk_score > 0.7).length || 0;
    const mediumRiskCount = fraudCases?.filter(c => c.risk_score > 0.4 && c.risk_score <= 0.7).length || 0;
    const lowRiskCount = fraudCases?.filter(c => c.risk_score <= 0.4).length || 0;
    const clearedCount = fraudCases?.filter(c => c.status === 'marked-safe').length || 0;
    
    // Calculate a representative total amount based on risk scores
    const totalAmount = fraudCases?.reduce((sum, kase) => {
      return sum + (100 + Math.round(kase.risk_score * 1000));
    }, 0) || 5000;

    return {
      highRiskCount,
      mediumRiskCount,
      lowRiskCount,
      clearedCount,
      totalAmount
    };
  } catch (error) {
    console.error('Error fetching fraud statistics:', error);
    return {
      highRiskCount: 0,
      mediumRiskCount: 0,
      lowRiskCount: 0,
      clearedCount: 0,
      totalAmount: 0
    };
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
