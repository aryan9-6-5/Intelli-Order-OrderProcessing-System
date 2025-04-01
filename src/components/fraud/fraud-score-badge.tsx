
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useFraudScore } from "@/hooks/fraud";
import { AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react";

interface FraudScoreBadgeProps {
  transactionId: string;
  showScore?: boolean;
  score?: number; // Add this optional prop to directly pass a score
}

const FraudScoreBadge = ({ transactionId, showScore = false, score }: FraudScoreBadgeProps) => {
  const { data: fraudScore, isLoading } = useFraudScore(transactionId);
  
  // Use the directly provided score if available, otherwise use the fetched score
  const riskScore = score !== undefined ? score : (fraudScore?.risk_score || 0);

  if (isLoading && score === undefined) {
    return <Skeleton className="w-20 h-6" />;
  }

  if (!fraudScore && score === undefined) {
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-800">
        Not Scored
      </Badge>
    );
  }

  let badgeContent;

  if (riskScore > 0.75) {
    badgeContent = (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center gap-1">
        <ShieldAlert className="h-3 w-3" />
        {showScore ? `Critical (${(riskScore * 100).toFixed(0)}%)` : "Critical Risk"}
      </Badge>
    );
  } else if (riskScore > 0.5) {
    badgeContent = (
      <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        {showScore ? `High (${(riskScore * 100).toFixed(0)}%)` : "High Risk"}
      </Badge>
    );
  } else if (riskScore > 0.25) {
    badgeContent = (
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        {showScore ? `Medium (${(riskScore * 100).toFixed(0)}%)` : "Medium Risk"}
      </Badge>
    );
  } else {
    badgeContent = (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1">
        <ShieldCheck className="h-3 w-3" />
        {showScore ? `Low (${(riskScore * 100).toFixed(0)}%)` : "Low Risk"}
      </Badge>
    );
  }

  return badgeContent;
};

export default FraudScoreBadge;
