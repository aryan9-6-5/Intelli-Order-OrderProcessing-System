import os
import numpy as np
import pandas as pd
import torch
import torch.nn.functional as F
from torch_geometric.data import HeteroData
from torch_geometric.nn import HGTConv, Linear
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, precision_recall_curve, average_precision_score
from flask import Flask, request, jsonify

# ---------------------------
# Data Processor
# ---------------------------
class DataProcessor:
    def __init__(self, order_data_path, user_data_path, payment_data_path):
        self.order_data_path = order_data_path
        self.user_data_path = user_data_path
        self.payment_data_path = payment_data_path

        self.node_mappings = {}
        self.edge_indices = {}
        self.node_features = {}
        self.labels = {}

    def load_data(self):
        """Load raw data from CSV files."""
        self.orders_df = pd.read_csv(self.order_data_path)
        self.users_df = pd.read_csv(self.user_data_path)
        self.payments_df = pd.read_csv(self.payment_data_path)
        if 'is_fraud' not in self.orders_df.columns:
            raise ValueError("Order data must have 'is_fraud' column")

    def create_node_mappings(self):
        """Create mappings from original IDs to consecutive indices."""
        unique_users = self.users_df['user_id'].astype(str).unique()
        self.node_mappings['user'] = {uid: idx for idx, uid in enumerate(unique_users)}

        unique_orders = self.orders_df['order_id'].astype(str).unique()
        self.node_mappings['order'] = {oid: idx for idx, oid in enumerate(unique_orders)}

        unique_payments = self.payments_df['payment_id'].astype(str).unique()
        self.node_mappings['payment'] = {pid: idx for idx, pid in enumerate(unique_payments)}

    def extract_node_features(self):
        """Extract and store features for each node type as tensors."""
        # For users, use the available columns: 'age', 'account_age_days', 'total_past_orders'
        user_cols = ['age', 'account_age_days', 'total_past_orders']
        missing_user_cols = set(user_cols) - set(self.users_df.columns)
        if missing_user_cols:
            print(f"Warning: The following expected user columns are missing: {missing_user_cols}")
        user_features = self.users_df[[col for col in user_cols if col in self.users_df.columns]].values
        self.node_features['user'] = torch.tensor(user_features, dtype=torch.float)

        # For orders, use 'order_amount' and 'num_items'
        order_cols = ['order_amount', 'num_items']
        missing_order_cols = set(order_cols) - set(self.orders_df.columns)
        if missing_order_cols:
            print(f"Warning: The following expected order columns are missing: {missing_order_cols}")
        order_features = self.orders_df[[col for col in order_cols if col in self.orders_df.columns]].values
        self.node_features['order'] = torch.tensor(order_features, dtype=torch.float)

        # For payments: one-hot encode 'payment_type'
        if 'payment_type' not in self.payments_df.columns:
            raise ValueError("payments.csv must have a 'payment_type' column")
        payment_types = pd.get_dummies(self.payments_df['payment_type']).values
        self.node_features['payment'] = torch.tensor(payment_types, dtype=torch.float)

        # Fraud labels for orders (assume 0: legitimate, 1: fraud)
        self.labels['order'] = torch.tensor(self.orders_df['is_fraud'].values, dtype=torch.long)

    def create_edge_indices(self):
        """Create edge indices (relationships) between node types."""
        # User places Order edges
        user_order_df = self.orders_df[['user_id', 'order_id']].drop_duplicates()
        user_indices = [self.node_mappings['user'][str(uid)] for uid in user_order_df['user_id']]
        order_indices = [self.node_mappings['order'][str(oid)] for oid in user_order_df['order_id']]
        self.edge_indices[('user', 'places', 'order')] = torch.tensor([user_indices, order_indices])
        self.edge_indices[('order', 'placed_by', 'user')] = torch.tensor([order_indices, user_indices])

        # Order uses Payment edges
        order_payment_df = self.orders_df[['order_id', 'payment_id']].drop_duplicates()
        order_indices = [self.node_mappings['order'][str(oid)] for oid in order_payment_df['order_id']]
        payment_indices = [self.node_mappings['payment'][str(pid)] for pid in order_payment_df['payment_id']]
        self.edge_indices[('order', 'uses', 'payment')] = torch.tensor([order_indices, payment_indices])
        self.edge_indices[('payment', 'used_by', 'order')] = torch.tensor([payment_indices, order_indices])

    def create_heterograph(self):
        """Create and return a heterogeneous graph using HeteroData."""
        self.load_data()
        self.create_node_mappings()
        self.extract_node_features()
        self.create_edge_indices()

        data = HeteroData()
        # Set node features
        for node_type, features in self.node_features.items():
            data[node_type].x = features

        # Set edge indices for every relation
        for edge_type, edge_index in self.edge_indices.items():
            data[edge_type].edge_index = edge_index

        # Set fraud labels for orders
        data['order'].y = self.labels['order']

        return data

    def split_data(self, data, test_size=0.2, val_size=0.1):
        """Split the order nodes into train, validation, and test masks."""
        num_orders = data['order'].x.size(0)
        order_indices = np.arange(num_orders)
        train_val_idx, test_idx = train_test_split(order_indices, test_size=test_size, 
                                                  stratify=data['order'].y.numpy())
        val_size_adjusted = val_size / (1 - test_size)
        train_idx, val_idx = train_test_split(train_val_idx, test_size=val_size_adjusted,
                                             stratify=data['order'].y[train_val_idx].numpy())

        train_mask = torch.zeros(num_orders, dtype=torch.bool)
        val_mask = torch.zeros(num_orders, dtype=torch.bool)
        test_mask = torch.zeros(num_orders, dtype=torch.bool)

        train_mask[train_idx] = True
        val_mask[val_idx] = True
        test_mask[test_idx] = True

        data['order'].train_mask = train_mask
        data['order'].val_mask = val_mask
        data['order'].test_mask = test_mask

        return data

