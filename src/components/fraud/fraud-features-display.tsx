
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useFraudScore } from "@/hooks/fraud";

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

  // Extract features from the fraud score
  const features = fraudScore.features;
  
  // Convert features object to array of {name, value} for display
  const featureArray = Object.entries(features).map(([name, value]) => ({
    name: name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    value: typeof value === 'number' ? value : 0.5 // Default to 0.5 if not a number
  }));
  
  // Sort by importance (value) descending
  const topFeatures = featureArray.sort((a, b) => b.value - a.value).slice(0, 5);

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
