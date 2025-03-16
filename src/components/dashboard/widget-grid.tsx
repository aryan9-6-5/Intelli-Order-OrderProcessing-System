
import React from "react";
import { BarChart3, Box, CreditCard, ShieldAlert, ShoppingCart, Truck, PackageOpen, AlertTriangle } from "lucide-react";
import StatCard from "@/components/dashboard/stat-card";
import { cn } from "@/lib/utils";
import { DashboardRole } from "@/types";

interface WidgetGridProps {
  role: DashboardRole;
  className?: string;
}

const WidgetGrid = ({ role, className }: WidgetGridProps) => {
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
            />
            <StatCard
              title="Fraud Alerts"
              value="24"
              description="15 resolved this week"
              icon={<ShieldAlert className="h-4 w-4" />}
              trend={{ value: 6.2, positive: false }}
              className="animate-fade-in opacity-0 animation-delay-100"
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
              value="194320"
              description="Last 30 days"
              icon={<BarChart3 className="h-4 w-4" />}
              trend={{ value: 9.3, positive: true }}
              className="animate-fade-in opacity-0 animation-delay-300"
              isCurrency={true}
              currencyType="rupee"
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
              title="Stock Alerts"
              value="12"
              description="5 critical items"
              icon={<AlertTriangle className="h-4 w-4" />}
              trend={{ value: 3.2, positive: false }}
              className="animate-fade-in opacity-0 animation-delay-200"
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
              value="18"
              description="6 require attention"
              icon={<ShieldAlert className="h-4 w-4" />}
              className="animate-fade-in opacity-0 animation-delay-100"
            />
            <StatCard
              title="Pending Refunds"
              value="3240"
              description="Total value"
              icon={<CreditCard className="h-4 w-4" />}
              isCurrency={true}
              currencyType="rupee"
              className="animate-fade-in opacity-0 animation-delay-200"
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