# ---------------------------
# HGNN Model Definition - Compatible version
# ---------------------------
class FraudDetectionHGNN(torch.nn.Module):
    def __init__(self, hidden_channels, out_channels, metadata):
        super(FraudDetectionHGNN, self).__init__()
        # metadata: tuple (node_feature_dims, edge_types)
        self.embeddings = torch.nn.ModuleDict()
        for node_type, in_channels in metadata[0].items():
            self.embeddings[node_type] = Linear(in_channels, hidden_channels)

        # Check the signature of HGTConv by inspecting its source code or documentation
        # For older versions, use more compatible parameters
        try:
            # Try with newer version syntax first
            self.conv1 = HGTConv(hidden_channels, hidden_channels, metadata, heads=4)
            self.conv2 = HGTConv(hidden_channels, hidden_channels, metadata, heads=4)
        except TypeError:
            try:
                # Try with older version syntax
                self.conv1 = HGTConv(hidden_channels, hidden_channels, metadata)
                self.conv2 = HGTConv(hidden_channels, hidden_channels, metadata)
            except Exception as e:
                # If that fails too, use a simpler approach - manual message passing
                print(f"Warning: HGTConv failed to initialize: {e}")
                print("Using simple GNN layers instead.")
                
                # Replace HGTConv with basic Linear transformations
                self.lin1 = torch.nn.ModuleDict()
                self.lin2 = torch.nn.ModuleDict()
                
                for node_type in metadata[0].keys():
                    self.lin1[node_type] = Linear(hidden_channels, hidden_channels)
                    self.lin2[node_type] = Linear(hidden_channels, hidden_channels)

        # Output layer for fraud prediction on order nodes
        self.output = Linear(hidden_channels, out_channels)
        
        # Flag to indicate if we're using basic linear layers instead of HGTConv
        self.using_basic_layers = not hasattr(self, 'conv1')

    def forward(self, x_dict, edge_index_dict):
        # Compute initial embeddings for each node type
        h_dict = {node_type: self.embeddings[node_type](x) for node_type, x in x_dict.items()}
        
        if self.using_basic_layers:
            # Basic message passing (just a placeholder for proper HGTConv)
            h_dict1 = {ntype: F.leaky_relu(self.lin1[ntype](h)) for ntype, h in h_dict.items()}
            h_dict2 = {ntype: F.leaky_relu(self.lin2[ntype](h)) for ntype, h in h_dict1.items()}
            out = self.output(h_dict2['order'])
        else:
            # Use HGTConv layers
            h_dict = self.conv1(h_dict, edge_index_dict)
            h_dict = {ntype: F.leaky_relu(h) for ntype, h in h_dict.items()}
            
            h_dict = self.conv2(h_dict, edge_index_dict)
            h_dict = {ntype: F.leaky_relu(h) for ntype, h in h_dict.items()}
            
            # Output for the "order" node for fraud detection
            out = self.output(h_dict['order'])
            
        return out

