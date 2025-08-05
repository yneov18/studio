"use client";

import { useState } from "react";
import type { GenerateSummaryReportOutput } from "@/ai/flows/generate-summary-report";
import type { SuggestParameterAdjustmentsOutput } from "@/ai/flows/suggest-parameter-adjustments";
import { useToast } from "@/hooks/use-toast";
import { getAiSuggestions, getSummaryReportAction } from "./actions";
import AiCard from "@/components/cement-track/ai-card";
import DataInputCard from "@/components/cement-track/data-input-card";
import EventLogCard from "@/components/cement-track/event-log-card";
import Header from "@/components/cement-track/header";
import ProgressCard from "@/components/cement-track/progress-card";
import ReportCard from "@/components/cement-track/report-card";

export type WellData = {
  wellName: string;
  jobDate: string;
  depth: number;
  diameter: number;
  geologicalInfo: string;
};

export type RealTimeParams = {
  slurryDensity: number;
  pumpRate: number;
  pressure: number;
};

export default function CementTrackPage() {
  const { toast } = useToast();
  const [wellData, setWellData] = useState<WellData>({
    wellName: "Well-734",
    jobDate: new Date().toISOString().split("T")[0],
    depth: 12000,
    diameter: 8.5,
    geologicalInfo: "Mainly sandstone with shale layers.",
  });

  const [realTimeParams, setRealTimeParams] = useState<RealTimeParams>({
    slurryDensity: 15.8,
    pumpRate: 5.2,
    pressure: 2200,
  });

  const [events, setEvents] = useState<string[]>([
    "14:30 - Began pumping lead slurry.",
    "13:45 - Pressure test successful.",
    "13:00 - Job started.",
  ]);

  const [progress, setProgress] = useState(25);

  const [aiRecommendation, setAiRecommendation] =
    useState<SuggestParameterAdjustmentsOutput | null>(null);
  const [summaryReport, setSummaryReport] =
    useState<GenerateSummaryReportOutput | null>(null);
  const [isRecommendationLoading, setIsRecommendationLoading] = useState(false);
  const [isReportLoading, setIsReportLoading] = useState(false);

  const handleGetRecommendations = async () => {
    setIsRecommendationLoading(true);
    setAiRecommendation(null);
    const input = {
      ...wellData,
      ...realTimeParams,
      historicalData: "Previous jobs in this field required higher density slurry.",
    };
    const result = await getAiSuggestions(input);
    if (result.success && result.data) {
      setAiRecommendation(result.data);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }
    setIsRecommendationLoading(false);
  };

  const handleGenerateReport = async () => {
    setIsReportLoading(true);
    setSummaryReport(null);
    const cementingData = `Final Parameters: Slurry Density: ${realTimeParams.slurryDensity} ppg, Pump Rate: ${realTimeParams.pumpRate} bpm, Pressure: ${realTimeParams.pressure} psi.`;
    const eventsLogged = events.join("\n");
    const input = {
      wellName: wellData.wellName,
      jobDate: wellData.jobDate,
      cementingData,
      eventsLogged,
    };
    const result = await getSummaryReportAction(input);
    if (result.success && result.data) {
      setSummaryReport(result.data);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }
    setIsReportLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 flex flex-col gap-6">
            <DataInputCard
              wellData={wellData}
              setWellData={setWellData}
              realTimeParams={realTimeParams}
              setRealTimeParams={setRealTimeParams}
            />
            <ProgressCard progress={progress} setProgress={setProgress} />
          </div>

          <div className="md:col-span-1 flex flex-col gap-6">
            <AiCard
              onGetRecommendations={handleGetRecommendations}
              recommendation={aiRecommendation}
              isLoading={isRecommendationLoading}
            />
            <EventLogCard events={events} setEvents={setEvents} />
            <ReportCard
              onGenerateReport={handleGenerateReport}
              report={summaryReport}
              isLoading={isReportLoading}
              setReport={setSummaryReport}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
