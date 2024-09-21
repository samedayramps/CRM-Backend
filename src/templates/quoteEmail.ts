import { IQuote } from '../models/Quote';
import { ICustomer } from '../models/Customer';
import { Types } from 'mongoose';
import { generateAcceptanceToken } from '../utils/tokenUtils';

export function generateQuoteEmailTemplate(quote: IQuote, acceptUrl: string): string {
  let customerName = 'Valued Customer';
  
  if (quote.customerId) {
    if (quote.customerId instanceof Types.ObjectId) {
      // If customerId is an ObjectId, use the customerName from the quote
      customerName = quote.customerName.split(' ')[0]; // Get first name
    } else {
      // If customerId is a populated ICustomer
      const customer = quote.customerId as ICustomer;
      customerName = customer.firstName;
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
      <title>Your Same Day Ramps Quote</title>
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
        <h1>Your Same Day Ramps Quote</h1>
        
        <p>Hi ${customerName},</p>
        
        <p>Thanks for choosing Same Day Ramps. Here's a simple breakdown of your quote:</p>
        
        <div class="quote-details">
          <ul>
            <li>Ramp Length: ${quote.rampConfiguration.totalLength} feet</li>
            <li>Delivery Fee: $${quote.pricingCalculations.deliveryFee.toFixed(2)}</li>
            <li>Install Fee: $${quote.pricingCalculations.installFee.toFixed(2)}</li>
            <li>Monthly Rental: $${quote.pricingCalculations.monthlyRentalRate.toFixed(2)}</li>
            <li>Total Upfront Cost: $${quote.pricingCalculations.totalUpfront.toFixed(2)}</li>
          </ul>
        </div>

        <p>What happens next:</p>
        <ol>
          <li>If you're happy with the quote, click the link below to accept.</li>
          <li>Pay the upfront cost and sign the rental agreement.</li>
          <li>We'll deliver the ramp and install it at no hassle to you.</li>
        </ol>

        <p>
          <a href="${acceptanceUrl}" class="accept-button">Accept Quote</a>
        </p>

        <p>
          <strong>Questions?</strong><br>
          We're here to help. Reach out anytime:<br>
          - Call us: (940) 373-5713<br>
          - Email: ty@samedayramps.com
        </p>

        <p>Thanks again for considering us. We're looking forward to helping you out!</p>

        <p>
          Best,<br>
          Ty Walls | Same Day Ramps
        </p>

        <hr>

        <p>
          Same Day Ramps | 6008 Windridge Ln, Flower Mound TX | <a href="https://www.samedayramps.com">www.samedayramps.com</a>
        </p>
      </div>
    </body>
    </html>
  `;
}