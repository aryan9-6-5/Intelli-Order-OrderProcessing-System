
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useFraudScore } from "@/hooks/use-fraud-detection";

interface FraudFeaturesDisplayProps {
  transactionId: string;
}

const FraudFeaturesDisplay = ({ transactionId }: FraudFeaturesDisplayProps) => {
  const { data: fraudScore, isLoading } = useFraudScore(transactionId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Risk Factors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-full h-6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!fraudScore || !fraudScore.features) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Risk Factors</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No risk factors available</p>
        </CardContent>
      </Card>
    );
  }

  // Extract top features based on importance
  // Note: This is a placeholder for the actual HGNN feature importance
  const topFeatures = [
    { name: "Unusual Location", value: 0.75 },
    { name: "Payment Method Mismatch", value: 0.65 },
    { name: "High Order Value", value: 0.48 },
    { name: "Recent Account Creation", value: 0.42 },
    { name: "Multiple Shipping Addresses", value: 0.31 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Risk Factors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topFeatures.map((feature) => (
            <div key={feature.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{feature.name}</span>
                <span className={feature.value > 0.6 ? "text-red-600 font-medium" : "text-muted-foreground"}>
                  {(feature.value * 100).toFixed(0)}%
                </span>
              </div>
              <Progress value={feature.value * 100} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FraudFeaturesDisplay;
