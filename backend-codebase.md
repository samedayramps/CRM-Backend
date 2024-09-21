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
    "types": ["jest", "node"]
  }
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
import { errorHandler } from './middlewares/errorHandler';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('Starting application...');

const app = express();

console.log('Express app created');

// Updated CORS configuration
const allowedOrigins = [
  'https://form.samedayramps.com',
  'http://localhost:3001',
  'https://app.samedayramps.com'
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
}));

console.log('CORS middleware added');

app.use(express.json());

// Handle OPTIONS requests
app.options('*', cors());

// Routes
app.use('/api/rental-requests', rentalRequestsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/quotes', quotesRouter);
app.use('/api/pricing-variables', pricingVariablesRouter);
app.use('/api/calculate-pricing', calculatePricingRouter);
app.use('/api/payments', paymentsRouter);

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
  body('pricingCalculations.totalUpfront').isFloat({ min: 0 }), // Changed from totalAmount
  body('pricingCalculations.distance').isFloat({ min: 0 }),
  body('status').isIn(['pending', 'approved', 'rejected']),
];

export const customerRules = [
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('phone').trim().notEmpty(),
  body('email').isEmail(),
  body('installAddress').trim().notEmpty(),
  body('mobilityAids').isArray(),
  body('preferredContactMethod').optional().isIn(['email', 'phone', 'text']),
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

# src/services/pricingService.ts

```ts
import { PricingVariables } from '../models/PricingVariables';
import { calculateDistance } from './distanceCalculation';
import { CustomError } from '../utils/CustomError';

interface RampConfiguration {
  components: string[];
  totalLength: number;
}

export async function calculatePricing(rampConfiguration: RampConfiguration, customerAddress: string) {
  const variables = await PricingVariables.findOne().sort({ updatedAt: -1 });

  if (!variables) {
    throw new CustomError('Pricing variables not set', 500);
  }

  const companyAddress = process.env.COMPANY_ADDRESS;
  if (!companyAddress) {
    throw new CustomError('Company address not set', 500);
  }

  const { distance } = await calculateDistance(companyAddress, customerAddress);

  const deliveryFee = variables.baseDeliveryFee + 
    variables.deliveryFeePerMile * distance;

  const installFee = variables.baseInstallFee + 
    variables.installFeePerComponent * rampConfiguration.components.length;

  const monthlyRentalRate = variables.rentalRatePerFt * rampConfiguration.totalLength;

  const totalAmount = deliveryFee + installFee;

  return {
    deliveryFee,
    installFee,
    monthlyRentalRate,
    totalAmount,
    distance,
  };
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

export async function calculateDistance(origin: string, destination: string): Promise<DistanceResult> {
  try {
    if (!origin || !destination) {
      throw new CustomError('Origin and destination are required', 400);
    }

    if (!process.env.GOOGLE_MAPS_API_KEY) {
      throw new CustomError('Google Maps API key is not set', 500);
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
      params: {
        origins: origin,
        destinations: destination,
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
    this.apiUrl = process.env.ESIGNATURES_IO_API_URL ?? 'https://api.esignatures.io';

    if (!this.token) {
      throw new CustomError('ESIGNATURES_IO_TOKEN is not set in the environment variables. Please add it to your .env file.', 500);
    }

    if (!this.apiUrl) {
      throw new CustomError('ESIGNATURES_IO_API_URL is not set in the environment variables. Please add it to your .env file.', 500);
    }
  }

  async sendEsignatureRequest(data: {
    templateId: string;
    signers: Array<{ name: string; email: string }>;
    metadata?: string;
    placeholderFields?: Array<{ api_key: string; value: string }>;
  }) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/contracts?token=${this.token}`,
        data,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error sending e-signature request:', error.response?.data || error.message);
      throw new CustomError('Failed to send e-signature request', 500);
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
import { validationResult } from 'express-validator';
import { quoteRules } from '../utils/validationRules';
import { CustomError } from '../utils/CustomError';

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
    const quote = await Quote.findById(req.params.id)
      .populate('customerId')
      .populate('rentalRequestId');
    if (!quote) {
      throw new CustomError('Quote not found', 404);
    }
    res.json(quote);
  } catch (error: any) {
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

// Create a new quote
router.post('/', quoteRules, async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const quoteData = req.body;
    // Ensure totalUpfront is set correctly in pricingCalculations
    quoteData.pricingCalculations.totalUpfront = quoteData.pricingCalculations.deliveryFee + quoteData.pricingCalculations.installFee;
    const quote = new Quote(quoteData);
    await quote.save();
    res.status(201).json(quote);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
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

// Add this route to your quotes.ts file
router.post('/:id/send-email', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      throw new CustomError('Quote not found', 404);
    }
    // Implement your email sending logic here
    // You might want to use a service like nodemailer or a third-party email API
    // await sendEmail(quote);
    res.json({ message: 'Quote email sent successfully' });
  } catch (error: any) {
    next(new CustomError(error.message, 500));
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

# src/routes/customers.ts

```ts
// src/routes/customers.ts
import express, { Request, Response, NextFunction } from 'express';
import { Customer, ICustomer } from '../models/Customer';
import { RentalRequest } from '../models/RentalRequest';
import { body, validationResult } from 'express-validator';
import { customerRules } from '../utils/validationRules';
import { CustomError } from '../utils/CustomError';

const router = express.Router();

// Validation middleware
const validateCustomer = [
  body('firstName').trim().notEmpty().escape(),
  body('lastName').trim().notEmpty().escape(),
  body('phone').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('installAddress').trim().notEmpty(),
  body('mobilityAids').isArray(),
  body('preferredContactMethod').optional().isIn(['email', 'phone', 'text']),
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
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      throw new CustomError('Customer not found', 404);
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
import { PricingVariables } from '../models/PricingVariables';
import { calculateDistance } from '../services/distanceCalculation';
import { CustomError } from '../utils/CustomError';
import { calculatePricing } from '../services/pricingService';

const router = Router();

interface RampConfiguration {
  components: string[];
  totalLength: number;
}

interface QuoteRequest {
  rampConfiguration: RampConfiguration;
  customerAddress: string;
  companyAddress: string;
}

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rampConfiguration, customerAddress, companyAddress } = req.body as QuoteRequest;

    if (!customerAddress || !companyAddress) {
      throw new CustomError('Customer address and company address are required', 400);
    }

    const pricingCalculations = await calculatePricing(rampConfiguration, customerAddress);

    res.json(pricingCalculations);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
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
  width?: number;
}

interface RampConfiguration {
  components: RampComponent[];
  totalLength: number;
}

interface PricingCalculations {
  deliveryFee: number;
  installFee: number;
  monthlyRentalRate: number;
  totalUpfront: number; // Changed from totalAmount
  distance: number;
}

export interface IQuote extends Document {
  customerId: Types.ObjectId;
  customerName: string;
  rentalRequestId?: Types.ObjectId;
  rampConfiguration: RampConfiguration;
  pricingCalculations: PricingCalculations;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const quoteSchema = new Schema<IQuote>({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  customerName: { type: String, required: true },
  rentalRequestId: { type: Schema.Types.ObjectId, ref: 'RentalRequest', required: false },
  rampConfiguration: {
    components: [{
      type: { type: String, enum: ['ramp', 'landing'], required: true },
      length: { type: Number, required: true },
      width: { type: Number, required: false }
    }],
    totalLength: { type: Number, required: true }
  },
  pricingCalculations: {
    deliveryFee: { type: Number, required: true },
    installFee: { type: Number, required: true },
    monthlyRentalRate: { type: Number, required: true },
    totalUpfront: { type: Number, required: true }, // Changed from totalAmount
    distance: { type: Number, required: true }
  },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
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
// src/models/Customer.ts
import { Schema, model, Types, Document } from 'mongoose';

export interface ICustomer extends Document {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  installAddress: string;
  mobilityAids: string[];
  rentalRequestId?: Types.ObjectId;
  notes?: string; // New field for additional customer information
  preferredContactMethod?: string; // New field for communication preference
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
  preferredContactMethod: { type: String, enum: ['email', 'phone', 'text'], required: false },
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

# src/__tests__/testDbConnection.ts

```ts
// src/__tests__/testDbConnection.ts
import mongoose from 'mongoose';

mongoose
  .connect('mongodb+srv://ty:ReGGie.02@samedayramps-db.ulmux.mongodb.net/?retryWrites=true&w=majority&appName=samedayramps-db')
  .then(() => {
    console.log('Connected to MongoDB');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });
```

# src/__tests__/setupTests.ts

```ts
// src/__tests__/setupTests.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: 'test_db',
    });

    await new Promise<void>((resolve, reject) => {
      mongoose.connection.once('connected', () => {
        console.log('Mongoose connection is open');
        resolve();
      });
      mongoose.connection.on('error', (err) => {
        console.error('Mongoose connection error:', err);
        reject(err);
      });
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  const db = mongoose.connection.db;
  if (db) {
    // Clear the database before each test
    const collections = await db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  } else {
    throw new Error('Database connection not established');
  }
});
```