# ---------------------------
# Training Pipeline
# ---------------------------
class FraudDetectionTrainer:
    def __init__(self, model, data, device=None):
        if device is None:
            device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.device = device
        self.model = model.to(self.device)
        self.data = data.to(self.device)

        self.optimizer = torch.optim.Adam(self.model.parameters(), lr=0.001, weight_decay=5e-4)

        # Address class imbalance in fraud prediction
        order_labels = self.data['order'].y
        pos_weight = (order_labels == 0).sum() / max((order_labels == 1).sum(), 1)  # Prevent division by zero
        self.criterion = torch.nn.BCEWithLogitsLoss(pos_weight=pos_weight)

    def train(self, epochs=100, patience=10):
        best_val_loss = float('inf')
        counter = 0

        for epoch in range(epochs):
            self.model.train()
            self.optimizer.zero_grad()
            out = self.model(
                {node_type: self.data[node_type].x for node_type in self.data.node_types},
                {edge_type: self.data[edge_type].edge_index for edge_type in self.data.edge_types}
            )
            train_mask = self.data['order'].train_mask
            loss = self.criterion(out[train_mask].squeeze(), self.data['order'].y[train_mask].float())
            loss.backward()
            self.optimizer.step()

            # Evaluate on validation data
            val_loss = self.evaluate(mode='val')
            print(f'Epoch: {epoch+1}, Train Loss: {loss.item():.4f}, Val Loss: {val_loss:.4f}')

            if val_loss < best_val_loss:
                best_val_loss = val_loss
                counter = 0
                torch.save(self.model.state_dict(), 'best_fraud_model.pt')
            else:
                counter += 1
                if counter >= patience:
                    print(f'Early stopping at epoch {epoch+1}')
                    break

    def evaluate(self, mode='val'):
        self.model.eval()
        with torch.no_grad():
            out = self.model(
                {node_type: self.data[node_type].x for node_type in self.data.node_types},
                {edge_type: self.data[edge_type].edge_index for edge_type in self.data.edge_types}
            )
            mask = self.data['order'].val_mask if mode == 'val' else self.data['order'].test_mask
            loss = self.criterion(out[mask].squeeze(), self.data['order'].y[mask].float())
            if mode == 'test':
                preds = torch.sigmoid(out[mask].squeeze()).cpu().numpy()
                labels = self.data['order'].y[mask].cpu().numpy()
                
                # Handle edge cases in evaluation
                if len(np.unique(labels)) < 2:
                    print("Warning: Test set contains only one class. AUC calculation skipped.")
                    auc = 0
                    ap = 0
                else:
                    auc = roc_auc_score(labels, preds)
                    ap = average_precision_score(labels, preds)
                
                # Only calculate precision-recall if we have positive samples
                if (labels == 1).sum() > 0:
                    precision, recall, thresholds = precision_recall_curve(labels, preds)
                    # Avoid division by zero
                    f1_scores = 2 * recall * precision / (recall + precision + 1e-6)
                    optimal_idx = np.argmax(f1_scores)
                    optimal_threshold = thresholds[optimal_idx] if optimal_idx < len(thresholds) else 0.5
                else:
                    optimal_threshold = 0.5
                    
                print(f'Test Loss: {loss.item():.4f}, AUC: {auc:.4f}, AP: {ap:.4f}')
                print(f'Optimal threshold: {optimal_threshold:.4f}')
            
            return loss.item()

    def test(self):
        # Check if model file exists, otherwise skip loading
        if os.path.exists('best_fraud_model.pt'):
            self.model.load_state_dict(torch.load('best_fraud_model.pt', map_location=self.device))
        else:
            print("Warning: No saved model found. Using current model state.")
        return self.evaluate(mode='test')

