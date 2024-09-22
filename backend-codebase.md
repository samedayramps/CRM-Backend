# tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "types": ["node"],
    "typeRoots": ["./node_modules/@types"],
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

# package.json

```json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "dist/server.js",
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc",
    "dev": "ts-node-dev --respawn src/server.ts",
    "postinstall": "npm run build",
    "test": "NODE_ENV=test jest",
    "seed:pricing-variables": "ts-node src/scripts/seedPricingVariables.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.13",
    "@types/node": "^22.5.5",
    "@types/nodemailer": "^6.4.16",
    "@types/supertest": "^6.0.2",
    "jest": "^29.7.0",
    "supertest": "^7.0.0",
    "ts-jest": "^29.2.5",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.6.2"
  },
  "dependencies": {
    "@types/stripe": "^8.0.417",
    "axios": "^1.7.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.0",
    "express-rate-limit": "^7.4.0",
    "express-validator": "^7.2.0",
    "mongoose": "^8.6.3",
    "nodemailer": "^6.9.15",
    "stripe": "^16.12.0"
  },
  "engines": {
    "node": "20.x"
  }
}

```

# jest.config.js

```js
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setupTests.ts'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  maxWorkers: 1, // Run tests serially
};
```

# error.log

```log

```

# combined.log

```log

```

# .gitignore

```
# Dependencies
node_modules/
npm-debug.log
yarn-error.log
yarn-debug.log

# Build output
dist/
build/

# Environment variables
.env
.env.local
.env.*.local
.env.development
.env.test
.env.production

# IDE and editor files
.vscode/
.idea/
*.swp
*.swo
.DS_Store

# Logs
logs
*.log

# Testing
coverage/

# Temporary files
tmp/
temp/

# TypeScript
*.tsbuildinfo

# Miscellaneous
.cache/
.tmp/
*.bak
*.tmp
*.temp

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db.env
.env.local
.env.test

```

# src/server.ts

```ts
import app from './app';
import connectToDatabase from './api/api';

const port = process.env.PORT || 3000;

const startServer = async () => {
  await connectToDatabase();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
```

# src/index.ts

```ts
import app from './app';

export default app;
```

# src/app.ts

```ts
import express from 'express';
import cors from 'cors';
import rentalRequestsRouter from './routes/rentalRequests';
import customersRouter from './routes/customers';
import quotesRouter from './routes/quotes';
import pricingVariablesRouter from './routes/pricingVariables';
import calculatePricingRouter from './routes/calculatePricing';
import paymentsRouter from './routes/payments';
import stripeWebhooksRouter from './routes/stripeWebhooks';
import esignatureWebhooksRouter from './routes/esignatureWebhooks';
import { errorHandler } from './middlewares/errorHandler';
import dotenv from 'dotenv';
import path from 'path';
import manualSignatureRouter from './routes/manualSignature';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('Starting application...');

const app = express();

console.log('Express app created');

// Updated CORS configuration
const allowedOrigins = [
  'https://form.samedayramps.com',
  'http://localhost:3001',
  'https://app.samedayramps.com',
  'https://samedayramps.netlify.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  exposedHeaders: ['Location'],
}));

console.log('CORS middleware added');

// **Move webhook routes before express.json()**
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhooksRouter);
app.use('/api/webhooks/esignature', esignatureWebhooksRouter);

// Global middleware for JSON requests
app.use(express.json());

// Handle OPTIONS requests
app.options('*', cors());

// Non-webhook routes
app.use('/api/rental-requests', rentalRequestsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/quotes', quotesRouter);
app.use('/api/pricing-variables', pricingVariablesRouter);
app.use('/api/calculate-pricing', calculatePricingRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/manual-signature', manualSignatureRouter);

// Error handling middleware (should be last)
app.use(errorHandler);

console.log('Application setup complete');

export default app;
```

# src/utils/validationRules.ts

```ts
import { body } from 'express-validator';

export const pricingVariablesRules = [
  body('warehouseAddress').isString().notEmpty(),
  body('baseDeliveryFee').isFloat({ min: 0 }),
  body('deliveryFeePerMile').isFloat({ min: 0 }),
  body('baseInstallFee').isFloat({ min: 0 }),
  body('installFeePerComponent').isFloat({ min: 0 }),
  body('monthlyRentalRatePerFt').isFloat({ min: 0 }),
];

export const quoteRules = [
  body('customerId').isMongoId(),
  body('customerName').isString().notEmpty(),
  body('rampConfiguration').isObject(),
  body('rampConfiguration.components').isArray().notEmpty(),
  body('rampConfiguration.components.*.type').isIn(['ramp', 'landing']),
  body('rampConfiguration.components.*.length').isFloat({ min: 0 }),
  body('rampConfiguration.components.*.width').optional().isFloat({ min: 0 }),
  body('rampConfiguration.totalLength').isFloat({ min: 0 }),
  body('pricingCalculations').isObject(),
  body('pricingCalculations.deliveryFee').isFloat({ min: 0 }),
  body('pricingCalculations.installFee').isFloat({ min: 0 }),
  body('pricingCalculations.monthlyRentalRate').isFloat({ min: 0 }),
  body('pricingCalculations.totalUpfront').isFloat({ min: 0 }),
  body('pricingCalculations.distance').isFloat({ min: 0 }),
  body('pricingCalculations.warehouseAddress').isString().notEmpty(),
  body('status').isIn(['draft', 'sent', 'accepted', 'paid', 'completed']),
];

export const customerRules = [
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('phone').trim().notEmpty(),
  body('email').isEmail(),
  body('installAddress').trim().notEmpty(),
  body('mobilityAids').isArray(),
  // Removed: body('preferredContactMethod').optional().isIn(['email', 'phone', 'text']),
  body('notes').optional().trim(),
];

export const rentalRequestRules = [
  body('customerInfo.firstName').trim().notEmpty(),
  body('customerInfo.lastName').trim().notEmpty(),
  body('customerInfo.email').isEmail(),
  body('customerInfo.phone').trim().notEmpty(),
  body('rampDetails.knowRampLength').isBoolean(),
  body('rampDetails.rampLength').optional().isFloat({ min: 0 }),
  body('rampDetails.knowRentalDuration').isBoolean(),
  body('rampDetails.rentalDuration').optional().isInt({ min: 1 }),
  body('rampDetails.installTimeframe').isIn([
    'Within 24 hours',
    'Within 2 days',
    'Within 3 days',
    'Within 1 week',
    'Over 1 week'
  ]),
  body('rampDetails.mobilityAids').isArray(),
  body('rampDetails.mobilityAids.*').isIn(['wheelchair', 'motorized_scooter', 'walker_cane', 'none']),
  body('installAddress').trim().notEmpty(),
];
```

