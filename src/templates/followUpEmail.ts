import { IJob } from '../models/Job';

export async function generateFollowUpEmailTemplate(job: IJob, paymentLink: string, signatureLink: string): Promise<string> {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Next Steps for Your Same Day Ramps Quote</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #2c3e50; font-size: 24px; margin-bottom: 20px;">Thank You for Accepting Your Quote</h1>
      
      <p>Dear ${job.customerInfo.firstName},</p>
      
      <p>Thank you for accepting your Same Day Ramps quote. To complete your order, please follow these steps:</p>
      
      <ol>
        <li><a href="${paymentLink}" style="color: #3498db;">Make your payment</a></li>
        <li><a href="${signatureLink}" style="color: #3498db;">Sign the agreement</a></li>
      </ol>
      
      <p>Once both steps are completed, we'll be in touch to confirm your installation date.</p>
      
      <p>If you have any questions, please don't hesitate to contact us.</p>
      
      <p>
        Best regards,<br>
        The Same Day Ramps Team
      </p>
    </body>
    </html>
  `;
}