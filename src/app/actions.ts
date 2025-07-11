'use server';

import {
  generateNotificationMessage,
  type GenerateNotificationMessageInput,
} from '@/ai/flows/generate-notification-message';

export async function generateMessageAction(
  input: GenerateNotificationMessageInput
) {
  try {
    const result = await generateNotificationMessage(input);
    return { success: true, message: result.messageCopy };
  } catch (error) {
    console.error('Error generating notification message:', error);
    return {
      success: false,
      message: 'Failed to generate message. Please try again.',
    };
  }
}
