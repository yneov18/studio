import type { Dispatch, SetStateAction } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Hourglass } from "lucide-react";

type ProgressCardProps = {
  progress: number;
  setProgress: Dispatch<SetStateAction<number>>;
};

export default function ProgressCard({ progress, setProgress }: ProgressCardProps) {
  const getStage = (p: number) => {
    if (p < 40) return "Lead Slurry";
    if (p < 80) return "Tail Slurry";
    return "Displacement";
  };

  const stage = getStage(progress);
  let stageColorClass = "bg-primary/70";
  if (stage === 'Tail Slurry') stageColorClass = "bg-primary";
  if (stage === 'Displacement') stageColorClass = "bg-accent";


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Hourglass />
          Cementing Progress
        </CardTitle>
        <CardDescription>
          Current stage: <span className="font-semibold text-primary">{stage}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
          <span>Lead Slurry</span>
          <span>Tail Slurry</span>
          <span>Displacement</span>
        </div>
        <Progress value={progress} className="h-4">
            <div className="h-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}>
              <div className={`h-full rounded-full ${stageColorClass}`} />
            </div>
        </Progress>
        <div className="flex items-center gap-4 pt-2">
            <span className="text-sm font-medium">Progress: {progress}%</span>
            <Slider
              value={[progress]}
              onValueChange={(value) => setProgress(value[0])}
              max={100}
              step={1}
            />
        </div>
      </CardContent>
    </Card>
  );
}