# src/utils/tokenUtils.ts

```ts
import crypto from 'crypto';

const SECRET_KEY = process.env.TOKEN_SECRET_KEY || 'your-secret-key';
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function generateAcceptanceToken(quoteId: string): string {
  const timestamp = Date.now();
  const data = `${quoteId}-${timestamp}`;
  const hash = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('hex');
  return `${timestamp}.${hash}`;
}

export function verifyAcceptanceToken(quoteId: string, token: string): boolean {
  const [timestamp, hash] = token.split('.');
  if (!timestamp || !hash) return false;

  const now = Date.now();
  if (now - parseInt(timestamp) > TOKEN_EXPIRY) return false;

  const data = `${quoteId}-${timestamp}`;
  const expectedHash = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('hex');
  return hash === expectedHash;
}
```

# src/utils/pushNotification.ts

```ts
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PUSHOVER_API_URL = 'https://api.pushover.net/1/messages.json';

export const sendPushNotification = async (title: string, message: string) => {
  try {
    const response = await axios.post(PUSHOVER_API_URL, {
      token: process.env.PUSHOVER_API_TOKEN,
      user: process.env.PUSHOVER_USER_KEY,
      title,
      message,
    });

    if (response.status !== 200) {
      throw new Error(`Failed to send push notification: ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Error sending push notification:', error);
  }
};
```

# src/utils/emailNotification.ts

```ts
import { IRentalRequest } from '../models/RentalRequest';
import { sendEmail } from './email';

export const sendRentalRequestNotification = async (rentalRequest: IRentalRequest) => {
  const emailBody = prepareEmailBody(rentalRequest);
  await sendEmail('ty@samedayramps.com', 'New Rental Request Received', emailBody);
};

const prepareEmailBody = (rentalRequest: IRentalRequest): string => {
  return `
    <h2>New Rental Request Received</h2>
    <p>Customer: ${rentalRequest.customerInfo.firstName} ${rentalRequest.customerInfo.lastName}</p>
    <p>Email: ${rentalRequest.customerInfo.email}</p>
    <p>Phone: ${rentalRequest.customerInfo.phone}</p>
    <p>Install Address: ${rentalRequest.installAddress}</p>
    <h3>Ramp Details:</h3>
    <ul>
      <li>Ramp Length: ${rentalRequest.rampDetails.knowRampLength ? rentalRequest.rampDetails.rampLength + ' feet' : 'Unknown'}</li>
      <li>Rental Duration: ${rentalRequest.rampDetails.knowRentalDuration ? rentalRequest.rampDetails.rentalDuration + ' months' : 'Unknown'}</li>
      <li>Install Timeframe: ${rentalRequest.rampDetails.installTimeframe}</li>
      <li>Mobility Aids: ${rentalRequest.rampDetails.mobilityAids.join(', ')}</li>
    </ul>
  `;
};
```

# src/utils/email.ts

```ts
// src/utils/email.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your email service provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER!,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};
```

# src/utils/CustomError.ts

```ts
export class CustomError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

# src/templates/quoteEmail.ts

```ts
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

  <div style="background-color: #fafde5; border: 1px solid #ebfd2a; border-radius: 5px; padding: 15px; margin-bottom: 20px;">
    <p style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Total Upfront Cost: $${quote.pricingCalculations.totalUpfront.toFixed(2)}</p>
    <p style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Monthly Rental: $${quote.pricingCalculations.monthlyRentalRate.toFixed(2)}</p>
    <p style="font-size: 14px; font-style: italic; margin-bottom: 15px;">Upfront cost includes delivery, installation, and future removal</p>
  </div>

  <div style="text-align: center; margin-bottom: 30px;">
    <a href="${acceptanceUrl}" style="display: inline-block; background-color: #ebfd2a; color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px; text-transform: uppercase; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Accept Quote</a>
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
```

# src/services/stripeService.ts

```ts
import Stripe from 'stripe';
import { IQuote } from '../models/Quote';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function generateStripePaymentLink(quote: IQuote): Promise<string> {
  console.log('Generating payment link for quote:', quote._id);
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Ramp Rental - Upfront Payment',
          },
          unit_amount: Math.round(quote.pricingCalculations.totalUpfront * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,
    metadata: {
      quoteId: quote._id.toString(),
    },
  });

  console.log('Stripe session created:', session.id);
  console.log('Payment intent created:', session.payment_intent);

  // Save the payment intent ID to the quote
  quote.paymentIntentId = session.payment_intent as string;
  await quote.save();

  console.log('Quote updated with payment intent ID:', quote.paymentIntentId);
  console.log('Updated quote:', JSON.stringify(quote, null, 2));

  return session.url!;
}
```

# src/services/pricingService.ts

```ts
import { PricingVariables } from '../models/PricingVariables';
import { calculateDistance } from './distanceCalculation';
import { CustomError } from '../utils/CustomError';

interface RampComponent {
  type: 'ramp' | 'landing';
  length: number;
  quantity: number;
}

interface RampConfiguration {
  components: RampComponent[];
  totalLength: number;
}

export async function calculatePricing(rampConfiguration: RampConfiguration, installAddress: string, warehouseAddress: string) {
  console.log('Received in calculatePricing:', { rampConfiguration, installAddress, warehouseAddress });

  if (!installAddress || !warehouseAddress) {
    throw new CustomError('Install address and warehouse address are required', 400);
  }

  const variables = await PricingVariables.findOne().sort({ updatedAt: -1 });

  if (!variables) {
    throw new CustomError('Pricing variables not set', 500);
  }

  try {
    const { distance } = await calculateDistance(warehouseAddress, installAddress);

    const deliveryFee = variables.baseDeliveryFee + 
      variables.deliveryFeePerMile * distance;

    // Calculate install fee based on the quantity of each component
    const installFee = variables.baseInstallFee + 
      rampConfiguration.components.reduce((total, component) => {
        return total + (variables.installFeePerComponent * component.quantity);
      }, 0);

    const monthlyRentalRate = variables.rentalRatePerFt * rampConfiguration.totalLength;

    const totalUpfront = deliveryFee + installFee;

    return {
      deliveryFee,
      installFee,
      monthlyRentalRate,
      totalUpfront,
      distance,
      warehouseAddress,
    };
  } catch (error) {
    console.error('Error in calculatePricing:', error);
    throw error;
  }
}
```

