import { IQuote } from '../models/Quote';
import { ICustomer } from '../models/Customer';
import { Types } from 'mongoose';
import { generateAcceptanceToken } from '../utils/tokenUtils';

export function generateQuoteEmailTemplate(quote: IQuote, acceptUrl: string): string {
  const customerName = getCustomerName(quote);
  const acceptanceToken = quote._id ? generateAcceptanceToken(quote._id.toString()) : '';
  const acceptanceUrl = `${acceptUrl}?token=${acceptanceToken}`;

  const componentListHtml = quote.rampConfiguration.components.map(component => `
    <li>${component.quantity} x ${component.length}-foot ${component.type}</li>
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
        h1, h2, h3 { 
          color: #2c3e50; 
        }
        .quote-summary {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 5px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .quote-summary p {
          margin: 10px 0;
          font-size: 18px;
        }
        .ramp-details {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 5px;
          padding: 15px;
          margin-bottom: 20px;
        }
        .ramp-details ul {
          list-style-type: none;
          padding-left: 0;
        }
        .ramp-details li {
          margin-bottom: 10px;
        }
        .accept-button {
          display: inline-block;
          background-color: #ebfd2a;
          color: #000000;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          font-size: 18px;
          text-align: center;
          margin-top: 20px;
        }
        .section {
          margin-bottom: 30px;
        }
      </style>
    </head>
    <body>
      <h1>Your Same Day Ramps Quote</h1>
      
      <p>Hi ${customerName},</p>
      
      <p>Thanks for choosing Same Day Ramps. Here's a breakdown of your quote:</p>
      
      <div class="ramp-details">
        <h3>Your Ramp Configuration:</h3>
        <ul>
          <li>Total Length: ${quote.rampConfiguration.totalLength} feet</li>
          ${componentListHtml}
          <li>Width: 3 feet with handrails on both sides</li>
          <li>Material: 100% solid aluminum, supports up to 1000 pounds</li>
        </ul>
      </div>

      <div class="quote-summary">
        <p><strong>Total Upfront Cost:</strong> $${quote.pricingCalculations.totalUpfront.toFixed(2)}</p>
        <p><strong>Monthly Rental:</strong> $${quote.pricingCalculations.monthlyRentalRate.toFixed(2)}</p>
        <p><em>Upfront cost includes delivery, installation, and future removal</em></p>
        <a href="${acceptanceUrl}" class="accept-button">Accept Quote</a>
      </div>

      <div class="section">
        <h3>What happens next:</h3>
        <ol>
          <li>If you're happy with the quote, click the "Accept Quote" button above.</li>
          <li>Pay the upfront cost and sign the rental agreement.</li>
          <li>We'll deliver the ramp and install it at no hassle to you.</li>
        </ol>
      </div>

      <div class="section">
        <h3>What you should know:</h3>
        <ul>
          <li>No minimum rental period - rent for as long as you need</li>
          <li>When you're done, we'll remove the ramp within 7 days at no extra cost</li>
          <li>The upfront cost covers delivery, installation, and future removal</li>
          <li>Installation takes 2-5 hours, depending on configuration</li>
        </ul>
      </div>

      <div class="section">
        <h3>Questions?</h3>
        <p>
          We're here to help. Reach out anytime:<br>
          - Call us: (940) 373-5713<br>
          - Email: ty@samedayramps.com
        </p>
      </div>

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