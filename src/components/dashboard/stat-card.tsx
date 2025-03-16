
import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
  isCurrency?: boolean;
  currencyType?: 'rupee' | 'dollar';
  loading?: boolean;
  modelPowered?: boolean;
}

const formatCurrency = (value: string | number, currencyType: 'rupee' | 'dollar' = 'rupee'): string => {
  if (typeof value === 'string' && !value.trim()) return value;
  
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : value;
  
  if (isNaN(numValue)) return String(value);
  
  if (currencyType === 'rupee') {
    // Convert dollar to rupee (approximate conversion rate)
    const rupeeValue = numValue * 83.5; // Using an approximate conversion rate
    return `₹${rupeeValue.toLocaleString('en-IN')}`;
  } else {
    return `$${numValue.toLocaleString('en-US')}`;
  }
};

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  className,
  isCurrency = false,
  currencyType = 'rupee',
  loading = false,
  modelPowered = false
}: StatCardProps) => {
  const displayValue = isCurrency ? formatCurrency(value, currencyType) : value;
  
  if (loading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon && (
            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
              {icon}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
          {title}
          {modelPowered && (
            <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-sm">
              AI
            </span>
          )}
        </CardTitle>
        {icon && (
          <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{displayValue}</div>
        {(description || trend) && (
          <div className="flex items-center mt-1">
            {trend && (
              <span 
                className={cn(
                  "text-xs font-medium mr-2",
                  trend.positive ? "text-green-500" : "text-destructive"
                )}
              >
                {trend.positive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
