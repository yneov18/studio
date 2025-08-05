'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a summary report of a cementing operation.
 *
 * It includes:
 * - generateSummaryReport: The main function to trigger the report generation.
 * - GenerateSummaryReportInput: The input type definition for the function.
 * - GenerateSummaryReportOutput: The output type definition for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the generateSummaryReport function
const GenerateSummaryReportInputSchema = z.object({
  wellName: z.string().describe('The name of the well.'),
  jobDate: z.string().describe('The date of the cementing job.'),
  cementingData: z.string().describe('Detailed data from the cementing operation, including depth, slurry density, pump rate, and pressure.'),
  eventsLogged: z.string().describe('A log of events and changes made during the cementing job.'),
});
export type GenerateSummaryReportInput = z.infer<typeof GenerateSummaryReportInputSchema>;

// Define the output schema for the generateSummaryReport function
const GenerateSummaryReportOutputSchema = z.object({
  summaryReport: z.string().describe('A comprehensive summary report of the cementing operation.'),
});
export type GenerateSummaryReportOutput = z.infer<typeof GenerateSummaryReportOutputSchema>;

// Exported function to generate the summary report
export async function generateSummaryReport(input: GenerateSummaryReportInput): Promise<GenerateSummaryReportOutput> {
  return generateSummaryReportFlow(input);
}

// Define the prompt for generating the summary report
const generateSummaryReportPrompt = ai.definePrompt({
  name: 'generateSummaryReportPrompt',
  input: {schema: GenerateSummaryReportInputSchema},
  output: {schema: GenerateSummaryReportOutputSchema},
  prompt: `You are an experienced cementing supervisor. Generate a summary report of the cementing operation based on the following information. Highlight key events, anomalies, and areas for improvement.

Well Name: {{{wellName}}}
Job Date: {{{jobDate}}}
Cementing Data: {{{cementingData}}}
Events Logged: {{{eventsLogged}}}

Summary Report:`, // The LLM will complete this prompt.
});

// Define the flow for generating the summary report
const generateSummaryReportFlow = ai.defineFlow(
  {
    name: 'generateSummaryReportFlow',
    inputSchema: GenerateSummaryReportInputSchema,
    outputSchema: GenerateSummaryReportOutputSchema,
  },
  async input => {
    const {output} = await generateSummaryReportPrompt(input);
    return output!;
  }
);
