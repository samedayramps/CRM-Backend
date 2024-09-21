import { IQuote } from '../models/Quote';
import { ICustomer } from '../models/Customer';
import { Types } from 'mongoose';
import { generateAcceptanceToken } from '../utils/tokenUtils';

export function generateQuoteEmailTemplate(quote: IQuote, acceptUrl: string): string {
  let customerName = 'Valued Customer';
  
  if (quote.customerId) {
    if (quote.customerId instanceof Types.ObjectId) {
      // If customerId is an ObjectId, use the customerName from the quote
      customerName = quote.customerName;
    } else {
      // If customerId is a populated ICustomer
      const customer = quote.customerId as ICustomer;
      customerName = `${customer.firstName} ${customer.lastName}`;
    }
  }
  
  const acceptanceToken = quote._id ? generateAcceptanceToken(quote._id.toString()) : '';
  const acceptanceUrl = `${acceptUrl}?token=${acceptanceToken}`;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Quote from Same Day Ramps</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          color: #2c3e50;
        }
        .quote-details {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 5px;
          padding: 15px;
          margin-bottom: 20px;
        }
        .quote-details ul {
          list-style-type: none;
          padding-left: 0;
        }
        .accept-button {
          display: inline-block;
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Your Quote from Same Day Ramps</h1>
        <p>Dear ${customerName},</p>
        <p>Thank you for your interest in Same Day Ramps. We're pleased to provide you with the following quote:</p>
        
        <div class="quote-details">
          <h2>Quote Details</h2>
          <ul>
            <li><strong>Total Ramp Length:</strong> ${quote.rampConfiguration.totalLength} ft</li>
            <li><strong>Delivery Fee:</strong> $${quote.pricingCalculations.deliveryFee.toFixed(2)}</li>
            <li><strong>Install Fee:</strong> $${quote.pricingCalculations.installFee.toFixed(2)}</li>
            <li><strong>Monthly Rental Rate:</strong> $${quote.pricingCalculations.monthlyRentalRate.toFixed(2)}</li>
            <li><strong>Total Upfront Cost:</strong> $${quote.pricingCalculations.totalUpfront.toFixed(2)}</li>
          </ul>
        </div>

        <p>To accept this quote and proceed with your order, please click the button below:</p>
        
        <p>
          <a href="${acceptanceUrl}" class="accept-button">Accept Quote</a>
        </p>

        <p>If you have any questions or need further information, please don't hesitate to contact us. We're here to help!</p>

        <p>
          Best regards,<br>
          The Same Day Ramps Team
        </p>
      </div>
    </body>
    </html>
  `;
}