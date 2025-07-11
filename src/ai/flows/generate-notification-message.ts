'use server';

/**
 * @fileOverview A flow for generating notification message copy based on a layout template.
 *
 * - generateNotificationMessage - A function that generates notification message copy.
 * - GenerateNotificationMessageInput - The input type for the generateNotificationMessage function.
 * - GenerateNotificationMessageOutput - The return type for the generateNotificationMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNotificationMessageInputSchema = z.object({
  layoutTemplate: z
    .string()
    .describe('The layout template for the notification message.'),
  tone: z.string().optional().describe('The desired tone of the message.'),
});
export type GenerateNotificationMessageInput = z.infer<
  typeof GenerateNotificationMessageInputSchema
>;

const GenerateNotificationMessageOutputSchema = z.object({
  messageCopy: z.string().describe('The generated message copy.'),
});
export type GenerateNotificationMessageOutput = z.infer<
  typeof GenerateNotificationMessageOutputSchema
>;

export async function generateNotificationMessage(
  input: GenerateNotificationMessageInput
): Promise<GenerateNotificationMessageOutput> {
  return generateNotificationMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNotificationMessagePrompt',
  input: {schema: GenerateNotificationMessageInputSchema},
  output: {schema: GenerateNotificationMessageOutputSchema},
  prompt: `You are an expert copywriter specializing in creating notification messages.

  Based on the provided layout template and desired tone, generate compelling message copy for a notification.

  Layout Template: {{{layoutTemplate}}}
  Tone: {{tone}}

  Message Copy:`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const generateNotificationMessageFlow = ai.defineFlow(
  {
    name: 'generateNotificationMessageFlow',
    inputSchema: GenerateNotificationMessageInputSchema,
    outputSchema: GenerateNotificationMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
