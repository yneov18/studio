"use server";

import { generateSummaryReport, type GenerateSummaryReportInput } from "@/ai/flows/generate-summary-report";
import { suggestParameterAdjustments, type SuggestParameterAdjustmentsInput } from "@/ai/flows/suggest-parameter-adjustments";

export async function getAiSuggestions(input: SuggestParameterAdjustmentsInput) {
  try {
    const result = await suggestParameterAdjustments(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("AI suggestion error:", error);
    return { success: false, error: "Failed to get AI suggestions. Please try again." };
  }
}

export async function getSummaryReportAction(input: GenerateSummaryReportInput) {
  try {
    const result = await generateSummaryReport(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Report generation error:", error);
    return { success: false, error: "Failed to generate summary report. Please try again." };
  }
}
