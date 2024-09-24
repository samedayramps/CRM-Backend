import nodemailer from 'nodemailer';
import { Job, IJob } from '../models/Job';
import { CustomError } from '../utils/CustomError';
import { generateQuoteEmailTemplate } from '../templates/quoteEmail';
import { Types } from 'mongoose';
import { generateFollowUpEmailTemplate } from '../templates/followUpEmail';

// Configure the email transporter
const transporter = nodemailer.createTransport({
  // Configure your email service here
  // For example, using Gmail:
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendQuoteEmail(job: IJob): Promise<void> {
  if (!job.customerInfo) {
    throw new CustomError('Invalid customer data in job', 400);
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: job.customerInfo.email,
    subject: 'Your Quote from Same Day Ramps',
    html: generateQuoteEmailTemplate(job),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new CustomError('Failed to send quote email', 500);
  }
}

export async function sendFollowUpEmail(job: IJob, paymentLink: string, signatureLink: string): Promise<void> {
  if (!job.customerInfo) {
    throw new CustomError('Invalid customer data in job', 400);
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: job.customerInfo.email,
    subject: 'Next Steps for Your Same Day Ramps Quote',
    html: await generateFollowUpEmailTemplate(job, paymentLink, signatureLink),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending follow-up email:', error);
    throw new CustomError('Failed to send follow-up email', 500);
  }
}