# ---------------------------
# Inference API
# ---------------------------
class FraudDetectionAPI:
    def __init__(self, model_path, data_processor, hidden_channels=64, threshold=0.5):
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.data_processor = data_processor
        self.threshold = threshold

        # Build a sample graph to extract metadata
        try:
            sample_data = self.data_processor.create_heterograph()
            metadata = (
                {node_type: sample_data[node_type].x.size(1) for node_type in sample_data.node_types},
                sample_data.edge_types
            )
            
            # Initialize model
            self.model = FraudDetectionHGNN(hidden_channels=hidden_channels, out_channels=1, metadata=metadata).to(self.device)
            
            # Load model if the file exists
            if os.path.exists(model_path):
                self.model.load_state_dict(torch.load(model_path, map_location=self.device))
                print(f"Model loaded from {model_path}")
            else:
                print(f"Warning: Model file {model_path} not found. Using untrained model.")
                
            self.model.eval()
        except Exception as e:
            print(f"Error initializing fraud detection API: {e}")
            raise

    def process_new_order(self, order_data):
        """Convert new order data into a mini-graph, perform inference, and return fraud probability."""
        try:
            graph_data = self._convert_order_to_graph(order_data)
            with torch.no_grad():
                out = self.model(
                    {node_type: graph_data[node_type].x.to(self.device) for node_type in graph_data.node_types},
                    {edge_type: graph_data[edge_type].edge_index.to(self.device) for edge_type in graph_data.edge_types}
                )
                fraud_prob = torch.sigmoid(out[0]).item()
                is_fraud = fraud_prob >= self.threshold
                
            return {
                'fraud_probability': float(fraud_prob),  # Ensure it's a Python float
                'is_fraud': bool(is_fraud),
                'order_id': order_data['order_id']
            }
        except Exception as e:
            print(f"Error processing order: {e}")
            return {
                'error': str(e),
                'fraud_probability': None,
                'is_fraud': None,
                'order_id': order_data.get('order_id', 'unknown')
            }

    def _convert_order_to_graph(self, order_data):
        data = HeteroData()
        
        # Update user node: remove 'user_avg_order_value' to match training features.
        data['user'].x = torch.tensor([[
            float(order_data.get('user_age', 0)),
            float(order_data.get('account_age_days', 0)),
            float(order_data.get('user_total_orders', 0))
        ]], dtype=torch.float)
        
        # Order node features remain the same.
        data['order'].x = torch.tensor([[
            float(order_data.get('order_amount', 0)),
            float(order_data.get('num_items', 0)),
            float(order_data.get('time_of_day', 0)),
            float(order_data.get('day_of_week', 0))
        ]], dtype=torch.float)
        
        # Payment node features (one-hot encoding)
        payment_dim = 4  # Adjust based on your payment types.
        payment_feature = torch.zeros((1, payment_dim))
        payment_idx = int(order_data.get('payment_type_idx', 0))
        if 0 <= payment_idx < payment_dim:
            payment_feature[0, payment_idx] = 1
        data['payment'].x = payment_feature
        
        # Set simple edge indices for the mini-graph.
        data[('user', 'places', 'order')].edge_index = torch.tensor([[0], [0]])
        data[('order', 'placed_by', 'user')].edge_index = torch.tensor([[0], [0]])
        data[('order', 'uses', 'payment')].edge_index = torch.tensor([[0], [0]])
        data[('payment', 'used_by', 'order')].edge_index = torch.tensor([[0], [0]])
        
        return data


# ---------------------------
# Flask API Setup
# ---------------------------
def create_fraud_detection_app(model_path, data_processor):
    app = Flask(__name__)
    
    # Initialize fraud API with robust error handling
    try:
        fraud_api = FraudDetectionAPI(model_path, data_processor)
    except Exception as e:
        print(f"Failed to initialize fraud detection API: {e}")
        # Create a dummy API that returns errors
        class DummyAPI:
            def process_new_order(self, order_data):
                return {
                    'error': 'Model initialization failed',
                    'fraud_probability': None,
                    'is_fraud': None,
                    'order_id': order_data.get('order_id', 'unknown')
                }
        fraud_api = DummyAPI()

    @app.route('/predict', methods=['POST'])
    def predict_fraud():
        try:
            # Get and validate input data
            if not request.is_json:
                return jsonify({'error': 'Request must be JSON'}), 400
                
            order_data = request.get_json()
            if not order_data:
                return jsonify({'error': 'Empty request body'}), 400
                
            # Check for minimum required fields
            if 'order_id' not in order_data:
                return jsonify({'error': 'Missing order_id field'}), 400

            # Process order and get prediction
            result = fraud_api.process_new_order(order_data)
            
            # Check if there was an error in processing
            if 'error' in result and result['error'] is not None:
                return jsonify({'error': result['error']}), 500
                
            return jsonify(result)
            
        except Exception as e:
            return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

    @app.route('/healthcheck', methods=['GET'])
    def healthcheck():
        return jsonify({'status': 'ok'}), 200

    return app

