
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

// Mock data for development until the actual tables are populated
export const mockForecasts: Record<string, ProductForecast> = {
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

export const mockRecommendations: Record<string, RestockRecommendation[]> = {
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
