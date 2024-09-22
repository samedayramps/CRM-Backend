import { IQuote } from '../models/Quote';
import { ICustomer } from '../models/Customer';
import { Types } from 'mongoose';
import { generateAcceptanceToken } from '../utils/tokenUtils';

export function generateQuoteEmailTemplate(quote: IQuote, acceptUrl: string): string {
  const customerName = getCustomerName(quote);
  const acceptanceToken = quote._id ? generateAcceptanceToken(quote._id.toString()) : '';
  const acceptanceUrl = `${acceptUrl}?token=${acceptanceToken}`;

  // Generate the component list HTML
  const componentListHtml = quote.rampConfiguration.components.map(component => `
    <li>${component.quantity} x ${component.type} (${component.length} feet)</li>
  `).join('');

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
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 { color: #2c3e50; }
        .quote-details {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 5px;
          padding: 15px;
          margin-bottom: 20px;
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
      <h1>Your Same Day Ramps Quote</h1>
      
      <p>Hi ${customerName},</p>
      
      <p>Thanks for choosing Same Day Ramps. Here's a breakdown of your quote:</p>
      
      <div class="quote-details">
        <p>Ramp Length: ${quote.rampConfiguration.totalLength} feet</p>
        <p>Total Upfront Cost: $${quote.pricingCalculations.totalUpfront.toFixed(2)} (Includes delivery, installation, and future removal)</p>
        <p>Monthly Rental: $${quote.pricingCalculations.monthlyRentalRate.toFixed(2)}</p>
      </div>

      <h3>Ramp Components:</h3>
      <ul>
        ${componentListHtml}
      </ul>

      <h3>Ramp Details:</h3>
      <ul>
        <li>3 feet wide with handrails on both sides</li>
        <li>100% solid aluminum, supports up to 1000 pounds</li>
        <li>Installation takes 2-5 hours, depending on configuration</li>
      </ul>

      <h3>What you should know:</h3>
      <ul>
        <li>No minimum rental period - rent for as long as you need</li>
        <li>When you're done, we'll remove the ramp within 7 days at no extra cost</li>
        <li>The upfront cost covers delivery, installation, and future removal</li>
      </ul>

      <h3>What happens next:</h3>
      <ol>
        <li>If you're happy with the quote, click the link below to accept.</li>
        <li>Pay the upfront cost and sign the rental agreement.</li>
        <li>We'll deliver the ramp and install it at no hassle to you.</li>
      </ol>

      <p>
        <a href="${acceptanceUrl}" class="accept-button">Accept Quote</a>
      </p>

      <h3>Questions?</h3>
      <p>
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
    </body>
    </html>
  `;
}

function getCustomerName(quote: IQuote): string {
  if (quote.customerId) {
    if (quote.customerId instanceof Types.ObjectId) {
      return quote.customerName.split(' ')[0]; // Get first name
    } else {
      const customer = quote.customerId as ICustomer;
      return customer.firstName;
    }
  }
  return 'Valued Customer';
}