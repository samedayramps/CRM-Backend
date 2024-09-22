import nodemailer from 'nodemailer';
import { Quote, IQuote } from '../models/Quote';
import { CustomError } from '../utils/CustomError';
import { generateQuoteEmailTemplate } from '../templates/quoteEmail';
import { Customer, ICustomer } from '../models/Customer';
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

export async function sendQuoteEmail(quote: IQuote): Promise<void> {
  if (!quote.customerId) {
    throw new CustomError('Invalid customer data in quote', 400);
  }

  // Populate the customer data if it's not already populated
  const populatedQuote = await Quote.findById(quote._id).populate('customerId');
  if (!populatedQuote || !populatedQuote.customerId) {
    throw new CustomError('Failed to populate quote data', 500);
  }

  let customerEmail: string;

  if (populatedQuote.customerId instanceof Types.ObjectId) {
    // If customerId is still an ObjectId, fetch the customer separately
    const customer = await Customer.findById(populatedQuote.customerId);
    if (!customer) {
      throw new CustomError('Customer not found', 404);
    }
    customerEmail = customer.email;
  } else {
    // If customerId is already populated
    const customer = populatedQuote.customerId as ICustomer;
    customerEmail = customer.email;
  }

  const acceptUrl = `${process.env.FRONTEND_URL}/quotes/${quote._id}/accept`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: 'Your Quote from Same Day Ramps',
    html: generateQuoteEmailTemplate(populatedQuote),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new CustomError('Failed to send quote email', 500);
  }
}

export async function sendFollowUpEmail(quote: IQuote, paymentLink: string, signatureLink: string): Promise<void> {
  if (!quote.customerId) {
    throw new CustomError('Invalid customer data in quote', 400);
  }

  const customer = quote.customerId instanceof Types.ObjectId
    ? await Customer.findById(quote.customerId)
    : quote.customerId as ICustomer;

  if (!customer) {
    throw new CustomError('Customer not found', 404);
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customer.email,
    subject: 'Next Steps for Your Same Day Ramps Quote',
    html: await generateFollowUpEmailTemplate(quote, paymentLink, signatureLink),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending follow-up email:', error);
    throw new CustomError('Failed to send follow-up email', 500);
  }
}