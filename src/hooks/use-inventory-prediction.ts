
import { useQuery } from "@tanstack/react-query";
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
      // Check if we have a recent forecast
      const { data: existingForecast, error: fetchError } = await supabase
        .from('product_forecasts')
        .select('*')
        .eq('product_id', productId)
        .single();
        
      if (existingForecast) {
        return existingForecast as ProductForecast;
      }
      
      // If no existing forecast, request a new one from the Edge Function
      // that runs the LSTM model
      const { data, error } = await supabase.functions.invoke('inventory-forecast', {
        body: { productId, forecastDays: days },
      });
      
      if (error) {
        console.error('Error generating forecast:', error);
        return null;
      }
      
      return data as ProductForecast;
    },
    enabled: !!productId,
  });
};

// Fetches restock recommendations from the MARL model
export const useRestockRecommendations = (productId?: string) => {
  return useQuery({
    queryKey: ['restock-recommendations', productId],
    queryFn: async () => {
      let query = supabase
        .from('restock_recommendations')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (productId) {
        query = query.eq('product_id', productId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching restock recommendations:', error);
        return [];
      }
      
      return data as RestockRecommendation[];
    },
  });
};

// Fetches agent decision explanations
export const useAgentDecisionExplanation = (productId: string) => {
  return useQuery({
    queryKey: ['agent-explanation', productId],
    queryFn: async () => {
      // This would call your Edge Function that explains the MARL agent's decision
      const { data, error } = await supabase.functions.invoke('explain-agent-decision', {
        body: { productId },
      });
      
      if (error) {
        console.error('Error fetching agent explanation:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!productId,
  });
};
