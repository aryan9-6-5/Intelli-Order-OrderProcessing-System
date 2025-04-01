
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useFraudScore } from "@/hooks/fraud";
import { AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react";

interface FraudScoreBadgeProps {
  transactionId: string;
  showScore?: boolean;
}

const FraudScoreBadge = ({ transactionId, showScore = false }: FraudScoreBadgeProps) => {
  const { data: fraudScore, isLoading } = useFraudScore(transactionId);

  if (isLoading) {
    return <Skeleton className="w-20 h-6" />;
  }

  if (!fraudScore) {
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-800">
        Not Scored
      </Badge>
    );
  }

  const score = fraudScore.risk_score;
  let badgeContent;

  if (score > 0.75) {
    badgeContent = (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center gap-1">
        <ShieldAlert className="h-3 w-3" />
        {showScore ? `Critical (${(score * 100).toFixed(0)}%)` : "Critical Risk"}
      </Badge>
    );
  } else if (score > 0.5) {
    badgeContent = (
      <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        {showScore ? `High (${(score * 100).toFixed(0)}%)` : "High Risk"}
      </Badge>
    );
  } else if (score > 0.25) {
    badgeContent = (
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        {showScore ? `Medium (${(score * 100).toFixed(0)}%)` : "Medium Risk"}
      </Badge>
    );
  } else {
    badgeContent = (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1">
        <ShieldCheck className="h-3 w-3" />
        {showScore ? `Low (${(score * 100).toFixed(0)}%)` : "Low Risk"}
      </Badge>
    );
  }

  return badgeContent;
};

export default FraudScoreBadge;