# src/services/emailService.ts

```ts
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

export async function sendFollowUpEmail(quote: IQuote, paymentLink: string, signatureLink: string): Promise<void> {
  if (!quote.customerId) {
    throw new CustomError('Invalid customer data in quote', 400);
  }

  let customerEmail: string;
  let customerName: string;

  if (quote.customerId instanceof Types.ObjectId) {
    const customer = await Customer.findById(quote.customerId);
    if (!customer) {
      throw new CustomError('Customer not found', 404);
    }
    customerEmail = customer.email;
    customerName = `${customer.firstName} ${customer.lastName}`;
  } else {
    const customer = quote.customerId as ICustomer;
    customerEmail = customer.email;
    customerName = `${customer.firstName} ${customer.lastName}`;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: 'Next Steps for Your Same Day Ramps Quote',
    html: `
      <h1>Thank you for accepting your quote!</h1>
      <p>Dear ${customerName},</p>
      <p>To complete your order, please follow these steps:</p>
      <ol>
        <li><a href="${paymentLink}">Make your payment</a></li>
        <li><a href="${signatureLink}">Sign the agreement</a></li>
      </ol>
      <p>If you have any questions, please don't hesitate to contact us.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending follow-up email:', error);
    throw new CustomError('Failed to send follow-up email', 500);
  }
}
```

# src/services/distanceCalculation.ts

```ts
import axios from 'axios';
import { CustomError } from '../utils/CustomError';

interface DistanceResult {
  distance: number; // in miles
  duration: number; // in seconds
}

export async function calculateDistance(warehouseAddress: string, installAddress: string): Promise<DistanceResult> {
  try {
    console.log('Calculating distance:', { warehouseAddress, installAddress }); // Add this line for debugging

    if (!warehouseAddress || !installAddress) {
      throw new CustomError('Warehouse address and install address are required', 400);
    }

    if (!process.env.GOOGLE_MAPS_API_KEY) {
      throw new CustomError('Google Maps API key is not set', 500);
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
      params: {
        origins: warehouseAddress,
        destinations: installAddress,
        units: 'imperial',
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const data = response.data;
    if (data.status !== 'OK') {
      console.error('Google Maps API error:', data);
      throw new CustomError(`Google Maps API error: ${data.status}`, 500);
    }

    if (!data.rows || data.rows.length === 0 || !data.rows[0].elements || data.rows[0].elements.length === 0) {
      console.error('Unexpected Google Maps API response structure:', data);
      throw new CustomError('Invalid response from Google Maps API', 500);
    }

    const element = data.rows[0].elements[0];
    if (element.status !== 'OK') {
      console.error('Route calculation error:', element);
      throw new CustomError(`Route calculation error: ${element.status}`, 500);
    }

    if (!element.distance || !element.duration) {
      console.error('Missing distance or duration in API response:', element);
      throw new CustomError('Invalid distance or duration data', 500);
    }

    return {
      distance: element.distance.value / 1609.34, // Convert meters to miles
      duration: element.duration.value,
    };
  } catch (error: any) {
    console.error('Error in calculateDistance:', error); // Add this line for debugging
    if (error instanceof CustomError) {
      throw error;
    }
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
      throw new CustomError(`Failed to calculate distance: ${error.message}`, 500);
    }
    console.error('Unexpected error in calculateDistance:', error);
    throw new CustomError('An unexpected error occurred while calculating distance', 500);
  }
}
```

# src/services/EsignatureService.ts

```ts
import axios from 'axios';
import { CustomError } from '../utils/CustomError';

export class EsignatureService {
  private token: string;
  private apiUrl: string;

  constructor() {
    this.token = process.env.ESIGNATURES_IO_TOKEN ?? '';
    this.apiUrl = 'https://esignatures.io/api'; // Update this to the correct API URL

    if (!this.token) {
      throw new CustomError('ESIGNATURES_IO_TOKEN is not set in the environment variables.', 500);
    }
  }

  async sendEsignatureRequest(data: {
    templateId: string;
    signers: Array<{ name: string; email: string }>;
    metadata?: string;
    customFields: Array<{ api_key: string; value: string }>;
  }) {
    try {
      const requestBody = {
        template_id: data.templateId,
        signers: data.signers,
        custom_fields: data.customFields,
        metadata: data.metadata
      };

      console.log('Sending e-signature request:', JSON.stringify(requestBody, null, 2));
      const response = await axios.post(
        `${this.apiUrl}/contracts?token=${this.token}`,
        requestBody,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000 // 10 seconds timeout
        }
      );
      console.log('E-signature response:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error: any) {
      console.error('Error in sendEsignatureRequest:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('E-signature request failed:', error.response.data);
        throw new CustomError(`E-signature request failed: ${JSON.stringify(error.response.data)}`, error.response.status);
      }
      throw new CustomError('An unexpected error occurred while sending e-signature request', 500);
    }
  }

  async checkEsignatureStatus(contractId: string) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/contracts/${contractId}?token=${this.token}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error checking e-signature status:', error.response?.data || error.message);
      throw new CustomError('Failed to check e-signature status', 500);
    }
  }
}

```

# src/scripts/seedPricingVariables.ts

```ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { PricingVariables } from '../models/PricingVariables';

dotenv.config();

