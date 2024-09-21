import nodemailer from 'nodemailer';
import { Quote, IQuote } from '../models/Quote';
import { CustomError } from '../utils/CustomError';
import { generateQuoteEmailTemplate } from '../templates/quoteEmail';
import { Customer, ICustomer } from '../models/Customer';
import { Types } from 'mongoose';

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
    html: generateQuoteEmailTemplate(populatedQuote, acceptUrl),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new CustomError('Failed to send quote email', 500);
  }
}