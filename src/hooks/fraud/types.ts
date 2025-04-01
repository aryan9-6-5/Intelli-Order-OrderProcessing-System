
// Types for fraud detection
export interface FraudScore {
  id: string;
  transaction_id: string;
  risk_score: number;
  features: Record<string, any>;
  model_version: string;
  created_at: string;
}

export interface FraudCase {
  id: string;
  transaction_id: string;
  status: 'pending-review' | 'marked-safe' | 'confirmed-fraud';
  risk_score: number;
  assigned_to: string | null;
  notes: string | null;
  resolution: string | null;
  created_at: string;
  updated_at: string;
  // Add missing properties that are referenced in the code
  customer_name?: string;
  order_id?: string;
  amount?: number;
  payment_method?: string;
  flags?: string[];
}

// Mock data for development until records are added to the actual tables
export const mockFraudScores: Record<string, FraudScore> = {
  "TX-1001": {
    id: "fs-1",
    transaction_id: "TX-1001",
    risk_score: 0.87,
    features: {
      unusual_location: 0.9,
      payment_method_mismatch: 0.7,
      order_value: 0.5,
      account_age: 0.4,
      multiple_shipping_addresses: 0.3
    },
    model_version: "hgnn-v1.0",
    created_at: new Date().toISOString()
  },
  "TX-1002": {
    id: "fs-2",
    transaction_id: "TX-1002",
    risk_score: 0.35,
    features: {
      unusual_location: 0.2,
      payment_method_mismatch: 0.1,
      order_value: 0.6,
      account_age: 0.1,
      multiple_shipping_addresses: 0.1
    },
    model_version: "hgnn-v1.0",
    created_at: new Date().toISOString()
  }
};

export const mockFraudCases: FraudCase[] = [
  {
    id: "fc-1",
    transaction_id: "TX-1001",
    status: "pending-review",
    risk_score: 0.87,
    assigned_to: null,
    notes: null,
    resolution: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // Add missing properties used in the admin/fraud.tsx
    customer_name: "John Doe",
    order_id: "ORD-1001",
    amount: 299.99,
    payment_method: "Credit Card",
    flags: ["unusual_location", "payment_method_mismatch"]
  },
  {
    id: "fc-2",
    transaction_id: "TX-1002",
    status: "marked-safe",
    risk_score: 0.35,
    assigned_to: "user-1",
    notes: "Verified with customer. Legitimate purchase.",
    resolution: "Customer confirmed purchase via phone.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // Add missing properties used in the admin/fraud.tsx
    customer_name: "Jane Smith",
    order_id: "ORD-1002",
    amount: 149.50,
    payment_method: "PayPal",
    flags: ["recent_account_creation"]
  }
];
