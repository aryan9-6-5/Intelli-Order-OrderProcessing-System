
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, AlertTriangle, Cpu } from "lucide-react";
import { useRestockRecommendations } from "@/hooks/use-inventory-prediction";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface RestockRecommendationProps {
  productId: string;
}

const getSourceIcon = (source: string) => {
  switch (source) {
    case 'lstm':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">LSTM Model</Badge>;
    case 'marl':
      return <Badge variant="outline" className="bg-purple-100 text-purple-800">MARL Agent</Badge>;
    case 'manual':
      return <Badge variant="outline">Manual</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const RestockRecommendation = ({ productId }: RestockRecommendationProps) => {
  const { data: recommendations, isLoading } = useRestockRecommendations(productId);
  const { toast } = useToast();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Restock Recommendation</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[120px]" />
        </CardContent>
      </Card>
    );
  }
  
  // Find the most recent recommendation for this product
  const recommendation = recommendations?.[0];
  
  if (!recommendation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Restock Recommendation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-4">
            <AlertTriangle className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No restock recommendations available</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const handleApprove = () => {
    // This would call an API to approve the recommendation
    toast({
      title: "Recommendation approved",
      description: `Restock order for ${recommendation.recommended_quantity} units has been created.`,
    });
  };
  
  const handleReject = () => {
    // This would call an API to reject the recommendation
    toast({
      title: "Recommendation rejected",
      description: "The recommendation has been rejected.",
    });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Restock Recommendation</CardTitle>
        <div className="flex items-center gap-2">
          {getSourceIcon(recommendation.source)}
          <Cpu className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Recommended Order Quantity</p>
            <p className="text-3xl font-bold mt-1">{recommendation.recommended_quantity}</p>
            <div className="flex items-center justify-center mt-1">
              <p className="text-xs text-muted-foreground">
                Confidence: {(recommendation.confidence_score * 100).toFixed(0)}%
              </p>
            </div>
          </div>
          
          {recommendation.reasoning && (
            <div className="bg-muted/40 p-3 rounded-md text-sm">
              <p className="font-medium mb-1">Reasoning:</p>
              <p className="text-muted-foreground">{recommendation.reasoning}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={handleReject}>
          Reject
        </Button>
        <Button size="sm" onClick={handleApprove}>
          Approve
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RestockRecommendation;
