import type { SuggestParameterAdjustmentsOutput } from "@/ai/flows/suggest-parameter-adjustments";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, Lightbulb, Loader2 } from "lucide-react";

type AiCardProps = {
  onGetRecommendations: () => void;
  recommendation: SuggestParameterAdjustmentsOutput | null;
  isLoading: boolean;
};

export default function AiCard({ onGetRecommendations, recommendation, isLoading }: AiCardProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Bot />
          AI-Driven Recommendations
        </CardTitle>
        <CardDescription>
          Get real-time parameter adjustment suggestions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={onGetRecommendations} disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Lightbulb className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Analyzing..." : "Get AI Recommendations"}
        </Button>
        {isLoading && <RecommendationSkeleton />}
        {recommendation && !isLoading && (
          <div className="space-y-3 pt-2 text-sm">
            <div>
              <h4 className="font-semibold text-foreground">Pump Rate:</h4>
              <p className="text-muted-foreground">{recommendation.pumpRateRecommendation}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Slurry Density:</h4>
              <p className="text-muted-foreground">{recommendation.slurryDensityRecommendation}</p>
            </div>
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-semibold text-primary">Reasoning:</h4>
              <p className="text-muted-foreground">{recommendation.reasoning}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const RecommendationSkeleton = () => (
    <div className="space-y-3 pt-2">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/4 mt-2" />
      <Skeleton className="h-4 w-2/4" />
      <div className="p-3 bg-muted/50 rounded-lg space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
)