# ---------------------------
# Main Application
# ---------------------------
def main():
    print("Starting fraud detection system...")
    
    # File paths: update these paths based on your environment
    data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
    os.makedirs(data_dir, exist_ok=True)
    
    order_data_path = os.path.join(data_dir, 'orders.csv')
    user_data_path = os.path.join(data_dir, 'users.csv')
    payment_data_path = os.path.join(data_dir, 'payments.csv')

    # Check if data files exist
    missing_files = []
    for file_path in [order_data_path, user_data_path, payment_data_path]:
        if not os.path.exists(file_path):
            missing_files.append(os.path.basename(file_path))
    
    if missing_files:
        print(f"Warning: The following data files are missing: {', '.join(missing_files)}")
        print(f"Please place your data files in the {data_dir} directory.")
        print("Creating sample data files for demonstration...")
        
        # Create sample data files for demonstration
        create_sample_data(data_dir)

    try:
        # Initialize DataProcessor
        data_processor = DataProcessor(order_data_path, user_data_path, payment_data_path)
        
        # Create and split the heterogeneous graph
        print("Creating heterogeneous graph...")
        data = data_processor.create_heterograph()
        data = data_processor.split_data(data)

        # Define metadata for HGNN
        metadata = (
            {node_type: data[node_type].x.size(1) for node_type in data.node_types},
            data.edge_types
        )

        # Initialize and train the HGNN model
        print("Initializing fraud detection model...")
        hidden_channels = 64
        model = FraudDetectionHGNN(hidden_channels=hidden_channels, out_channels=1, metadata=metadata)
        
        print("Training model...")
        trainer = FraudDetectionTrainer(model, data)
        trainer.train(epochs=20, patience=5)  # Reduced epochs for faster testing
        test_metrics = trainer.test()
        
        model_path = 'best_fraud_model.pt'
        print(f"Model saved to {model_path}")

        # Start the Flask API
        print("Starting Flask API for fraud detection...")
        app = create_fraud_detection_app(model_path, data_processor)
        app.run(host='0.0.0.0', port=5000)
        
    except Exception as e:
        print(f"An error occurred: {e}")
        import traceback
        traceback.print_exc()

def create_sample_data(data_dir):
    """Create sample CSV files for demonstration purposes."""
    # Create sample users data
    users_data = {
        'user_id': range(1, 101),
        'age': np.random.randint(18, 80, 100),
        'account_age_days': np.random.randint(1, 1500, 100),
        'total_past_orders': np.random.randint(0, 50, 100)
    }
    users_df = pd.DataFrame(users_data)
    
    # Create sample payments data
    payment_types = ['credit_card', 'debit_card', 'paypal', 'bank_transfer']
    payments_data = {
        'payment_id': range(1, 101),
        'payment_type': np.random.choice(payment_types, 100)
    }
    payments_df = pd.DataFrame(payments_data)
    
    # Create sample orders data (with 5% fraud rate)
    num_orders = 200
    orders_data = {
        'order_id': range(1, num_orders + 1),
        'user_id': np.random.randint(1, 101, num_orders),
        'payment_id': np.random.randint(1, 101, num_orders),
        'order_amount': np.random.uniform(10, 500, num_orders),
        'num_items': np.random.randint(1, 10, num_orders),
        'is_fraud': np.random.choice([0, 1], num_orders, p=[0.95, 0.05])
    }
    orders_df = pd.DataFrame(orders_data)
    
    # Save to CSV
    users_df.to_csv(os.path.join(data_dir, 'users.csv'), index=False)
    payments_df.to_csv(os.path.join(data_dir, 'payments.csv'), index=False)
    orders_df.to_csv(os.path.join(data_dir, 'orders.csv'), index=False)
    
    print(f"Sample data files created in {data_dir}")

if __name__ == '__main__':
    main()