const seedPricingVariables = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    const initialPricingVariables = {
      warehouseAddress: '123 Warehouse St, City, State, ZIP',
      baseDeliveryFee: 50,
      deliveryFeePerMile: 2,
      baseInstallFee: 100,
      installFeePerComponent: 25,
      rentalRatePerFt: 5,
    };

    const existingVariables = await PricingVariables.findOne();
    if (existingVariables) {
      console.log('Pricing variables already exist. Updating...');
      await PricingVariables.findByIdAndUpdate(existingVariables._id, initialPricingVariables);
    } else {
      console.log('Creating new pricing variables...');
      await PricingVariables.create(initialPricingVariables);
    }

    console.log('Pricing variables seeded successfully');
  } catch (error) {
    console.error('Error seeding pricing variables:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seedPricingVariables();
```

# src/routes/stripeWebhooks.ts

```ts
// src/routes/stripeWebhooks.ts
import express from 'express';
import { Quote } from '../models/Quote';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10' as Stripe.LatestApiVersion,
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const router = express.Router();

// No need for bodyParser.raw() here since it's applied in app.ts
router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Received Stripe webhook payload:', JSON.stringify(event, null, 2));

  console.log('Received event:', event.type);

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent was successful!', paymentIntent.id);
        
        // Find the quote by paymentIntentId or quoteId from metadata
        let quote = await Quote.findOne({ paymentIntentId: paymentIntent.id });
        
        if (!quote && paymentIntent.metadata && paymentIntent.metadata.quoteId) {
          quote = await Quote.findById(paymentIntent.metadata.quoteId);
        }
        
        // If still not found, try to find by totalUpfront amount
        if (!quote) {
          const totalUpfront = paymentIntent.amount / 100; // Convert cents to dollars
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          const potentialQuotes = await Quote.find({
            'pricingCalculations.totalUpfront': totalUpfront,
            createdAt: { $gte: oneDayAgo }
          });
          
          console.log(`Found ${potentialQuotes.length} quotes with totalUpfront amount: $${totalUpfront}`);
          
          if (potentialQuotes.length === 1) {
            quote = potentialQuotes[0];
          } else if (potentialQuotes.length > 1) {
            console.warn(`Multiple quotes found with totalUpfront amount: $${totalUpfront}. Manual check required.`);
            // You might want to implement some logic here to choose the most likely quote,
            // or flag this for manual review
          }
        }
        
        if (!quote) {
          console.error('Quote not found for paymentIntentId:', paymentIntent.id);
          console.error('Metadata:', JSON.stringify(paymentIntent.metadata, null, 2));
          console.error('Amount:', paymentIntent.amount);
          
          // Log all quotes in the database
          const allQuotes = await Quote.find({});
          console.log('All quotes in database:', JSON.stringify(allQuotes, null, 2));
          
          return res.status(404).send('Quote not found');
        } else {
          // Update quote status
          quote.paymentStatus = 'paid';
          quote.status = 'paid';
          quote.paymentIntentId = paymentIntent.id; // Ensure this is set
          await quote.save();
        }
        
        console.log('Quote updated successfully:', quote._id);
        break;
      }
      case 'payment_intent.payment_failed': {
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent failed!', failedPaymentIntent.id);
        await Quote.findOneAndUpdate(
          { paymentIntentId: failedPaymentIntent.id },
          { paymentStatus: 'failed' }
        );
        break;
      }
      case 'payment_intent.canceled': {
        const canceledPaymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent canceled!', canceledPaymentIntent.id);
        await Quote.findOneAndUpdate(
          { paymentIntentId: canceledPaymentIntent.id },
          { paymentStatus: 'canceled', status: 'canceled' }
        );
        break;
      }
      case 'payment_intent.requires_action': {
        const requiresActionIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent requires action!', requiresActionIntent.id);
        // Handle any additional steps required
        break;
      }
      case 'charge.succeeded': {
        const chargeSucceeded = event.data.object as Stripe.Charge;
        console.log('Charge succeeded!', chargeSucceeded.id);
        // Optionally update the Quote or perform other actions
        break;
      }
      case 'charge.failed': {
        const chargeFailed = event.data.object as Stripe.Charge;
        console.log('Charge failed!', chargeFailed.id);
        // Optionally update the Quote or perform other actions
        break;
      }
      case 'charge.refunded': {
        const chargeRefunded = event.data.object as Stripe.Charge;
        console.log('Charge refunded!', chargeRefunded.id);
        await Quote.findOneAndUpdate(
          { paymentIntentId: chargeRefunded.payment_intent as string },
          { paymentStatus: 'refunded', status: 'refunded' }
        );
        break;
      }
      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute;
        console.log('Charge dispute created!', dispute.id);
        await Quote.findOneAndUpdate(
          { paymentIntentId: dispute.payment_intent as string },
          { paymentStatus: 'disputed', status: 'disputed' }
        );
        break;
      }
      case 'invoice.finalized': {
        const invoiceFinalized = event.data.object as Stripe.Invoice;
        console.log('Invoice finalized!', invoiceFinalized.id);
        // Optionally handle invoice finalization
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoicePaymentSucceeded = event.data.object as Stripe.Invoice;
        console.log('Invoice payment succeeded!', invoicePaymentSucceeded.id);
        // Optionally handle successful invoice payment
        break;
      }
      case 'invoice.payment_failed': {
        const invoicePaymentFailed = event.data.object as Stripe.Invoice;
        console.log('Invoice payment failed!', invoicePaymentFailed.id);
        // Optionally handle failed invoice payment
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).send('Error processing webhook');
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
});

export default router;
```

# src/routes/rentalRequests.ts

```ts
// src/routes/rentalRequests.ts
import express, { Request, Response, NextFunction } from 'express';
import { RentalRequest, IRentalRequest } from '../models/RentalRequest';
import { validationResult } from 'express-validator';
import { rentalRequestRules } from '../utils/validationRules';
import { CustomError } from '../utils/CustomError';
import { sendRentalRequestNotification } from '../utils/emailNotification';
import { sendPushNotification } from '../utils/pushNotification';
import { Types } from 'mongoose';

const router = express.Router();

// Get all rental requests
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rentalRequests = await RentalRequest.find().sort({ createdAt: -1 });
    res.json(rentalRequests);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

// Get a single rental request by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return next(new CustomError('Invalid rental request ID', 400));
    }

    const rentalRequest = await RentalRequest.findById(id);

    if (!rentalRequest) {
      return next(new CustomError('Rental request not found', 404));
    }

    res.json(rentalRequest);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

