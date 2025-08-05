'use server';
/**
 * @fileOverview AI-driven recommendations for adjusting pump rate or slurry density during cementing.
 *
 * - suggestParameterAdjustments - A function that analyzes cementing data and suggests adjustments.
 * - SuggestParameterAdjustmentsInput - The input type for the suggestParameterAdjustments function.
 * - SuggestParameterAdjustmentsOutput - The return type for the suggestParameterAdjustments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestParameterAdjustmentsInputSchema = z.object({
  depth: z.number().describe('Current depth of the well in feet.'),
  diameter: z.number().describe('Diameter of the wellbore in inches.'),
  slurryDensity: z.number().describe('Current density of the cement slurry in pounds per gallon.'),
  pumpRate: z.number().describe('Current pump rate in barrels per minute.'),
  pressure: z.number().describe('Current pressure in psi.'),
  geologicalInfo: z
    .string()
    .describe('Geological information about the wellbore.'),
  historicalData: z
    .string()
    .optional()
    .describe(
      'Historical data from similar cementing jobs in the area, if available.'
    ),
});
export type SuggestParameterAdjustmentsInput = z.infer<
  typeof SuggestParameterAdjustmentsInputSchema
>;

const SuggestParameterAdjustmentsOutputSchema = z.object({
  pumpRateRecommendation: z
    .string()
    .describe('Recommendation for adjusting the pump rate.'),
  slurryDensityRecommendation: z
    .string()
    .describe('Recommendation for adjusting the slurry density.'),
  reasoning: z.string().describe('Explanation for the suggested adjustments.'),
});
export type SuggestParameterAdjustmentsOutput = z.infer<
  typeof SuggestParameterAdjustmentsOutputSchema
>;

export async function suggestParameterAdjustments(
  input: SuggestParameterAdjustmentsInput
): Promise<SuggestParameterAdjustmentsOutput> {
  return suggestParameterAdjustmentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestParameterAdjustmentsPrompt',
  input: {schema: SuggestParameterAdjustmentsInputSchema},
  output: {schema: SuggestParameterAdjustmentsOutputSchema},
  prompt: `You are an expert cementing engineer providing real-time recommendations during a cementing job.

  Analyze the following cementing data and suggest adjustments to the pump rate or slurry density to optimize the cementing process and prevent potential issues.

  Well Data:
  - Depth: {{{depth}}} feet
  - Diameter: {{{diameter}}} inches
  - Slurry Density: {{{slurryDensity}}} pounds per gallon
  - Pump Rate: {{{pumpRate}}} barrels per minute
  - Pressure: {{{pressure}}} psi
  - Geological Information: {{{geologicalInfo}}}  

  Historical Data (if available): {{{historicalData}}}

  Based on this data, provide recommendations for adjusting the pump rate and slurry density, along with a clear explanation of your reasoning.

  Output your answer in JSON format.
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const suggestParameterAdjustmentsFlow = ai.defineFlow(
  {
    name: 'suggestParameterAdjustmentsFlow',
    inputSchema: SuggestParameterAdjustmentsInputSchema,
    outputSchema: SuggestParameterAdjustmentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
