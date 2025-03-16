
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductForecast } from "@/hooks/use-inventory-prediction";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, Area, ComposedChart
} from "recharts";

interface ForecastChartProps {
  productId: string;
  days?: number;
}

const ForecastChart = ({ productId, days = 14 }: ForecastChartProps) => {
  const { data: forecast, isLoading } = useProductForecast(productId, days);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Demand Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[200px]" />
        </CardContent>
      </Card>
    );
  }

  if (!forecast || !forecast.forecast_data || !forecast.forecast_data.daily_forecast) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Demand Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No forecast data available</p>
        </CardContent>
      </Card>
    );
  }

  // Format dates for display
  const chartData = forecast.forecast_data.daily_forecast.map(day => ({
    ...day,
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Demand Forecast (Next {days} Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="upper_bound" 
                fill="#f1f5f9" 
                stroke="#94a3b8" 
                name="Potential Range" 
              />
              <Line 
                type="monotone" 
                dataKey="mean" 
                stroke="#0ea5e9" 
                strokeWidth={2} 
                dot={{ r: 4 }} 
                name="Predicted Demand" 
              />
              <Line 
                type="monotone" 
                dataKey="lower_bound" 
                stroke="#94a3b8" 
                strokeDasharray="3 3" 
                dot={false} 
                name="Lower Bound" 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        {forecast.forecast_data.summary && (
          <div className="grid grid-cols-3 gap-4 mt-4 text-center text-sm">
            <div>
              <p className="text-muted-foreground">Total Predicted</p>
              <p className="font-semibold">{forecast.forecast_data.summary.total_demand} units</p>
            </div>
            <div>
              <p className="text-muted-foreground">Peak Day</p>
              <p className="font-semibold">{new Date(forecast.forecast_data.summary.peak_day).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Confidence</p>
              <p className="font-semibold">{(forecast.forecast_data.summary.confidence * 100).toFixed(0)}%</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ForecastChart;
