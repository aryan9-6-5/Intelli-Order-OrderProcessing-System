
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Types for inventory predictions
export interface ProductForecast {
  id: string;
  product_id: string;
  forecast_data: {
    daily_forecast: Array<{
      date: string;
      mean: number;
      upper_bound: number;
      lower_bound: number;
    }>;
    summary: {
      total_demand: number;
      peak_day: string;
      confidence: number;
    };
  };
  updated_at: string;
}

export interface RestockRecommendation {
  id: string;
  product_id: string;
  recommended_quantity: number;
  confidence_score: number;
  reasoning: string;
  source: 'lstm' | 'marl' | 'manual';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

// Fetches demand forecast for a specific product
export const useProductForecast = (productId: string, days: number = 30) => {
  return useQuery({
    queryKey: ['product-forecast', productId, days],
    queryFn: async () => {
      try {
        // First try to fetch from Supabase
        const { data, error } = await supabase
          .from('product_forecasts')
          .select('*')
          .eq('product_id', productId)
          .single();
        
        if (error) {
          console.error('Error fetching product forecast:', error);
          
          // Fallback to mock data if no data in database
          if (error.code === 'PGRST116') { // No rows returned
            return mockForecasts[productId] || null;
          }
          
          throw error;
        }
        
        return data as ProductForecast;
      } catch (error) {
        console.error('Error in useProductForecast:', error);
        return mockForecasts[productId] || null;
      }
    },
    enabled: !!productId,
  });
};

// Fetches restock recommendations from the MARL model
export const useRestockRecommendations = (productId?: string) => {
  return useQuery({
    queryKey: ['restock-recommendations', productId],
    queryFn: async () => {
      try {
        let query = supabase
          .from('restock_recommendations')
          .select('*');
        
        if (productId) {
          query = query.eq('product_id', productId);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching restock recommendations:', error);
          
          // Fallback to mock data if no data in database
          if (error.code === 'PGRST116' || (data && data.length === 0)) {
            if (productId) {
              return mockRecommendations[productId] || [];
            } else {
              return Object.values(mockRecommendations).flat();
            }
          }
          
          throw error;
        }
        
        return data as RestockRecommendation[];
      } catch (error) {
        console.error('Error in useRestockRecommendations:', error);
        if (productId) {
          return mockRecommendations[productId] || [];
        } else {
          return Object.values(mockRecommendations).flat();
        }
      }
    },
  });
};

// Update restock recommendation status
export const useUpdateRestockRecommendation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      status 
    }: { 
      id: string; 
      status: 'pending' | 'approved' | 'rejected'; 
    }) => {
      try {
        const { data, error } = await supabase
          .from('restock_recommendations')
          .update({
            status,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select();
          
        if (error) {
          console.error('Error updating restock recommendation:', error);
          throw error;
        }
        
        return data[0] as RestockRecommendation;
      } catch (error) {
        console.error('Error in useUpdateRestockRecommendation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch restock recommendations queries
      queryClient.invalidateQueries({ queryKey: ['restock-recommendations'] });
    },
  });
};

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

// Mock data for development until the actual tables are populated
const mockForecasts: Record<string, ProductForecast> = {
  "PRD-1001": {
    id: "pf-1",
    product_id: "PRD-1001",
    forecast_data: {
      daily_forecast: Array.from({ length: 14 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const baseDemand = 50 + Math.sin(i / 2) * 20;
        return {
          date: date.toISOString().split('T')[0],
          mean: baseDemand,
          upper_bound: baseDemand * 1.2,
          lower_bound: baseDemand * 0.8
        };
      }),
      summary: {
        total_demand: 720,
        peak_day: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
        confidence: 0.85
      }
    },
    updated_at: new Date().toISOString()
  },
  "PRD-1002": {
    id: "pf-2",
    product_id: "PRD-1002",
    forecast_data: {
      daily_forecast: Array.from({ length: 14 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const baseDemand = 30 + Math.cos(i / 2) * 10;
        return {
          date: date.toISOString().split('T')[0],
          mean: baseDemand,
          upper_bound: baseDemand * 1.25,
          lower_bound: baseDemand * 0.75
        };
      }),
      summary: {
        total_demand: 420,
        peak_day: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        confidence: 0.78
      }
    },
    updated_at: new Date().toISOString()
  }
};

const mockRecommendations: Record<string, RestockRecommendation[]> = {
  "PRD-1001": [
    {
      id: "rr-1",
      product_id: "PRD-1001",
      recommended_quantity: 500,
      confidence_score: 0.92,
      reasoning: "Based on forecasted demand peak in 5 days and current inventory levels, we recommend restocking 500 units to maintain optimal inventory balance while minimizing holding costs.",
      source: "marl",
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  "PRD-1002": [
    {
      id: "rr-2",
      product_id: "PRD-1002",
      recommended_quantity: 250,
      confidence_score: 0.85,
      reasoning: "Recent sales pattern shows increased demand. LSTM model predicts 420 units needed in next 14 days, balanced against holding costs.",
      source: "lstm",
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
};
