import { IQuote } from '../models/Quote';
import { ICustomer } from '../models/Customer';
import { Types } from 'mongoose';
import { generateAcceptanceToken } from '../utils/tokenUtils';

export function generateQuoteEmailTemplate(quote: IQuote, acceptUrl: string): string {
  const customerName = getCustomerName(quote);
  const acceptanceToken = quote._id ? generateAcceptanceToken(quote._id.toString()) : '';
  const acceptanceUrl = `${acceptUrl}?token=${acceptanceToken}`;

  const componentListHtml = quote.rampConfiguration.components.map(component => `
    <li style="margin-bottom: 5px;">${component.quantity} x ${component.length}-foot ${component.type}</li>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Same Day Ramps Quote</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #2c3e50; font-size: 24px; margin-bottom: 20px;">Your Same Day Ramps Quote</h1>
  
  <p style="margin-bottom: 15px;">Hi ${customerName},</p>
  
  <p style="margin-bottom: 20px;">Thanks for choosing Same Day Ramps. Here's a breakdown of your quote:</p>
  
  <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 5px; padding: 15px; margin-bottom: 20px;">
    <h3 style="color: #2c3e50; font-size: 18px; margin-bottom: 10px;">Your Ramp Configuration:</h3>
    <ul style="list-style-type: none; padding-left: 0; margin: 0;">
      <li style="margin-bottom: 5px;">Total Length: ${quote.rampConfiguration.totalLength} feet</li>
      ${componentListHtml}
      <li style="margin-bottom: 5px;">Width: 3 feet with handrails on both sides</li>
      <li style="margin-bottom: 5px;">Material: 100% solid aluminum, supports up to 1000 pounds</li>
    </ul>
  </div>

  <div style="background-color: #fff9c4; border: 1px solid #fff59d; border-radius: 5px; padding: 15px; margin-bottom: 20px;">
    <p style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Total Upfront Cost: $${quote.pricingCalculations.totalUpfront.toFixed(2)}</p>
    <p style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Monthly Rental: $${quote.pricingCalculations.monthlyRentalRate.toFixed(2)}</p>
    <p style="font-size: 14px; font-style: italic; margin-bottom: 15px;">Upfront cost includes delivery, installation, and future removal</p>
  </div>

  <div style="text-align: center; margin-bottom: 30px;">
    <a href="${acceptanceUrl}" style="display: inline-block; background-color: #fdd835; color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px; text-transform: uppercase; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Accept Quote</a>
  </div>

  <div style="margin-bottom: 20px;">
    <h3 style="color: #2c3e50; font-size: 18px; margin-bottom: 10px;">What happens next:</h3>
    <ol style="padding-left: 20px; margin: 0;">
      <li style="margin-bottom: 5px;">If you're happy with the quote, click the "Accept Quote" button above.</li>
      <li style="margin-bottom: 5px;">Pay the upfront cost and sign the rental agreement.</li>
      <li style="margin-bottom: 5px;">We'll deliver the ramp and install it at no hassle to you.</li>
    </ol>
  </div>

  <div style="margin-bottom: 20px;">
    <h3 style="color: #2c3e50; font-size: 18px; margin-bottom: 10px;">What you should know:</h3>
    <ul style="padding-left: 20px; margin: 0;">
      <li style="margin-bottom: 5px;">No minimum rental period - rent for as long as you need</li>
      <li style="margin-bottom: 5px;">When you're done, we'll remove the ramp within 7 days at no extra cost</li>
      <li style="margin-bottom: 5px;">The upfront cost covers delivery, installation, and future removal</li>
      <li style="margin-bottom: 5px;">Installation takes 2-5 hours, depending on configuration</li>
    </ul>
  </div>

  <div style="margin-bottom: 20px;">
    <h3 style="color: #2c3e50; font-size: 18px; margin-bottom: 10px;">Questions?</h3>
    <p>
      We're here to help. Reach out anytime:<br>
      - Call us: (940) 373-5713<br>
      - Email: <a href="mailto:ty@samedayramps.com" style="color: #3498db; text-decoration: none;">ty@samedayramps.com</a>
    </p>
  </div>

  <p style="margin-bottom: 20px;">Thanks again for considering us. We're looking forward to helping you out!</p>

  <p style="margin-bottom: 20px;">
    Best,<br>
    Ty Walls | Same Day Ramps
  </p>

  <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">

  <p style="font-size: 14px; color: #7f8c8d;">
    Same Day Ramps | 6008 Windridge Ln, Flower Mound TX | <a href="https://www.samedayramps.com" style="color: #3498db; text-decoration: none;">www.samedayramps.com</a>
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