import { SESClient } from '@aws-sdk/client-ses';

export function validateSESConfig(): void {
  if (!process.env.AWS_SES_FROM_EMAIL) {
    throw new Error('AWS SES sender email not configured');
  }
  // Add other AWS config validations
} 