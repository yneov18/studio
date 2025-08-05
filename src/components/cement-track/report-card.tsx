import type { Dispatch, SetStateAction } from "react";
import type { GenerateSummaryReportOutput } from "@/ai/flows/generate-summary-report";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileSignature, Loader2 } from "lucide-react";

type ReportCardProps = {
  onGenerateReport: () => void;
  report: GenerateSummaryReportOutput | null;
  isLoading: boolean;
  setReport: Dispatch<SetStateAction<GenerateSummaryReportOutput | null>>;
};

export default function ReportCard({
  onGenerateReport,
  report,
  isLoading,
  setReport,
}: ReportCardProps) {
  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileSignature />
            Report Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={onGenerateReport} disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileSignature className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Generating..." : "Generate Summary Report"}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={!!report} onOpenChange={(open) => !open && setReport(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Cementing Operation Summary Report</DialogTitle>
            <DialogDescription>
              A comprehensive summary of the job, including all data and events.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] p-1">
            <div className="p-4 prose prose-sm dark:prose-invert whitespace-pre-wrap">
                {report?.summaryReport}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
