
import { toast } from "sonner";

/**
 * HGNN (Heterogeneous Graph Neural Network) API Client
 * 
 * This client interfaces with the Python-based HGNN fraud detection model API
 * that processes transaction data through a graph neural network.
 */

// API base URL - should point to your Flask API that serves the HGNN model
const HGNN_API_BASE_URL = import.meta.env.VITE_HGNN_API_URL || 'http://localhost:5000';

// Transaction data interface - what we send to the model
export interface HGNNTransactionData {
  user_id: string;
  order_id: string;
  payment_method: string;
  amount: number;
  device_id?: string;
  location_id?: string;
  customer_name: string;
  timestamp?: string;
  // Additional features that might be relevant for the HGNN model
  user_account_age_days?: number;
  item_count?: number;
  is_new_payment_method?: boolean;
  shipping_billing_match?: boolean;
}

// Response from the HGNN model API
export interface HGNNPredictionResponse {
  transaction_id: string;
  risk_score: number;
  explanation: {
    feature_importance: Record<string, number>;
    suspicious_connections: Array<{
      entity_type: string;
      entity_id: string;
      risk_contribution: number;
    }>;
    risk_factors: string[];
  };
}

/**
 * Submits transaction data to the HGNN model for fraud prediction
 * 
 * @param transactionData The transaction data to analyze
 * @returns The fraud prediction result from the HGNN model
 */
export const predictFraudWithHGNN = async (
  transactionData: HGNNTransactionData
): Promise<HGNNPredictionResponse> => {
  try {
    console.log('Sending transaction data to HGNN model:', transactionData);
    
    const response = await fetch(`${HGNN_API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HGNN API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log('HGNN prediction result:', result);
    
    return result;
  } catch (error) {
    console.error('Error predicting fraud with HGNN model:', error);
    toast.error('Failed to analyze transaction with fraud detection model');
    throw error;
  }
};

/**
 * Updates the HGNN model graph with feedback on a transaction
 * 
 * @param transactionId The ID of the transaction to update
 * @param isFraud Whether the transaction was actually fraudulent
 * @param feedback Additional feedback details
 */
export const updateHGNNModelFeedback = async (
  transactionId: string,
  isFraud: boolean,
  feedback?: string
): Promise<void> => {
  try {
    const response = await fetch(`${HGNN_API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transaction_id: transactionId,
        is_fraud: isFraud,
        feedback,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HGNN API feedback error (${response.status}): ${errorText}`);
    }

    toast.success(`Fraud detection model updated with feedback`);
  } catch (error) {
    console.error('Error updating HGNN model with feedback:', error);
    toast.error('Failed to update fraud detection model with feedback');
  }
};