router.post('/', rentalRequestRules, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { customerInfo, rampDetails, installAddress } = req.body;

    const rentalRequest = new RentalRequest({
      customerInfo,
      rampDetails,
      installAddress,
      status: 'pending'
    });

    await rentalRequest.save();

    // Send email notification
    sendRentalRequestNotification(rentalRequest).catch((error: any) => {
      console.error('Failed to send email notification:', error);
    });

    // Send push notification
    const pushMessage = `
      New rental request from ${customerInfo.firstName} ${customerInfo.lastName}
      Email: ${customerInfo.email}
      Phone: ${customerInfo.phone}
      Install Address: ${installAddress}
      Ramp Length: ${rampDetails.knowRampLength ? rampDetails.rampLength + ' feet' : 'Unknown'}
      Rental Duration: ${rampDetails.knowRentalDuration ? rampDetails.rentalDuration + ' months' : 'Unknown'}
      Install Timeframe: ${rampDetails.installTimeframe}
      Mobility Aids: ${rampDetails.mobilityAids.join(', ')}
    `;

    sendPushNotification('New Rental Request', pushMessage.trim()).catch((error: any) => {
      console.error('Failed to send push notification:', error);
    });

    res.status(201).json(rentalRequest);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

router.put('/:id', rentalRequestRules, async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError('Validation failed', 400));
  }

  try {
    const updatedRequest = await RentalRequest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedRequest) {
      return next(new CustomError('Rental request not found', 404));
    }
    res.json(updatedRequest);
  } catch (error: any) {
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

// Delete a rental request
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedRequest = await RentalRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) {
      return next(new CustomError('Rental request not found', 404));
    }
    res.status(204).send();
  } catch (error: any) {
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

export default router;
```

# src/routes/quotes.ts

```ts
import express, { Request, Response, NextFunction } from 'express';
import { Quote } from '../models/Quote';
import { Customer, ICustomer } from '../models/Customer'; // Add this line
import { calculatePricing } from '../services/pricingService';
import { validationResult } from 'express-validator';
import { quoteRules } from '../utils/validationRules';
import { CustomError } from '../utils/CustomError';
import { Types } from 'mongoose';
import { sendQuoteEmail, sendFollowUpEmail } from '../services/emailService';
import { verifyAcceptanceToken } from '../utils/tokenUtils';
import { generateStripePaymentLink } from '../services/stripeService';
import { EsignatureService } from '../services/EsignatureService';
import { IQuote } from '../models/Quote'; // Make sure to import IQuote

const router = express.Router();

// Get all quotes
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quotes = await Quote.find()
      .populate('customerId')
      .populate('rentalRequestId')
      .sort({ createdAt: -1 });
    res.json(quotes);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

// Get a specific quote
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return next(new CustomError('Invalid quote ID', 400));
    }

    const quote = await Quote.findById(id)
      .populate('customerId')
      .populate('rentalRequestId');
    if (!quote) {
      return next(new CustomError('Quote not found', 404));
    }
    res.json(quote);
  } catch (error: any) {
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

// Create a new quote
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rampConfiguration, installAddress, warehouseAddress } = req.body;
    console.log('Quote request body:', req.body); // Add this line for debugging

    if (!installAddress || !warehouseAddress) {
      throw new CustomError('Install address and warehouse address are required', 400);
    }

    const pricingCalculations = await calculatePricing(rampConfiguration, installAddress, warehouseAddress);

    const quoteData = {
      ...req.body,
      pricingCalculations
    };

    const quote = new Quote(quoteData);
    await quote.save();
    res.status(201).json(quote);
  } catch (error: any) {
    console.error('Error creating quote:', error); // Add this line for debugging
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

// Update a quote
router.put('/:id', quoteRules, async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError('Validation failed', 400));
  }

  try {
    const { rampConfiguration, pricingCalculations } = req.body;
    // Ensure totalUpfront is set correctly in pricingCalculations
    pricingCalculations.totalUpfront = pricingCalculations.deliveryFee + pricingCalculations.installFee;
    
    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      { rampConfiguration, pricingCalculations },
      { new: true, runValidators: true }
    );

    if (!quote) {
      throw new CustomError('Quote not found', 404);
    }
    res.json(quote);
  } catch (error: any) {
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

// Delete a quote
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quote = await Quote.findByIdAndDelete(req.params.id);
    if (!quote) {
      throw new CustomError('Quote not found', 404);
    }
    res.json({ message: 'Quote deleted successfully' });
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

// Send quote email
router.post('/:id/send-email', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return next(new CustomError('Invalid quote ID', 400));
    }

    const quote = await Quote.findById(id).populate('customerId');
    if (!quote) {
      return next(new CustomError('Quote not found', 404));
    }

    await sendQuoteEmail(quote);

    // Update quote status to 'sent'
    quote.status = 'sent';
    await quote.save();

    res.json({ message: 'Quote email sent successfully' });
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

// Accept quote
router.get('/:id/accept', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { token } = req.query;

    if (!Types.ObjectId.isValid(id)) {
      return next(new CustomError('Invalid quote ID', 400));
    }

    if (!token || typeof token !== 'string') {
      return next(new CustomError('Invalid or missing acceptance token', 400));
    }

    // Verify the acceptance token
    const isValidToken = verifyAcceptanceToken(id, token);
    if (!isValidToken) {
      return next(new CustomError('Invalid or expired acceptance token', 401));
    }

    const quote = await Quote.findById(id).populate('customerId');
    if (!quote) {
      return next(new CustomError('Quote not found', 404));
    }

    // Assert the type of quote
    const typedQuote = quote as IQuote & { _id: Types.ObjectId };

    // Update quote status to 'accepted'
    typedQuote.status = 'accepted';
    await typedQuote.save();

    // Generate Stripe payment link
    const paymentLink = await generateStripePaymentLink(typedQuote);

    // Generate eSignatures.io agreement
    const esignatureService = new EsignatureService();
    let customerEmail: string;
    let customerName: string;

    if (typedQuote.customerId instanceof Types.ObjectId) {
      const customer = await Customer.findById(typedQuote.customerId);
      if (!customer) {
        throw new CustomError('Customer not found', 404);
      }
      customerEmail = customer.email;
      customerName = `${customer.firstName} ${customer.lastName}`;
    } else {
      const customer = typedQuote.customerId as ICustomer;
      customerEmail = customer.email;
      customerName = `${customer.firstName} ${customer.lastName}`;
    }

    let signatureLink: string;
    let agreementId: string;
    try {
      console.log('Sending e-signature request for quote:', typedQuote._id);
      const signatureResponse = await esignatureService.sendEsignatureRequest({
        templateId: process.env.ESIGNATURE_TEMPLATE_ID!,
        signers: [{ name: customerName, email: customerEmail }],
        metadata: JSON.stringify({ quoteId: typedQuote._id.toString() }),
        customFields: [
          { api_key: "date", value: new Date().toLocaleDateString() },
          { api_key: "customerName", value: customerName },
          { api_key: "totalLength", value: typedQuote.rampConfiguration.totalLength.toString() },
          { api_key: "number-of-landings", value: typedQuote.rampConfiguration.components.filter(c => c.type === 'landing').length.toString() },
          { api_key: "monthlyRentalRate", value: typedQuote.pricingCalculations.monthlyRentalRate.toFixed(2) },
          { api_key: "totalUpfront", value: typedQuote.pricingCalculations.totalUpfront.toFixed(2) },
          { api_key: "installAddress", value: typedQuote.installAddress },
        ],
      });
      console.log('E-signature response:', JSON.stringify(signatureResponse, null, 2));
      
      if (signatureResponse.data && signatureResponse.data.contract && signatureResponse.data.contract.id) {
        agreementId = signatureResponse.data.contract.id;
        signatureLink = signatureResponse.data.contract.signers[0].sign_page_url;
        
        // Update the quote with the agreementId
        await Quote.findByIdAndUpdate(typedQuote._id, {
          agreementId: agreementId,
          agreementStatus: 'sent'
        });
      } else {
        throw new Error('Invalid response structure from eSignatures.io');
      }
    } catch (error: any) {
      console.error('Failed to send e-signature request:', error);
      // If e-signature fails, we'll use the manual signature route
      signatureLink = `${process.env.FRONTEND_URL}/manual-signature?quoteId=${typedQuote._id}`;
    }

    // Send follow-up email with payment and signature links
    await sendFollowUpEmail(typedQuote, paymentLink, signatureLink);

    // Return JSON response
    res.json({
      message: 'Quote accepted successfully',
      quoteId: typedQuote._id,
      paymentLink,
      signatureLink
    });
  } catch (error: any) {
    console.error('Error accepting quote:', error);
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

// Add this new route for testing
router.get('/test-esignature', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const esignatureService = new EsignatureService();
    const response = await esignatureService.sendEsignatureRequest({
      templateId: process.env.ESIGNATURE_TEMPLATE_ID!,
      signers: [{ name: 'Test User', email: 'test@example.com' }],
      metadata: 'Test request',
      customFields: [
        { api_key: "date", value: new Date().toLocaleDateString() },
        { api_key: "customerName", value: 'Test User' },
        { api_key: "totalLength", value: '4' },
        { api_key: "number-of-landings", value: '0' },
        { api_key: "monthlyRentalRate", value: '40.00' },
        { api_key: "totalUpfront", value: '95.90' },
        { api_key: "installAddress", value: '3400 W Plano Pkwy, Plano, TX 75075, USA' },
      ],
    });
    res.json(response);
  } catch (error: any) {
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

// Add this new route for creating payment link
router.post('/:id/create-payment', async (req, res) => {
  const quoteId = req.params.id;
  console.log('Creating payment link for quote:', quoteId);

  const quote = await Quote.findById(quoteId);
  if (!quote) {
    console.log('Quote not found:', quoteId);
    return res.status(404).json({ error: 'Quote not found' });
  }

  try {
    const paymentLink = await generateStripePaymentLink(quote);
    console.log('Payment link generated:', paymentLink);
    res.json({ paymentLink });
  } catch (error) {
    console.error('Error generating payment link:', error);
    res.status(500).json({ error: 'Failed to generate payment link' });
  }
});

export default router;
```

# src/routes/pricingVariables.ts

```ts
import express, { Request, Response, NextFunction } from 'express';
import { PricingVariables } from '../models/PricingVariables';
import { validationResult } from 'express-validator';
import { pricingVariablesRules } from '../utils/validationRules';
import { CustomError } from '../utils/CustomError';

const router = express.Router();

// GET /api/pricing-variables
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const variables = await PricingVariables.findOne().sort({ updatedAt: -1 });
    if (!variables) {
      return res.status(404).json({ message: 'Pricing variables not found. Please set initial values.' });
    }
    res.json(variables);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

// POST /api/pricing-variables
router.post('/', pricingVariablesRules, async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError('Validation failed', 400));
  }

  try {
    const pricingVariables = new PricingVariables(req.body);
    await pricingVariables.save();
    res.status(201).json(pricingVariables);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

// PUT /api/pricing-variables
router.put('/', pricingVariablesRules, async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError('Validation failed', 400));
  }

  try {
    const variables = await PricingVariables.findOne().sort({ updatedAt: -1 });
    if (!variables) {
      return next(new CustomError('Pricing variables not found', 404));
    }

    const updatedVariables = await PricingVariables.findByIdAndUpdate(
      variables._id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    res.json(updatedVariables);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

export default router;
```

# src/routes/payments.ts

```ts
import express, { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { Quote, IQuote } from '../models/Quote';
import { CustomError } from '../utils/CustomError';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

// Create a payment link
router.post('/create-link', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quoteId } = req.body;

    // Fetch the quote
    const quote = await Quote.findById(quoteId);
    if (!quote) {
      throw new CustomError('Quote not found', 404);
    }

    // Create a Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(quote.pricingCalculations.totalUpfront * 100), // Use totalUpfront instead of totalAmount
      currency: 'usd',
      metadata: { quoteId: quote.id },
    });

    // Create a payment link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: 'price_placeholder', // Replace with an actual Stripe Price ID
          quantity: 1,
        },
      ],
      after_completion: { 
        type: 'redirect', 
        redirect: { url: `${process.env.FRONTEND_URL}/payment-success?quoteId=${quote.id}` } 
      },
    });

    res.json({ paymentLink: paymentLink.url, paymentIntentId: paymentIntent.id });
  } catch (error: any) {
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

// Check payment status
router.get('/status/:paymentIntentId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentIntentId } = req.params;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.json({ 
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100, // Convert back to dollars
      quoteId: paymentIntent.metadata.quoteId
    });
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

