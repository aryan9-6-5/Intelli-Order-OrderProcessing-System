
/**
 * HGNN (Heterogeneous Graph Neural Network) Model Information
 * 
 * This file describes the structure and workflow of the HGNN model
 * used for fraud detection in our application.
 */

export interface NodeType {
  name: string;
  description: string;
  features: string[];
}

export interface EdgeType {
  source: string;
  target: string;
  relationship: string;
  description: string;
}

export interface ModelLayer {
  name: string;
  description: string;
  inputDimension?: number;
  outputDimension?: number;
}

/**
 * Node types in the heterogeneous graph
 */
export const nodeTypes: NodeType[] = [
  {
    name: 'User',
    description: 'Represents a customer making a transaction',
    features: ['account_age', 'transaction_history', 'login_frequency', 'device_count']
  },
  {
    name: 'Transaction',
    description: 'Represents a single purchase or payment',
    features: ['amount', 'timestamp', 'currency', 'payment_method', 'is_international']
  },
  {
    name: 'Device',
    description: 'Represents a device used for the transaction',
    features: ['device_type', 'os', 'browser', 'ip_address', 'is_mobile']
  },
  {
    name: 'Location',
    description: 'Represents a geographic location',
    features: ['country', 'city', 'postal_code', 'is_high_risk_region']
  },
  {
    name: 'Merchant',
    description: 'Represents the seller receiving payment',
    features: ['category', 'name', 'average_transaction_value', 'fraud_history']
  }
];

/**
 * Edge types in the heterogeneous graph
 */
export const edgeTypes: EdgeType[] = [
  {
    source: 'User',
    target: 'Transaction',
    relationship: 'MADE',
    description: 'User made a transaction'
  },
  {
    source: 'User',
    target: 'Device',
    relationship: 'USES',
    description: 'User uses a device'
  },
  {
    source: 'Transaction',
    target: 'Merchant',
    relationship: 'PAID_TO',
    description: 'Transaction paid to merchant'
  },
  {
    source: 'Transaction',
    target: 'Location',
    relationship: 'OCCURRED_AT',
    description: 'Transaction occurred at location'
  },
  {
    source: 'Device',
    target: 'Location',
    relationship: 'LOCATED_AT',
    description: 'Device located at location'
  }
];

/**
 * Architecture of the HGNN model
 */
export const modelArchitecture: ModelLayer[] = [
  {
    name: 'Node Feature Embedding',
    description: 'Learns embeddings for each node type with different feature dimensions',
  },
  {
    name: 'Message Passing Layer 1',
    description: 'Performs heterogeneous message passing between connected nodes',
    inputDimension: 64,
    outputDimension: 32
  },
  {
    name: 'Message Passing Layer 2',
    description: 'Second message passing layer to capture higher-order relationships',
    inputDimension: 32,
    outputDimension: 16
  },
  {
    name: 'Graph Attention Layer',
    description: 'Attention mechanism to weigh the importance of different node connections',
    inputDimension: 16,
    outputDimension: 16
  },
  {
    name: 'Graph Pooling',
    description: 'Pools information from relevant nodes to create transaction representation',
    inputDimension: 16,
    outputDimension: 8
  },
  {
    name: 'Fraud Scoring Layer',
    description: 'Final layer that outputs a fraud probability score between 0 and 1',
    inputDimension: 8,
    outputDimension: 1
  }
];

/**
 * Describes the HGNN workflow for fraud detection
 */
export const modelWorkflow = [
  'Transaction data is received from the application',
  'The data is transformed into a heterogeneous graph representation',
  'Node features are embedded into a latent space',
  'Multiple rounds of message passing aggregate information from connected nodes',
  'Graph attention weighs the importance of different connections',
  'Graph pooling creates a fixed-size representation of the transaction context',
  'The final layer computes a fraud risk score between 0 and 1',
  'The score is returned to the application and stored in the database',
  'Real-time updates are sent to connected clients via WebSockets'
];

/**
 * Explains how the model identifies risk factors
 */
export const riskFactorIdentification = `
The HGNN model identifies risk factors by analyzing patterns in the heterogeneous graph.
For example, it can detect:

1. Unusual connections between users, devices, and locations
2. Transactions that deviate from a user's normal behavior
3. Patterns similar to known fraudulent transactions
4. Suspicious combinations of payment methods and merchant categories
5. Transactions from high-risk geographic locations

The attention mechanism helps identify which connections are most suspicious,
providing explainable insights into why a transaction was flagged.
`;
