
import React from "react";
import { BarChart3, Box, CreditCard, ShieldAlert, ShoppingCart, Truck, PackageOpen, AlertTriangle, TrendingUp } from "lucide-react";
import StatCard from "@/components/dashboard/stat-card";
import { cn } from "@/lib/utils";
import { DashboardRole } from "@/types";
import { useFraudCases, useFraudStatistics } from "@/hooks/fraud";
import { useProductForecast } from "@/hooks/inventory";

interface WidgetGridProps {
  role: DashboardRole;
  className?: string;
}

const WidgetGrid = ({ role, className }: WidgetGridProps) => {
  // Fetch statistics data for AI-powered widgets
  const { data: fraudStats, isLoading: loadingFraudStats } = useFraudStatistics();
  const { data: productForecast } = useProductForecast("PRD-1001"); // Using a default product ID
  
  // Use dynamic data from our database
  const highRiskCount = fraudStats?.highRiskCount || 0;
  const mediumRiskCount = fraudStats?.mediumRiskCount || 0;
  const lowRiskCount = fraudStats?.lowRiskCount || 0;
  const clearedCount = fraudStats?.clearedCount || 0;
  const totalFraudAmount = fraudStats?.totalAmount || 0;
  
  const forecastedDemand = productForecast?.forecast_data?.summary?.total_demand || 720; // Default value matching the image
  
  // Render different widgets based on user role
  const renderWidgets = () => {
    switch (role) {
      case "admin":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Orders"
              value="3,567"
              description="Last 30 days"
              icon={<ShoppingCart className="h-4 w-4" />}
              trend={{ value: 12.5, positive: true }}
              className="animate-fade-in opacity-0"
              loading={loadingFraudStats}
            />
            <StatCard
              title="Fraud Alerts"
              value={(highRiskCount + mediumRiskCount).toString()}
              description="Based on AI risk scoring"
              icon={<ShieldAlert className="h-4 w-4" />}
              trend={{ value: 6.2, positive: false }}
              className="animate-fade-in opacity-0 animation-delay-100"
              modelPowered={true}
              loading={loadingFraudStats}
            />
            <StatCard
              title="Low Stock Items"
              value="18"
              description="Requires attention"
              icon={<Box className="h-4 w-4" />}
              className="animate-fade-in opacity-0 animation-delay-200"
            />
            <StatCard
              title="Revenue"
              value={totalFraudAmount.toString()}
              description="Last 30 days"
              icon={<BarChart3 className="h-4 w-4" />}
              trend={{ value: 9.3, positive: true }}
              className="animate-fade-in opacity-0 animation-delay-300"
              isCurrency={true}
              currencyType="rupee"
              loading={loadingFraudStats}
            />
          </div>
        );
      case "warehouse":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Pending Orders"
              value="87"
              description="24 urgent"
              icon={<ShoppingCart className="h-4 w-4" />}
              trend={{ value: 16.8, positive: true }}
              className="animate-fade-in opacity-0"
            />
            <StatCard
              title="Shipments Today"
              value="156"
              description="34 delivered"
              icon={<Truck className="h-4 w-4" />}
              trend={{ value: 8.3, positive: true }}
              className="animate-fade-in opacity-0 animation-delay-100"
            />
            <StatCard
              title="Forecasted Demand"
              value={forecastedDemand.toString()}
              description="Next 7 days"
              icon={<TrendingUp className="h-4 w-4" />}
              trend={{ value: 11.2, positive: true }}
              className="animate-fade-in opacity-0 animation-delay-200"
              modelPowered={true}
            />
            <StatCard
              title="Processing Time"
              value="1.8h"
              description="Avg. time per order"
              icon={<PackageOpen className="h-4 w-4" />}
              trend={{ value: 5.7, positive: true }}
              className="animate-fade-in opacity-0 animation-delay-300"
            />
          </div>
        );
      case "support":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              title="Support Tickets"
              value="43"
              description="12 new today"
              icon={<ShoppingCart className="h-4 w-4" />}
              className="animate-fade-in opacity-0"
            />
            <StatCard
              title="Fraud Disputes"
              value={highRiskCount.toString()}
              description="AI-detected high risk cases"
              icon={<ShieldAlert className="h-4 w-4" />}
              className="animate-fade-in opacity-0 animation-delay-100"
              modelPowered={true}
              loading={loadingFraudStats}
            />
            <StatCard
              title="Pending Refunds"
              value={Math.round(totalFraudAmount * 0.15).toString()}
              description="Total value"
              icon={<CreditCard className="h-4 w-4" />}
              isCurrency={true}
              currencyType="rupee"
              className="animate-fade-in opacity-0 animation-delay-200"
              loading={loadingFraudStats}
            />
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className={cn("w-full", className)}>
      {renderWidgets()}
    </div>
  );
};

export default WidgetGrid;