export default router;
```

# src/routes/manualSignature.ts

```ts
import express, { Request, Response, NextFunction } from 'express';
import { Quote, IQuote } from '../models/Quote';
import { CustomError } from '../utils/CustomError';

const router = express.Router();

router.get('/:quoteId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quoteId } = req.params;
    const quote = await Quote.findById(quoteId).populate('customerId');
    if (!quote) {
      throw new CustomError('Quote not found', 404);
    }
    
    // Render a simple form for manual signature
    res.send(`
      <h1>Manual Signature Required</h1>
      <p>Please sign below to accept the quote:</p>
      <form action="/api/manual-signature/${quoteId}" method="POST">
        <input type="text" name="signature" placeholder="Type your full name" required>
        <button type="submit">Sign and Accept</button>
      </form>
    `);
  } catch (error: any) {
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

router.post('/:quoteId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quoteId } = req.params;
    const { signature } = req.body;
    
    const quote = await Quote.findById(quoteId);
    if (!quote) {
      throw new CustomError('Quote not found', 404);
    }
    
    // Update quote with manual signature
    const updatedQuote: Partial<IQuote> = {
      manualSignature: signature,
      signatureDate: new Date()
    };
    
    await Quote.findByIdAndUpdate(quoteId, updatedQuote);
    
    res.redirect(`${process.env.FRONTEND_URL}/quote-accepted?id=${quoteId}`);
  } catch (error: any) {
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

export default router;
```

# src/routes/esignatures.ts

```ts
import express, { Request, Response, NextFunction } from 'express';
import { EsignatureService } from '../services/EsignatureService';
import { body, validationResult } from 'express-validator';
import { CustomError } from '../utils/CustomError';

const router = express.Router();
const esignatureService = new EsignatureService();

// Validation middleware for send request
const validateSendRequest = [
  body('templateId').isString().notEmpty(),
  body('signers').isArray().notEmpty(),
  body('signers.*.name').isString().notEmpty(),
  body('signers.*.email').isEmail(),
  body('metadata').optional().isString(),
  body('placeholderFields').optional().isArray(),
  body('placeholderFields.*.api_key').optional().isString(),
  body('placeholderFields.*.value').optional().isString(),
];

router.post('/send', validateSendRequest, async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError('Validation failed', 400));
  }

  try {
    const result = await esignatureService.sendEsignatureRequest(req.body);
    res.json(result);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

router.get('/status/:contractId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { contractId } = req.params;
    const status = await esignatureService.checkEsignatureStatus(contractId);
    res.json(status);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

export default router;
```

# src/routes/esignatureWebhooks.ts

```ts
import express from 'express';
import { Quote } from '../models/Quote';
import { CustomError } from '../utils/CustomError';

const router = express.Router();

router.post('/', express.json(), async (req, res, next) => {
  try {
    const { secret_token, status, data } = req.body;

    console.log('Received webhook request. Token:', secret_token);

    if (!secret_token || secret_token !== process.env.ESIGNATURES_IO_TOKEN) {
      console.log('Invalid token. Expected:', process.env.ESIGNATURES_IO_TOKEN, 'Received:', secret_token);
      return next(new CustomError('Invalid or missing token', 401));
    }

    console.log('Received eSignatures webhook event:', JSON.stringify(req.body, null, 2));

    if (!data || !data.contract || !data.contract.id) {
      console.log('Invalid event structure. Missing contract.id');
      return next(new CustomError('Invalid event structure', 400));
    }

    let updateResult;

    switch (status) {
      case 'contract-sent':
      case 'contract-viewed':
      case 'contract-signed':
      case 'contract-declined':
        updateResult = await Quote.findOneAndUpdate(
          { agreementId: data.contract.id },
          { agreementStatus: status.replace('contract-', '') },
          { new: true }
        );

        if (!updateResult && data.contract.metadata) {
          const metadata = JSON.parse(data.contract.metadata);
          if (metadata.quoteId) {
            updateResult = await Quote.findByIdAndUpdate(
              metadata.quoteId,
              { 
                agreementId: data.contract.id,
                agreementStatus: status.replace('contract-', '')
              },
              { new: true }
            );
          }
        }
        break;
      default:
        console.log(`Unhandled event type: ${status}`);
    }

    if (updateResult) {
      console.log('Quote updated:', updateResult);
    } else {
      console.log('No quote found with agreementId:', data.contract.id);
    }

    res.sendStatus(200);
  } catch (error: any) {
    console.error('Error processing eSignatures webhook:', error);
    next(new CustomError(error.message, 500));
  }
});

export default router;
```

# src/routes/customers.ts

```ts
// src/routes/customers.ts
import express, { Request, Response, NextFunction } from 'express';
import { Customer, ICustomer } from '../models/Customer';
import { RentalRequest } from '../models/RentalRequest';
import { body, validationResult } from 'express-validator';
import { customerRules } from '../utils/validationRules';
import { CustomError } from '../utils/CustomError';
import { Types } from 'mongoose';

const router = express.Router();

// Validation middleware
const validateCustomer = [
  body('firstName').trim().notEmpty().escape(),
  body('lastName').trim().notEmpty().escape(),
  body('phone').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('installAddress').trim().notEmpty(),
  body('mobilityAids').isArray(),
  body('notes').optional().trim().escape(),
];

// Get all customers
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

// Get a specific customer
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return next(new CustomError('Invalid customer ID', 400));
    }

    const customer = await Customer.findById(id);
    if (!customer) {
      return next(new CustomError('Customer not found', 404));
    }
    res.json(customer);
  } catch (error: any) {
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

// Create a new customer
router.post('/', customerRules, async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const customerData: Partial<ICustomer> = req.body;
    if (!customerData.mobilityAids) {
      customerData.mobilityAids = []; // Set a default empty array if not provided
    }
    const customer = new Customer(customerData);
    await customer.save();
    res.status(201).json(customer);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

// Update an existing customer
router.put('/:id', customerRules, async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError('Validation failed', 400));
  }

  try {
    const customerData: Partial<ICustomer> = req.body;
    const customer = await Customer.findByIdAndUpdate(req.params.id, customerData, {
      new: true,
      runValidators: true,
    });

    if (!customer) {
      return next(new CustomError('Customer not found', 404));
    }
    res.json(customer);
  } catch (error: any) {
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

// Create a customer from a rental request
router.post('/from-rental-request/:rentalRequestId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rentalRequestId } = req.params;
    const rentalRequest = await RentalRequest.findById(rentalRequestId);

    if (!rentalRequest) {
      return res.status(404).json({ message: 'Rental request not found' });
    }

    const customerData = {
      firstName: rentalRequest.customerInfo.firstName,
      lastName: rentalRequest.customerInfo.lastName,
      phone: rentalRequest.customerInfo.phone,
      email: rentalRequest.customerInfo.email,
      installAddress: rentalRequest.installAddress,
      mobilityAids: rentalRequest.rampDetails.mobilityAids,
      rentalRequestId: rentalRequest._id,
    };

    const customer = new Customer(customerData);
    await customer.save();

    res.status(201).json(customer);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

// Delete a customer
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await Customer.findOneAndDelete({ _id: req.params.id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

export default router;
```

# src/routes/calculatePricing.ts

```ts
// src/routes/calculatePricing.ts
import { Router, Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/CustomError';
import { calculatePricing } from '../services/pricingService';

const router = Router();

interface RampComponent {
  type: 'ramp' | 'landing';
  length: number;
  quantity: number;
}

interface RampConfiguration {
  components: RampComponent[];
  totalLength: number;
}

interface QuoteRequest {
  rampConfiguration: RampConfiguration;
  installAddress: string;  // Changed from customerAddress
  warehouseAddress: string;
}

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rampConfiguration, installAddress, warehouseAddress } = req.body as QuoteRequest;

    if (!installAddress || !warehouseAddress) {
      throw new CustomError('Install address and warehouse address are required', 400);
    }

    const pricingCalculations = await calculatePricing(rampConfiguration, installAddress, warehouseAddress);

    res.json(pricingCalculations);
  } catch (error: any) {
    console.error('Error in calculatePricing route:', error);  // Add this line for debugging
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

export default router;
```

# src/models/RentalRequest.ts

```ts
// src/models/RentalRequest.ts
import { Schema, model, Document } from 'mongoose';

export interface IRentalRequest extends Document {
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  rampDetails: {
    knowRampLength: boolean;
    rampLength?: number;
    knowRentalDuration: boolean;
    rentalDuration?: number;
    installTimeframe: string;
    mobilityAids: string[];
  };
  installAddress: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const rentalRequestSchema = new Schema<IRentalRequest>({
  customerInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  rampDetails: {
    knowRampLength: { type: Boolean, required: true },
    rampLength: { type: Number },
    knowRentalDuration: { type: Boolean, required: true },
    rentalDuration: { type: Number },
    installTimeframe: {
      type: String,
      enum: ['Within 24 hours', 'Within 2 days', 'Within 3 days', 'Within 1 week', 'Over 1 week'],
      required: true,
    },
    mobilityAids: { type: [String], required: true },
  },
  installAddress: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

rentalRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const RentalRequest = model<IRentalRequest>('RentalRequest', rentalRequestSchema);
```

# src/models/Quote.ts

```ts
// src/models/Quote.ts
import { Schema, model, Document, Types } from 'mongoose';

interface RampComponent {
  type: 'ramp' | 'landing';
  length: number;
  quantity: number;
}

interface RampConfiguration {
  components: RampComponent[];
  totalLength: number;
}

export interface IQuote extends Document {
  _id: Types.ObjectId; // Add this line
  customerId: Types.ObjectId;
  customerName: string;
  rentalRequestId?: Types.ObjectId;
  rampConfiguration: RampConfiguration;
  pricingCalculations: {
    deliveryFee: number;
    installFee: number;
    monthlyRentalRate: number;
    totalUpfront: number;
    distance: number;
    warehouseAddress: string;
  };
  status: 'draft' | 'sent' | 'accepted' | 'paid' | 'completed';
  createdAt: Date;
  manualSignature?: string;
  signatureDate?: Date;
  installAddress: string;
  paymentStatus: 'pending' | 'processing' | 'paid' | 'failed';
  paymentIntentId?: string;
  agreementStatus: 'pending' | 'sent' | 'viewed' | 'signed' | 'declined';
  agreementId?: string;
}

const quoteSchema = new Schema<IQuote>({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  customerName: { type: String, required: true },
  rentalRequestId: { type: Schema.Types.ObjectId, ref: 'RentalRequest', required: false },
  rampConfiguration: {
    components: [{
      type: { type: String, enum: ['ramp', 'landing'], required: true },
      length: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }],
    totalLength: { type: Number, required: true }
  },
  pricingCalculations: {
    deliveryFee: { type: Number, required: true },
    installFee: { type: Number, required: true },
    monthlyRentalRate: { type: Number, required: true },
    totalUpfront: { type: Number, required: true },
    distance: { type: Number, required: true },
    warehouseAddress: { type: String, required: true }
  },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'accepted', 'paid', 'completed'], 
    default: 'draft' 
  },
  createdAt: { type: Date, default: Date.now },
  manualSignature: { type: String, required: false },
  signatureDate: { type: Date, required: false },
  installAddress: { type: String, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'processing', 'paid', 'failed'], 
    default: 'pending' 
  },
  paymentIntentId: { type: String, required: false },
  agreementStatus: { 
    type: String, 
    enum: ['pending', 'sent', 'viewed', 'signed', 'declined'], 
    default: 'pending' 
  },
  agreementId: { type: String, required: false }
});

// Enable virtuals in JSON output if needed
quoteSchema.set('toJSON', { virtuals: true });
quoteSchema.set('toObject', { virtuals: true });

export const Quote = model<IQuote>('Quote', quoteSchema);
```

# src/models/PricingVariables.ts

```ts
// src/models/PricingVariables.ts
import { Schema, model, Document } from 'mongoose';

export interface IPricingVariables extends Document {
  warehouseAddress: string;
  baseDeliveryFee: number;
  deliveryFeePerMile: number;
  baseInstallFee: number;
  installFeePerComponent: number;
  rentalRatePerFt: number;
  updatedAt: Date;
}

const pricingVariablesSchema = new Schema<IPricingVariables>({
  warehouseAddress: { type: String, required: true },
  baseDeliveryFee: { type: Number, required: true },
  deliveryFeePerMile: { type: Number, required: true },
  baseInstallFee: { type: Number, required: true },
  installFeePerComponent: { type: Number, required: true },
  rentalRatePerFt: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export const PricingVariables = model<IPricingVariables>('PricingVariables', pricingVariablesSchema);
```

# src/models/Customer.ts

```ts
import { Schema, model, Document, Types } from 'mongoose';

export interface ICustomer extends Document {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  installAddress: string;
  mobilityAids: string[];
  rentalRequestId?: Types.ObjectId;
  notes?: string; // New field for additional customer information
  // Removed: preferredContactMethod?: string; // New field for communication preference
  createdAt: Date;
  updatedAt: Date; // New field to track last update
}

const customerSchema = new Schema<ICustomer>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  installAddress: { type: String, required: true },
  mobilityAids: { type: [String], required: true },
  rentalRequestId: { type: Schema.Types.ObjectId, ref: 'RentalRequest', required: false },
  notes: { type: String, required: false },
  // Removed: preferredContactMethod: { type: String, enum: ['email', 'phone', 'text'], required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt field on each save
customerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for customer's full name
customerSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON output
customerSchema.set('toJSON', { virtuals: true });
customerSchema.set('toObject', { virtuals: true });

export const Customer = model<ICustomer>('Customer', customerSchema);
```

# src/middlewares/errorHandler.ts

```ts
// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/CustomError';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error('Unexpected error:', err);
  res.status(500).json({
    status: 'error',
    message: 'An unexpected error occurred',
  });
};
```

# src/api/api.ts

```ts
import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const api = axios.create({
  baseURL: 'https://samedayramps-016e8e090b17.herokuapp.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

const connectToDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectToDatabase;
```

