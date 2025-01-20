import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { validateEmail } from '../validators/email.validator';

const ses = new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});

interface EmailConfig {
    production: boolean;
    fromEmail: string;
    replyToEmail: string;
    sesRegion: string;
}

const emailConfig: EmailConfig = {
    production: process.env.NODE_ENV === 'production',
    fromEmail: process.env.AWS_SES_FROM_EMAIL!,
    replyToEmail: process.env.AWS_SES_REPLY_TO!,
    sesRegion: process.env.AWS_REGION!
};

interface EmailParams {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: EmailParams) {
    if (!emailConfig.production) {
        console.log('Development mode - Email would have been sent:', { to, subject });
        return;
    }

    validateEmail(to);

    const command = new SendEmailCommand({
        Source: emailConfig.fromEmail,
        Destination: { ToAddresses: [to] },
        Message: {
            Subject: { Data: subject },
            Body: { Html: { Data: html } }
        },
        ReplyToAddresses: [emailConfig.replyToEmail]
    });

    try {
        await ses.send(command);
    } catch (error) {
        console.error('SES Error:', error);
        throw new Error('Failed to send email');
    }
}

export async function sendConfirmationEmail(
  toEmail: string,
  data: { firstName: string; endDate: Date }
) {
  const command = new SendEmailCommand({
    Source: process.env.AWS_SES_FROM_EMAIL,
    Destination: {
      ToAddresses: [toEmail]
    },
    Message: {
      Subject: {
        Data: 'AutoDaft: Your Property Search Automation is Active'
      },
      Body: {
        Text: {
          Data: `Hello ${data.firstName},\n\n` +
            `Your property search automation has been set up successfully. ` +
            `We'll search for properties matching your criteria until ${data.endDate.toLocaleDateString()}.\n\n` +
            `You'll receive notifications when we apply to properties on your behalf.\n\n` +
            `Best regards,\nAutoDaft Team`
        }
      }
    }
  });

  try {
    await ses.send(command);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function sendApplicationNotification(
  toEmail: string,
  data: { propertyDetails: any; userDetails: any }
) {
  const command = new SendEmailCommand({
    Source: process.env.AWS_SES_FROM_EMAIL,
    Destination: {
      ToAddresses: [toEmail]
    },
    Message: {
      Subject: {
        Data: 'AutoDaft: New Property Application Submitted'
      },
      Body: {
        Text: {
          Data: `Hello ${data.userDetails.firstName},\n\n` +
            `We've submitted an application for a property matching your criteria:\n\n` +
            `Property: ${data.propertyDetails.title}\n` +
            `Location: ${data.propertyDetails.location}\n` +
            `Price: €${data.propertyDetails.price}\n` +
            `Reference: ${data.propertyDetails.reference}\n\n` +
            `Best regards,\nAutoDaft Team`
        }
      }
    }
  });

  try {
    await ses.send(command);
  } catch (error) {
    console.error('Error sending application notification:', error);
    throw error;
  }
} 