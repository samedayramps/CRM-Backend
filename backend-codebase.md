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
    "resolveJsonModule": true
  }
}
```

# package.json

```json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "ts-node src/index.ts",
    "dev": "ts-node-dev --respawn src/index.ts",
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

# backend-codebase.md

```md
# tsconfig.json

\`\`\`json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true
  }
}
\`\`\`

# package.json

\`\`\`json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "ts-node src/index.ts",
    "dev": "ts-node-dev --respawn src/index.ts",
    "test": "NODE_ENV=test jest"
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
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.0",
    "express-rate-limit": "^7.4.0",
    "express-validator": "^7.2.0",
    "mongoose": "^8.6.3",
    "nodemailer": "^6.9.15",
    "stripe": "^16.12.0"
  }
}

\`\`\`

# jest.config.js

\`\`\`js
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setupTests.ts'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  maxWorkers: 1, // Run tests serially
};
\`\`\`

# backend-codebase.md

\`\`\`md
# tsconfig.json

\`\`\`json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true
  }
}
\`\`\`

# package.json

\`\`\`json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "ts-node src/index.ts",
    "dev": "ts-node-dev --respawn src/index.ts",
    "test": "NODE_ENV=test jest"
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
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.0",
    "express-rate-limit": "^7.4.0",
    "express-validator": "^7.2.0",
    "mongoose": "^8.6.3",
    "nodemailer": "^6.9.15"
  }
}

\`\`\`

# jest.config.js

\`\`\`js
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setupTests.ts'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  maxWorkers: 1, // Run tests serially
};
\`\`\`

# src/index.ts

\`\`\`ts
// src/index.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import rentalRequestRoutes from './routes/rentalRequests';
import customerRoutes from './routes/customers';
import quoteRoutes from './routes/quotes';
import pricingVariablesRoutes from './routes/pricingVariables';
import calculatePricingRoutes from './routes/calculatePricing';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGODB_URI!)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.error('MongoDB connection error:', error));
}

// Routes
app.use('/api/rental-requests', rentalRequestRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/pricing-variables', pricingVariablesRoutes);
app.use('/api/calculate-pricing', calculatePricingRoutes);

// Start the server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
\`\`\`

# src/utils/email.ts

\`\`\`ts
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
\`\`\`

# src/routes/rentalRequests.ts

\`\`\`ts
// src/routes/rentalRequests.ts
import express, { Request, Response, NextFunction } from 'express';
import { RentalRequest, IRentalRequest } from '../models/RentalRequest';
import { sendEmail } from '../utils/email';
import { body, validationResult, ValidationChain } from 'express-validator';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

router.use(limiter);

// Validation middleware
const validateRentalRequest: ValidationChain[] = [
  body('customerInfo.firstName').trim().notEmpty().escape(),
  body('customerInfo.lastName').trim().notEmpty().escape(),
  body('customerInfo.email').isEmail().normalizeEmail(),
  body('customerInfo.phone').trim().notEmpty().escape(),
  body('rampDetails.knowRampLength').isBoolean(),
  body('rampDetails.knowRentalDuration').isBoolean(),
  body('rampDetails.rampLength').optional().isNumeric(),
  body('rampDetails.rentalDuration').optional().isNumeric(),
  body('rampDetails.installTimeframe').isIn(['within_a_week', 'within_a_month', 'more_than_a_month']),
  body('rampDetails.mobilityAids').isArray(),
  body('rampDetails.mobilityAids.*').isIn(['wheelchair', 'motorized_scooter', 'walker_cane', 'none']),
  body('installAddress').trim().notEmpty().escape(),
];

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An unexpected error occurred' });
};

// Get all rental requests
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await RentalRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    next(error);
  }
});

// Get a specific rental request
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await RentalRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Rental request not found' });
    }
    res.json(request);
  } catch (error) {
    next(error);
  }
});

// Create a new rental request
router.post('/', validateRentalRequest, async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const rentalRequest = new RentalRequest(req.body);
    await rentalRequest.save();

    // Prepare email body
    const emailBody = prepareEmailBody(rentalRequest);

    // Send email notification
    try {
      await sendEmail(
        process.env.EMAIL_USER!,
        'New Rental Request Received',
        emailBody
      );
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Continue with the response even if email sending fails
    }

    res.status(201).json(rentalRequest);
  } catch (error) {
    next(error);
  }
});

// Helper function to prepare email body
function prepareEmailBody(rentalRequest: IRentalRequest): string {
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
}

// Apply error handling middleware
router.use(errorHandler);

export default router;
\`\`\`

# src/routes/quotes.ts

\`\`\`ts
// src/routes/quotes.ts
import express from 'express';
import { Quote } from '../models/Quote';
import { Customer } from '../models/Customer';
import { RentalRequest } from '../models/RentalRequest';

const router = express.Router();

// Get all quotes
router.get('/', async (req, res) => {
  try {
    const quotes = await Quote.find()
      .populate('customerId')
      .populate('rentalRequestId')
      .sort({ createdAt: -1 });
    res.json(quotes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific quote
router.get('/:id', async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id)
      .populate('customerId')
      .populate('rentalRequestId');
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }
    res.json(quote);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new quote
router.post('/', async (req, res) => {
  try {
    const { customerId, rentalRequestId, rampConfiguration, pricingCalculations } = req.body;

    // Validate customer
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Optionally validate rental request
    if (rentalRequestId) {
      const rentalRequest = await RentalRequest.findById(rentalRequestId);
      if (!rentalRequest) {
        return res.status(404).json({ message: 'Rental request not found' });
      }
    }

    const quoteData = {
      customerId,
      rentalRequestId,
      rampConfiguration,
      pricingCalculations,
    };

    const quote = new Quote(quoteData);
    await quote.save();

    res.status(201).json(quote);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update a quote
router.put('/:id', async (req, res) => {
  try {
    const quote = await Quote.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }
    res.json(quote);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a quote
router.delete('/:id', async (req, res) => {
  try {
    const quote = await Quote.findByIdAndDelete(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }
    res.json({ message: 'Quote deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
\`\`\`

# src/routes/pricingVariables.ts

\`\`\`ts
// src/routes/pricingVariables.ts
import { Router } from 'express';
import { PricingVariables } from '../models/PricingVariables';

const router = Router();

// Get the current pricing variables
router.get('/', async (req, res) => {
  try {
    const variables = await PricingVariables.findOne().sort({ updatedAt: -1 });
    res.json(variables);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update or create pricing variables
router.post('/', async (req, res) => {
  try {
    const variables = await PricingVariables.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });
    res.json(variables);
  } catch (error: any) {
    console.error('Error in POST /api/pricing-variables:', error);
    res.status(400).json({ message: error.message });
  }
});

export default router;
\`\`\`

# src/routes/customers.ts

\`\`\`ts
// src/routes/customers.ts
import express, { Request, Response, NextFunction } from 'express';
import { Customer } from '../models/Customer';
import { RentalRequest } from '../models/RentalRequest';

const router = express.Router();

// Get all customers
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    next(error);
  }
});

// Get a specific customer
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    next(error);
  }
});

// Create a new customer
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
});

// Update an existing customer
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    next(error);
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
  } catch (error) {
    next(error);
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
  } catch (error) {
    next(error);
  }
});

export default router;
\`\`\`

# src/routes/calculatePricing.ts

\`\`\`ts
// src/routes/calculatePricing.ts
import { Router } from 'express';
import { PricingVariables } from '../models/PricingVariables';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { rampConfiguration } = req.body;
    const variables = await PricingVariables.findOne().sort({ updatedAt: -1 });

    if (!variables) {
      return res.status(500).json({ message: 'Pricing variables not set' });
    }

    // Example calculations
    const deliveryFee =
      variables.baseDeliveryFee +
      variables.deliveryFeePerMile * rampConfiguration.distance;

    const installFee =
      variables.baseInstallFee +
      variables.installFeePerComponent * rampConfiguration.components.length;

    const monthlyRentalRate =
      variables.monthlyRentalRatePerFt * rampConfiguration.totalLength;

    const pricingCalculations = {
      deliveryFee,
      installFee,
      monthlyRentalRate,
    };

    res.json(pricingCalculations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
\`\`\`

# src/models/RentalRequest.ts

\`\`\`ts
// src/models/RentalRequest.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IRentalRequest extends Document {
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  rampDetails: {
    knowRampLength: boolean;
    knowRentalDuration: boolean;
    rampLength?: number;
    rentalDuration?: number;
    installTimeframe: string;
    mobilityAids: string[];
  };
  installAddress: string;
  createdAt: Date;
}

const customerInfoSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

const rampDetailsSchema = new Schema({
  knowRampLength: { type: Boolean, required: true },
  knowRentalDuration: { type: Boolean, required: true },
  rampLength: { type: Number, required: false },
  rentalDuration: { type: Number, required: false },
  installTimeframe: { type: String, required: true },
  mobilityAids: { type: [String], required: true },
});

const rentalRequestSchema = new Schema<IRentalRequest>({
  customerInfo: customerInfoSchema,
  rampDetails: rampDetailsSchema,
  installAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const RentalRequest = model<IRentalRequest>('RentalRequest', rentalRequestSchema);
\`\`\`

# src/models/Quote.ts

\`\`\`ts
// src/models/Quote.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IQuote extends Document {
  customerId: Types.ObjectId;
  rentalRequestId?: Types.ObjectId; // Added rentalRequestId field
  rampConfiguration: any;
  pricingCalculations: any;
  createdAt: Date;
}

const quoteSchema = new Schema<IQuote>({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  rentalRequestId: { type: Schema.Types.ObjectId, ref: 'RentalRequest', required: false },
  rampConfiguration: { type: Schema.Types.Mixed, required: true },
  pricingCalculations: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Enable virtuals in JSON output if needed
quoteSchema.set('toJSON', { virtuals: true });
quoteSchema.set('toObject', { virtuals: true });

export const Quote = model<IQuote>('Quote', quoteSchema);
\`\`\`

# src/models/PricingVariables.ts

\`\`\`ts
// src/models/PricingVariables.ts
import { Schema, model, Document } from 'mongoose';

export interface IPricingVariables extends Document {
  deliveryFeePerMile: number;
  baseDeliveryFee: number;
  installFeePerComponent: number;
  baseInstallFee: number;
  monthlyRentalRatePerFt: number;
  updatedAt: Date;
}

const pricingVariablesSchema = new Schema<IPricingVariables>({
  deliveryFeePerMile: { type: Number, required: true },
  baseDeliveryFee: { type: Number, required: true },
  installFeePerComponent: { type: Number, required: true },
  baseInstallFee: { type: Number, required: true },
  monthlyRentalRatePerFt: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export const PricingVariables = model<IPricingVariables>('PricingVariables', pricingVariablesSchema);
\`\`\`

# src/models/Customer.ts

\`\`\`ts
// src/models/Customer.ts
import {
    Schema,
    model,
    Types,
    HydratedDocument,
    CallbackError,
    Query,
  } from 'mongoose';
  import { RentalRequest } from './RentalRequest';
  import { Quote } from './Quote';
  
  export interface ICustomer {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    installAddress: string;
    mobilityAids: string[];
    rentalRequestId?: Types.ObjectId;
    createdAt: Date;
  }
  
  const customerSchema = new Schema<ICustomer>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: String,
    email: String,
    installAddress: String,
    mobilityAids: [String],
    rentalRequestId: { type: Schema.Types.ObjectId, ref: 'RentalRequest', required: false },
    createdAt: { type: Date, default: Date.now },
  });
  
  // Post-save hook to update rental request with customerId
  customerSchema.post(
    'save',
    async function (
      doc: HydratedDocument<ICustomer>,
      next: (err?: CallbackError) => void
    ) {
      try {
        if (doc.rentalRequestId) {
          const rentalRequest = await RentalRequest.findById(doc.rentalRequestId);
          if (rentalRequest) {
            // Update this line
            rentalRequest.customerInfo = {
              firstName: doc.firstName,
              lastName: doc.lastName,
              email: doc.email,
              phone: doc.phone
            };
            await rentalRequest.save();
          }
        }
        next();
      } catch (error) {
        next(error as CallbackError);
      }
    }
  );
  
  // Pre-delete hook to clean up related data
  customerSchema.pre(
    'findOneAndDelete',
    async function (
      this: Query<any, HydratedDocument<ICustomer>>,
      next: (err?: CallbackError) => void
    ) {
      try {
        const customerId = this.getQuery()._id;
  
        if (customerId) {
          await Quote.deleteMany({ customerId: customerId });
          await RentalRequest.updateMany(
            { customerId: customerId },
            { $unset: { customerId: '' } }
          );
        }
        next();
      } catch (error) {
        next(error as CallbackError);
      }
    }
  );
  
  // Virtual field for quotes associated with the customer
  customerSchema.virtual('quotes', {
    ref: 'Quote',
    localField: '_id',
    foreignField: 'customerId',
  });
  
  // Enable virtuals in JSON output
  customerSchema.set('toJSON', { virtuals: true });
  customerSchema.set('toObject', { virtuals: true });
  
  export const Customer = model<ICustomer>('Customer', customerSchema);
\`\`\`

# src/middlewares/errorHandler.ts

\`\`\`ts
// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An unexpected error occurred' });
};
\`\`\`

# src/__tests__/testDbConnection.ts

\`\`\`ts
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
\`\`\`

# src/__tests__/setupTests.ts

\`\`\`ts
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
\`\`\`

# src/__tests__/rentalRequests.test.ts

\`\`\`ts
// src/__tests__/rentalRequests.test.ts
import request from 'supertest';
import app from '../index';
import { RentalRequest } from '../models/RentalRequest';

describe('Rental Requests API', () => {
    test('should create a new rental request', async () => {
        const rentalRequestData = {
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890',
          email: 'john.doe@example.com',
          estimatedRampLength: 10,
          estimatedRentalDuration: 3,
          mobilityAids: ['Wheelchair'],
          installTimeframe: 'Next Week',
          installAddress: '123 Main St',
        };
      
        const response = await request(app)
          .post('/api/rental-requests')
          .send(rentalRequestData)
          .expect(201);
      
        expect(response.body).toMatchObject(rentalRequestData);
      
    // Ensure the rental request was saved in the database
    const rentalRequests = await RentalRequest.find();
    expect(rentalRequests.length).toBe(1);
    expect(rentalRequests[0].firstName).toBe('John');
  });

  test('should get all rental requests', async () => {
    // Seed the database with a rental request
    await RentalRequest.create({
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '0987654321',
      email: 'jane.smith@example.com',
      estimatedRampLength: 12,
      estimatedRentalDuration: 2,
      mobilityAids: ['Walker'],
      installTimeframe: 'Tomorrow',
      installAddress: '456 Elm St',
    });

    const response = await request(app)
      .get('/api/rental-requests')
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].firstName).toBe('Jane');
  });

  test('should get a specific rental request', async () => {
    const rentalRequest = await RentalRequest.create({
      firstName: 'Alice',
      lastName: 'Johnson',
      phone: '5551234567',
      email: 'alice.johnson@example.com',
      estimatedRampLength: 8,
      estimatedRentalDuration: 1,
      mobilityAids: ['Scooter'],
      installTimeframe: 'Next Month',
      installAddress: '789 Oak St',
    });

    const response = await request(app)
      .get(`/api/rental-requests/${rentalRequest._id}`)
      .expect(200);

    expect(response.body.firstName).toBe('Alice');
  });

  test('should return 404 for non-existing rental request', async () => {
    const nonExistingId = '60c72b2f5f1b2c001c8e4dfe';

    await request(app)
      .get(`/api/rental-requests/${nonExistingId}`)
      .expect(404);
  });
});
\`\`\`

# src/__tests__/quotes.test.ts

\`\`\`ts
// src/__tests__/quotes.test.ts
import request from 'supertest';
import app from '../index';
import { Quote } from '../models/Quote';
import { Customer, ICustomer } from '../models/Customer';
import { HydratedDocument } from 'mongoose';

describe('Quotes API', () => {
  test('should create a new quote', async () => {
    const customerData = {
      firstName: 'Kevin',
      lastName: 'Malone',
      phone: '1231231234',
      email: 'kevin.malone@dundermifflin.com',
      installAddress: 'Scranton',
      mobilityAids: ['Wheelchair'],
    };

    const customer: HydratedDocument<ICustomer> = await Customer.create(customerData);

    const quoteData = {
      customerId: customer._id,
      rampConfiguration: { totalLength: 15, components: ['Ramp', 'Platform'] },
      pricingCalculations: { deliveryFee: 50, installFee: 100, monthlyRentalRate: 150 },
    };

    const response = await request(app)
      .post('/api/quotes')
      .send(quoteData)
      .expect(201);

    expect(response.body.customerId).toBe(customer._id.toString());
    expect(response.body.rampConfiguration.totalLength).toBe(15);

    const quotes = await Quote.find();
    expect(quotes.length).toBe(1);
    expect(quotes[0].customerId.toString()).toBe(customer._id.toString());
  });

  // Update other tests similarly...
});
\`\`\`

# src/__tests__/pricingVariables.test.ts

\`\`\`ts
// src/__tests__/pricingVariables.test.ts
import request from 'supertest';
import app from '../index';
import { PricingVariables } from '../models/PricingVariables';

describe('Pricing Variables API', () => {
    test('should create or update pricing variables', async () => {
        try {
          const variablesData = {
    deliveryFeePerMile: 2,
    baseDeliveryFee: 30,
    installFeePerComponent: 15,
    baseInstallFee: 50,
    monthlyRentalRatePerFt: 10,
  };

  const response = await request(app)
      .post('/api/pricing-variables')
      .send(variablesData)
      .expect(200);

    expect(response.body).toMatchObject(variablesData);

    const variables = await PricingVariables.find();
    expect(variables.length).toBe(1);
    expect(variables[0].deliveryFeePerMile).toBe(2);
  } catch (error) {
    console.error('Test failed:', error);
    throw error; // Re-throw to ensure the test fails
  }
});

  test('should get the current pricing variables', async () => {
    await PricingVariables.create({
      deliveryFeePerMile: 3,
      baseDeliveryFee: 25,
      installFeePerComponent: 20,
      baseInstallFee: 40,
      monthlyRentalRatePerFt: 12,
    });

    const response = await request(app)
      .get('/api/pricing-variables')
      .expect(200);

    expect(response.body.deliveryFeePerMile).toBe(3);
    expect(response.body.baseDeliveryFee).toBe(25);
  });
});
\`\`\`

# src/__tests__/customers.test.ts

\`\`\`ts
// src/__tests__/customers.test.ts
import request from 'supertest';
import app from '../index';
import { Customer } from '../models/Customer';

describe('Customers API', () => {
    test('should create a new customer', async () => {
        const customerData = {
          firstName: 'Michael',
          lastName: 'Scott',
          phone: '7778889999',
          email: 'michael.scott@dundermifflin.com',
          installAddress: '1725 Slough Ave',
          mobilityAids: ['Wheelchair'],
        };
      
        const response = await request(app)
          .post('/api/customers')
          .send(customerData)
          .expect(201);
      
        expect(response.body).toMatchObject(customerData);
      
        const customers = await Customer.find();
        expect(customers.length).toBe(1); // Failing here
        expect(customers[0].firstName).toBe('Michael');
    });

  test('should get all customers', async () => {
    await Customer.create({
      firstName: 'Jim',
      lastName: 'Halpert',
      phone: '6665554444',
      email: 'jim.halpert@dundermifflin.com',
      installAddress: 'Scranton',
      mobilityAids: ['None'],
    });

    const response = await request(app)
      .get('/api/customers')
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].firstName).toBe('Jim');
  });

  test('should get a specific customer', async () => {
    const customer = await Customer.create({
      firstName: 'Pam',
      lastName: 'Beesly',
      phone: '3332221111',
      email: 'pam.beesly@dundermifflin.com',
      installAddress: 'Scranton',
      mobilityAids: ['None'],
    });

    const response = await request(app)
      .get(`/api/customers/${customer._id}`)
      .expect(200);

    expect(response.body.firstName).toBe('Pam');
  });

  test('should update a customer', async () => {
    const customer = await Customer.create({
      firstName: 'Dwight',
      lastName: 'Schrute',
      phone: '1112223333',
      email: 'dwight.schrute@dundermifflin.com',
      installAddress: 'Schrute Farms',
      mobilityAids: ['None'],
    });

    const updatedData = {
      phone: '9998887777',
    };

    const response = await request(app)
      .put(`/api/customers/${customer._id}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.phone).toBe('9998887777');
  });

  test('should delete a customer', async () => {
    const customer = await Customer.create({
      firstName: 'Stanley',
      lastName: 'Hudson',
      phone: '4445556666',
      email: 'stanley.hudson@dundermifflin.com',
      installAddress: 'Scranton',
      mobilityAids: ['None'],
    });

    await request(app)
      .delete(`/api/customers/${customer._id}`)
      .expect(200);

    const customers = await Customer.find();
    expect(customers.length).toBe(0);
  });
});
\`\`\`

# src/__tests__/calculatePricing.test.ts

\`\`\`ts
// src/__tests__/calculatePricing.test.ts
import request from 'supertest';
import app from '../index';
import { PricingVariables } from '../models/PricingVariables';

describe('Calculate Pricing API', () => {
  beforeEach(async () => {
    // Set up pricing variables
    await PricingVariables.create({
      deliveryFeePerMile: 2,
      baseDeliveryFee: 30,
      installFeePerComponent: 15,
      baseInstallFee: 50,
      monthlyRentalRatePerFt: 10,
    });
  });

  test('should calculate pricing based on ramp configuration', async () => {
    const rampConfiguration = {
      distance: 10, // miles
      components: ['Ramp', 'Platform', 'Handrail'],
      totalLength: 20, // feet
    };

    const response = await request(app)
      .post('/api/calculate-pricing')
      .send({ rampConfiguration })
      .expect(200);

    expect(response.body.deliveryFee).toBe(50); // 30 + (2 * 10)
    expect(response.body.installFee).toBe(95); // 50 + (15 * 3)
    expect(response.body.monthlyRentalRate).toBe(200); // 10 * 20
  });

  test('should return an error if pricing variables are not set', async () => {
    // Clear pricing variables
    await PricingVariables.deleteMany({});

    const rampConfiguration = {
      distance: 5,
      components: ['Ramp'],
      totalLength: 10,
    };

    const response = await request(app)
      .post('/api/calculate-pricing')
      .send({ rampConfiguration })
      .expect(500);

    expect(response.body.message).toBe('Pricing variables not set');
  });
});
\`\`\`


\`\`\`

# src/index.ts

\`\`\`ts
// src/index.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import rentalRequestRoutes from './routes/rentalRequests';
import customerRoutes from './routes/customers';
import quoteRoutes from './routes/quotes';
import pricingVariablesRoutes from './routes/pricingVariables';
import calculatePricingRoutes from './routes/calculatePricing';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGODB_URI!)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.error('MongoDB connection error:', error));
}

// Routes
app.use('/api/rental-requests', rentalRequestRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/pricing-variables', pricingVariablesRoutes);
app.use('/api/calculate-pricing', calculatePricingRoutes);

// Start the server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
\`\`\`

# src/app.ts

\`\`\`ts
import express from 'express';
import rentalRequestsRouter from './routes/rentalRequests';
import customersRouter from './routes/customers';
import quotesRouter from './routes/quotes';
import pricingVariablesRouter from './routes/pricingVariables';
import calculatePricingRouter from './routes/calculatePricing';
import paymentsRouter from './routes/payments';
import esignaturesRouter from './routes/esignatures';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

// Routes
app.use('/api/rental-requests', rentalRequestsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/quotes', quotesRouter);
app.use('/api/pricing-variables', pricingVariablesRouter);
app.use('/api/calculate-pricing', calculatePricingRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/esignatures', esignaturesRouter);

// Error handling middleware
app.use(errorHandler);

export default app;
\`\`\`

# src/utils/email.ts

\`\`\`ts
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
\`\`\`

# src/services/EsignatureService.ts

\`\`\`ts
// This is a placeholder implementation. You'll need to replace this with your actual e-signature service integration.
export class EsignatureService {
  async sendEsignatureRequest(data: any) {
    // Implement the logic to send an e-signature request
    console.log('Sending e-signature request:', data);
    return { success: true, message: 'E-signature request sent' };
  }

  async checkEsignatureStatus(documentId: string) {
    // Implement the logic to check the status of an e-signature request
    console.log('Checking e-signature status for document:', documentId);
    return { status: 'pending' };
  }
}
\`\`\`

# src/routes/rentalRequests.ts

\`\`\`ts
// src/routes/rentalRequests.ts
import express, { Request, Response, NextFunction } from 'express';
import { RentalRequest, IRentalRequest } from '../models/RentalRequest';
import { sendEmail } from '../utils/email';
import { body, validationResult, ValidationChain } from 'express-validator';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

router.use(limiter);

// Validation middleware
const validateRentalRequest: ValidationChain[] = [
  body('customerInfo.firstName').trim().notEmpty().escape(),
  body('customerInfo.lastName').trim().notEmpty().escape(),
  body('customerInfo.email').isEmail().normalizeEmail(),
  body('customerInfo.phone').trim().notEmpty().escape(),
  body('rampDetails.knowRampLength').isBoolean(),
  body('rampDetails.rampLength').optional().isNumeric(),
  body('rampDetails.knowRentalDuration').isBoolean(),
  body('rampDetails.rentalDuration').optional().isNumeric(),
  body('rampDetails.installTimeframe').isIn(['within_a_week', 'within_a_month', 'more_than_a_month']),
  body('rampDetails.mobilityAids').isArray(),
  body('rampDetails.mobilityAids.*').isIn(['wheelchair', 'motorized_scooter', 'walker_cane', 'none']),
  body('installAddress').trim().notEmpty().escape(),
];

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An unexpected error occurred' });
};

// Get all rental requests
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await RentalRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    next(error);
  }
});

// Get a specific rental request
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await RentalRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Rental request not found' });
    }
    res.json(request);
  } catch (error) {
    next(error);
  }
});

// Create a new rental request
router.post('/', validateRentalRequest, async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const rentalRequest = new RentalRequest(req.body);
    await rentalRequest.save();

    // Prepare email body
    const emailBody = prepareEmailBody(rentalRequest);

    // Send email notification
    try {
      await sendEmail(
        process.env.EMAIL_USER!,
        'New Rental Request Received',
        emailBody
      );
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Continue with the response even if email sending fails
    }

    res.status(201).json(rentalRequest);
  } catch (error) {
    next(error);
  }
});

// Update a rental request
router.put('/:id', validateRentalRequest, async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updatedRequest = await RentalRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Rental request not found' });
    }
    res.json(updatedRequest);
  } catch (error) {
    next(error);
  }
});

// Delete a rental request
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedRequest = await RentalRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) {
      return res.status(404).json({ message: 'Rental request not found' });
    }
    res.json({ message: 'Rental request deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Helper function to prepare email body
function prepareEmailBody(rentalRequest: IRentalRequest): string {
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
}

// Apply error handling middleware
router.use(errorHandler);

export default router;
\`\`\`

# src/routes/quotes.ts

\`\`\`ts
// src/routes/quotes.ts
import express from 'express';
import { Quote } from '../models/Quote';
import { Customer } from '../models/Customer';
import { RentalRequest } from '../models/RentalRequest';

const router = express.Router();

// Get all quotes
router.get('/', async (req, res) => {
  try {
    const quotes = await Quote.find()
      .populate('customerId')
      .populate('rentalRequestId')
      .sort({ createdAt: -1 });
    res.json(quotes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific quote
router.get('/:id', async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id)
      .populate('customerId')
      .populate('rentalRequestId');
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }
    res.json(quote);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new quote
router.post('/', async (req, res) => {
  try {
    const { customerId, rentalRequestId, rampConfiguration, pricingCalculations } = req.body;

    // Validate customer
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Optionally validate rental request
    if (rentalRequestId) {
      const rentalRequest = await RentalRequest.findById(rentalRequestId);
      if (!rentalRequest) {
        return res.status(404).json({ message: 'Rental request not found' });
      }
    }

    const quoteData = {
      customerId,
      rentalRequestId,
      rampConfiguration,
      pricingCalculations,
    };

    const quote = new Quote(quoteData);
    await quote.save();

    res.status(201).json(quote);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update a quote
router.put('/:id', async (req, res) => {
  try {
    const quote = await Quote.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }
    res.json(quote);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a quote
router.delete('/:id', async (req, res) => {
  try {
    const quote = await Quote.findByIdAndDelete(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }
    res.json({ message: 'Quote deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
\`\`\`

# src/routes/pricingVariables.ts

\`\`\`ts
// src/routes/pricingVariables.ts
import { Router } from 'express';
import { PricingVariables } from '../models/PricingVariables';

const router = Router();

// Get the current pricing variables
router.get('/', async (req, res) => {
  try {
    const variables = await PricingVariables.findOne().sort({ updatedAt: -1 });
    res.json(variables);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update or create pricing variables
router.post('/', async (req, res) => {
  try {
    const variables = await PricingVariables.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });
    res.json(variables);
  } catch (error: any) {
    console.error('Error in POST /api/pricing-variables:', error);
    res.status(400).json({ message: error.message });
  }
});

export default router;
\`\`\`

# src/routes/payments.ts

\`\`\`ts
import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

router.post('/create-link', async (req, res) => {
  try {
    const { amount, customerEmail } = req.body;
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: 'price_xyz', quantity: 1 }],
      after_completion: { type: 'redirect', redirect: { url: 'https://example.com/success' } },
    });
    res.json(paymentLink);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const paymentIntent = await stripe.paymentIntents.retrieve(id);
    res.json({ status: paymentIntent.status });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
\`\`\`

# src/routes/esignatures.ts

\`\`\`ts
import express from 'express';
import { EsignatureService } from '../services/EsignatureService';

const router = express.Router();
const esignatureService = new EsignatureService();

router.post('/send', async (req, res) => {
  try {
    const result = await esignatureService.sendEsignatureRequest(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/status/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    const status = await esignatureService.checkEsignatureStatus(documentId);
    res.json({ status });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
\`\`\`

# src/routes/customers.ts

\`\`\`ts
// src/routes/customers.ts
import express, { Request, Response, NextFunction } from 'express';
import { Customer } from '../models/Customer';
import { RentalRequest } from '../models/RentalRequest';

const router = express.Router();

// Get all customers
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    next(error);
  }
});

// Get a specific customer
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    next(error);
  }
});

// Create a new customer
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
});

// Update an existing customer
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    next(error);
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
  } catch (error) {
    next(error);
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
  } catch (error) {
    next(error);
  }
});

export default router;
\`\`\`

# src/routes/calculatePricing.ts

\`\`\`ts
// src/routes/calculatePricing.ts
import { Router } from 'express';
import { PricingVariables } from '../models/PricingVariables';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { rampConfiguration } = req.body;
    const variables = await PricingVariables.findOne().sort({ updatedAt: -1 });

    if (!variables) {
      return res.status(500).json({ message: 'Pricing variables not set' });
    }

    // Example calculations
    const deliveryFee =
      variables.baseDeliveryFee +
      variables.deliveryFeePerMile * rampConfiguration.distance;

    const installFee =
      variables.baseInstallFee +
      variables.installFeePerComponent * rampConfiguration.components.length;

    const monthlyRentalRate =
      variables.monthlyRentalRatePerFt * rampConfiguration.totalLength;

    const pricingCalculations = {
      deliveryFee,
      installFee,
      monthlyRentalRate,
    };

    res.json(pricingCalculations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
\`\`\`

# src/models/RentalRequest.ts

\`\`\`ts
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
  createdAt: Date;
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
    rampLength: { type: Number, required: false },
    knowRentalDuration: { type: Boolean, required: true },
    rentalDuration: { type: Number, required: false },
    installTimeframe: { type: String, required: true },
    mobilityAids: { type: [String], required: true },
  },
  installAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const RentalRequest = model<IRentalRequest>('RentalRequest', rentalRequestSchema);
\`\`\`

# src/models/Quote.ts

\`\`\`ts
// src/models/Quote.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IQuote extends Document {
  customerId: Types.ObjectId;
  rentalRequestId?: Types.ObjectId; // Added rentalRequestId field
  rampConfiguration: any;
  pricingCalculations: any;
  createdAt: Date;
}

const quoteSchema = new Schema<IQuote>({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  rentalRequestId: { type: Schema.Types.ObjectId, ref: 'RentalRequest', required: false },
  rampConfiguration: { type: Schema.Types.Mixed, required: true },
  pricingCalculations: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Enable virtuals in JSON output if needed
quoteSchema.set('toJSON', { virtuals: true });
quoteSchema.set('toObject', { virtuals: true });

export const Quote = model<IQuote>('Quote', quoteSchema);
\`\`\`

# src/models/PricingVariables.ts

\`\`\`ts
// src/models/PricingVariables.ts
import { Schema, model, Document } from 'mongoose';

export interface IPricingVariables extends Document {
  deliveryFeePerMile: number;
  baseDeliveryFee: number;
  installFeePerComponent: number;
  baseInstallFee: number;
  monthlyRentalRatePerFt: number;
  updatedAt: Date;
}

const pricingVariablesSchema = new Schema<IPricingVariables>({
  deliveryFeePerMile: { type: Number, required: true },
  baseDeliveryFee: { type: Number, required: true },
  installFeePerComponent: { type: Number, required: true },
  baseInstallFee: { type: Number, required: true },
  monthlyRentalRatePerFt: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export const PricingVariables = model<IPricingVariables>('PricingVariables', pricingVariablesSchema);
\`\`\`

# src/models/Customer.ts

\`\`\`ts
// src/models/Customer.ts
import {
    Schema,
    model,
    Types,
    HydratedDocument,
    CallbackError,
    Query,
  } from 'mongoose';
  import { RentalRequest } from './RentalRequest';
  import { Quote } from './Quote';
  
  export interface ICustomer {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    installAddress: string;
    mobilityAids: string[];
    rentalRequestId?: Types.ObjectId;
    createdAt: Date;
  }
  
  const customerSchema = new Schema<ICustomer>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: String,
    email: String,
    installAddress: String,
    mobilityAids: [String],
    rentalRequestId: { type: Schema.Types.ObjectId, ref: 'RentalRequest', required: false },
    createdAt: { type: Date, default: Date.now },
  });
  
  // Post-save hook to update rental request with customerId
  customerSchema.post(
    'save',
    async function (
      doc: HydratedDocument<ICustomer>,
      next: (err?: CallbackError) => void
    ) {
      try {
        if (doc.rentalRequestId) {
          const rentalRequest = await RentalRequest.findById(doc.rentalRequestId);
          if (rentalRequest) {
            // Update this line
            rentalRequest.customerInfo = {
              firstName: doc.firstName,
              lastName: doc.lastName,
              email: doc.email,
              phone: doc.phone
            };
            await rentalRequest.save();
          }
        }
        next();
      } catch (error) {
        next(error as CallbackError);
      }
    }
  );
  
  // Pre-delete hook to clean up related data
  customerSchema.pre(
    'findOneAndDelete',
    async function (
      this: Query<any, HydratedDocument<ICustomer>>,
      next: (err?: CallbackError) => void
    ) {
      try {
        const customerId = this.getQuery()._id;
  
        if (customerId) {
          await Quote.deleteMany({ customerId: customerId });
          await RentalRequest.updateMany(
            { customerId: customerId },
            { $unset: { customerId: '' } }
          );
        }
        next();
      } catch (error) {
        next(error as CallbackError);
      }
    }
  );
  
  // Virtual field for quotes associated with the customer
  customerSchema.virtual('quotes', {
    ref: 'Quote',
    localField: '_id',
    foreignField: 'customerId',
  });
  
  // Enable virtuals in JSON output
  customerSchema.set('toJSON', { virtuals: true });
  customerSchema.set('toObject', { virtuals: true });
  
  export const Customer = model<ICustomer>('Customer', customerSchema);
\`\`\`

# src/middlewares/errorHandler.ts

\`\`\`ts
// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Validation error', errors: err.message });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  res.status(500).json({ message: 'An unexpected error occurred' });
};
\`\`\`

# src/__tests__/testDbConnection.ts

\`\`\`ts
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
\`\`\`

# src/__tests__/setupTests.ts

\`\`\`ts
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
\`\`\`

# src/__tests__/rentalRequests.test.ts

\`\`\`ts
// src/__tests__/rentalRequests.test.ts
import request from 'supertest';
import app from '../index';
import { RentalRequest } from '../models/RentalRequest';

describe('Rental Requests API', () => {
    test('should create a new rental request', async () => {
        const rentalRequestData = {
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890',
          email: 'john.doe@example.com',
          estimatedRampLength: 10,
          estimatedRentalDuration: 3,
          mobilityAids: ['Wheelchair'],
          installTimeframe: 'Next Week',
          installAddress: '123 Main St',
        };
      
        const response = await request(app)
          .post('/api/rental-requests')
          .send(rentalRequestData)
          .expect(201);
      
        expect(response.body).toMatchObject(rentalRequestData);
      
    // Ensure the rental request was saved in the database
    const rentalRequests = await RentalRequest.find();
    expect(rentalRequests.length).toBe(1);
    expect(rentalRequests[0].firstName).toBe('John');
  });

  test('should get all rental requests', async () => {
    // Seed the database with a rental request
    await RentalRequest.create({
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '0987654321',
      email: 'jane.smith@example.com',
      estimatedRampLength: 12,
      estimatedRentalDuration: 2,
      mobilityAids: ['Walker'],
      installTimeframe: 'Tomorrow',
      installAddress: '456 Elm St',
    });

    const response = await request(app)
      .get('/api/rental-requests')
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].firstName).toBe('Jane');
  });

  test('should get a specific rental request', async () => {
    const rentalRequest = await RentalRequest.create({
      firstName: 'Alice',
      lastName: 'Johnson',
      phone: '5551234567',
      email: 'alice.johnson@example.com',
      estimatedRampLength: 8,
      estimatedRentalDuration: 1,
      mobilityAids: ['Scooter'],
      installTimeframe: 'Next Month',
      installAddress: '789 Oak St',
    });

    const response = await request(app)
      .get(`/api/rental-requests/${rentalRequest._id}`)
      .expect(200);

    expect(response.body.firstName).toBe('Alice');
  });

  test('should return 404 for non-existing rental request', async () => {
    const nonExistingId = '60c72b2f5f1b2c001c8e4dfe';

    await request(app)
      .get(`/api/rental-requests/${nonExistingId}`)
      .expect(404);
  });
});
\`\`\`

# src/__tests__/quotes.test.ts

\`\`\`ts
// src/__tests__/quotes.test.ts
import request from 'supertest';
import app from '../index';
import { Quote } from '../models/Quote';
import { Customer, ICustomer } from '../models/Customer';
import { HydratedDocument } from 'mongoose';

describe('Quotes API', () => {
  test('should create a new quote', async () => {
    const customerData = {
      firstName: 'Kevin',
      lastName: 'Malone',
      phone: '1231231234',
      email: 'kevin.malone@dundermifflin.com',
      installAddress: 'Scranton',
      mobilityAids: ['Wheelchair'],
    };

    const customer: HydratedDocument<ICustomer> = await Customer.create(customerData);

    const quoteData = {
      customerId: customer._id,
      rampConfiguration: { totalLength: 15, components: ['Ramp', 'Platform'] },
      pricingCalculations: { deliveryFee: 50, installFee: 100, monthlyRentalRate: 150 },
    };

    const response = await request(app)
      .post('/api/quotes')
      .send(quoteData)
      .expect(201);

    expect(response.body.customerId).toBe(customer._id.toString());
    expect(response.body.rampConfiguration.totalLength).toBe(15);

    const quotes = await Quote.find();
    expect(quotes.length).toBe(1);
    expect(quotes[0].customerId.toString()).toBe(customer._id.toString());
  });

  // Update other tests similarly...
});
\`\`\`

# src/__tests__/pricingVariables.test.ts

\`\`\`ts
// src/__tests__/pricingVariables.test.ts
import request from 'supertest';
import app from '../index';
import { PricingVariables } from '../models/PricingVariables';

describe('Pricing Variables API', () => {
    test('should create or update pricing variables', async () => {
        try {
          const variablesData = {
    deliveryFeePerMile: 2,
    baseDeliveryFee: 30,
    installFeePerComponent: 15,
    baseInstallFee: 50,
    monthlyRentalRatePerFt: 10,
  };

  const response = await request(app)
      .post('/api/pricing-variables')
      .send(variablesData)
      .expect(200);

    expect(response.body).toMatchObject(variablesData);

    const variables = await PricingVariables.find();
    expect(variables.length).toBe(1);
    expect(variables[0].deliveryFeePerMile).toBe(2);
  } catch (error) {
    console.error('Test failed:', error);
    throw error; // Re-throw to ensure the test fails
  }
});

  test('should get the current pricing variables', async () => {
    await PricingVariables.create({
      deliveryFeePerMile: 3,
      baseDeliveryFee: 25,
      installFeePerComponent: 20,
      baseInstallFee: 40,
      monthlyRentalRatePerFt: 12,
    });

    const response = await request(app)
      .get('/api/pricing-variables')
      .expect(200);

    expect(response.body.deliveryFeePerMile).toBe(3);
    expect(response.body.baseDeliveryFee).toBe(25);
  });
});
\`\`\`

# src/__tests__/customers.test.ts

\`\`\`ts
// src/__tests__/customers.test.ts
import request from 'supertest';
import app from '../index';
import { Customer } from '../models/Customer';

describe('Customers API', () => {
    test('should create a new customer', async () => {
        const customerData = {
          firstName: 'Michael',
          lastName: 'Scott',
          phone: '7778889999',
          email: 'michael.scott@dundermifflin.com',
          installAddress: '1725 Slough Ave',
          mobilityAids: ['Wheelchair'],
        };
      
        const response = await request(app)
          .post('/api/customers')
          .send(customerData)
          .expect(201);
      
        expect(response.body).toMatchObject(customerData);
      
        const customers = await Customer.find();
        expect(customers.length).toBe(1); // Failing here
        expect(customers[0].firstName).toBe('Michael');
    });

  test('should get all customers', async () => {
    await Customer.create({
      firstName: 'Jim',
      lastName: 'Halpert',
      phone: '6665554444',
      email: 'jim.halpert@dundermifflin.com',
      installAddress: 'Scranton',
      mobilityAids: ['None'],
    });

    const response = await request(app)
      .get('/api/customers')
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].firstName).toBe('Jim');
  });

  test('should get a specific customer', async () => {
    const customer = await Customer.create({
      firstName: 'Pam',
      lastName: 'Beesly',
      phone: '3332221111',
      email: 'pam.beesly@dundermifflin.com',
      installAddress: 'Scranton',
      mobilityAids: ['None'],
    });

    const response = await request(app)
      .get(`/api/customers/${customer._id}`)
      .expect(200);

    expect(response.body.firstName).toBe('Pam');
  });

  test('should update a customer', async () => {
    const customer = await Customer.create({
      firstName: 'Dwight',
      lastName: 'Schrute',
      phone: '1112223333',
      email: 'dwight.schrute@dundermifflin.com',
      installAddress: 'Schrute Farms',
      mobilityAids: ['None'],
    });

    const updatedData = {
      phone: '9998887777',
    };

    const response = await request(app)
      .put(`/api/customers/${customer._id}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.phone).toBe('9998887777');
  });

  test('should delete a customer', async () => {
    const customer = await Customer.create({
      firstName: 'Stanley',
      lastName: 'Hudson',
      phone: '4445556666',
      email: 'stanley.hudson@dundermifflin.com',
      installAddress: 'Scranton',
      mobilityAids: ['None'],
    });

    await request(app)
      .delete(`/api/customers/${customer._id}`)
      .expect(200);

    const customers = await Customer.find();
    expect(customers.length).toBe(0);
  });
});
\`\`\`

# src/__tests__/calculatePricing.test.ts

\`\`\`ts
// src/__tests__/calculatePricing.test.ts
import request from 'supertest';
import app from '../index';
import { PricingVariables } from '../models/PricingVariables';

describe('Calculate Pricing API', () => {
  beforeEach(async () => {
    // Set up pricing variables
    await PricingVariables.create({
      deliveryFeePerMile: 2,
      baseDeliveryFee: 30,
      installFeePerComponent: 15,
      baseInstallFee: 50,
      monthlyRentalRatePerFt: 10,
    });
  });

  test('should calculate pricing based on ramp configuration', async () => {
    const rampConfiguration = {
      distance: 10, // miles
      components: ['Ramp', 'Platform', 'Handrail'],
      totalLength: 20, // feet
    };

    const response = await request(app)
      .post('/api/calculate-pricing')
      .send({ rampConfiguration })
      .expect(200);

    expect(response.body.deliveryFee).toBe(50); // 30 + (2 * 10)
    expect(response.body.installFee).toBe(95); // 50 + (15 * 3)
    expect(response.body.monthlyRentalRate).toBe(200); // 10 * 20
  });

  test('should return an error if pricing variables are not set', async () => {
    // Clear pricing variables
    await PricingVariables.deleteMany({});

    const rampConfiguration = {
      distance: 5,
      components: ['Ramp'],
      totalLength: 10,
    };

    const response = await request(app)
      .post('/api/calculate-pricing')
      .send({ rampConfiguration })
      .expect(500);

    expect(response.body.message).toBe('Pricing variables not set');
  });
});
\`\`\`


```

# src/index.ts

```ts
import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
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
import esignaturesRouter from './routes/esignatures';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// CORS configuration
const corsOptions = {
  origin: [process.env.FRONTEND_URL || 'http://localhost:3001', 'http://localhost:3001'],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/rental-requests', rentalRequestsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/quotes', quotesRouter);
app.use('/api/pricing-variables', pricingVariablesRouter);
app.use('/api/calculate-pricing', calculatePricingRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/esignatures', esignaturesRouter);

// Error handling middleware (should be last)
app.use(errorHandler);

export default app;
```

# src/services/pricingService.ts

```ts
import { PricingVariables } from '../models/PricingVariables';
import { calculateDistance } from './distanceCalculation';
import { CustomError } from '../utils/CustomError';

interface RampConfiguration {
  components: string[];
  totalLength: number;
  rentalDuration: number;
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

  const monthlyRentalRate = variables.monthlyRentalRatePerFt * rampConfiguration.totalLength;

  const totalRentalCost = monthlyRentalRate * rampConfiguration.rentalDuration;

  const totalAmount = deliveryFee + installFee + totalRentalCost;

  return {
    deliveryFee,
    installFee,
    monthlyRentalRate,
    totalRentalCost,
    totalAmount,
    distance,
    rentalDuration: rampConfiguration.rentalDuration,
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
      throw new CustomError(`Google Maps API error: ${data.status}`, 500);
    }

    const element = data.rows[0].elements[0];
    if (element.status !== 'OK') {
      throw new CustomError(`Route calculation error: ${element.status}`, 500);
    }

    return {
      distance: element.distance.value / 1609.34,
      duration: element.duration.value,
    };
  } catch (error: any) {
    console.error('Error calculating distance:', error);
    throw new CustomError('Failed to calculate distance', 500);
  }
}
```

# src/services/EsignatureService.ts

```ts
import axios from 'axios';
import { CustomError } from '../utils/CustomError';

export class EsignatureService {
  private apiUrl = 'https://esignatures.io/api';
  private token: string;

  constructor() {
    this.token = process.env.ESIGNATURES_IO_TOKEN!;
    if (!this.token) {
      throw new CustomError('ESIGNATURES_IO_TOKEN is not set in the environment variables', 500);
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
  body('rentalRequestId').optional().isMongoId(),
  body('rampConfiguration.components').isArray().notEmpty(),
  body('rampConfiguration.totalLength').isFloat({ min: 0 }),
  body('rampConfiguration.rentalDuration').isInt({ min: 1 }),
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
  body('rampDetails.installTimeframe').isIn(['within_a_week', 'within_a_month', 'more_than_a_month']),
  body('rampDetails.mobilityAids').isArray(),
  body('rampDetails.mobilityAids.*').isIn(['wheelchair', 'motorized_scooter', 'walker_cane', 'none']),
  body('installAddress').trim().notEmpty(),
];
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

# src/routes/rentalRequests.ts

```ts
// src/routes/rentalRequests.ts
import express, { Request, Response, NextFunction } from 'express';
import { RentalRequest, IRentalRequest } from '../models/RentalRequest';
import { sendEmail } from '../utils/email';
import { validationResult } from 'express-validator';
import { rentalRequestRules } from '../utils/validationRules';
import { CustomError } from '../utils/CustomError';

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

// ... (keep existing POST and PUT routes)

router.post('/', rentalRequestRules, async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError('Validation failed', 400));
  }

  try {
    const rentalRequest = new RentalRequest(req.body);
    await rentalRequest.save();

    const emailBody = prepareEmailBody(rentalRequest);
    await sendEmail(process.env.NOTIFICATION_EMAIL!, 'New Rental Request', emailBody);

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

// ... (keep other routes and helper functions)

function prepareEmailBody(rentalRequest: IRentalRequest): string {
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
}

export default router;
```

# src/routes/quotes.ts

```ts
import express, { Request, Response, NextFunction } from 'express';
import { Quote } from '../models/Quote';
import { Customer } from '../models/Customer';
import { RentalRequest } from '../models/RentalRequest';
import { validationResult } from 'express-validator';
import { quoteRules } from '../utils/validationRules';
import { CustomError } from '../utils/CustomError';
import { calculatePricing } from '../services/pricingService';

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
    return next(new CustomError('Validation failed', 400));
  }

  try {
    const { customerId, rentalRequestId, rampConfiguration } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new CustomError('Customer not found', 404);
    }

    if (rentalRequestId) {
      const rentalRequest = await RentalRequest.findById(rentalRequestId);
      if (!rentalRequest) {
        throw new CustomError('Rental request not found', 404);
      }
    }

    const pricingCalculations = await calculatePricing(rampConfiguration, customer.installAddress);

    const quoteData = {
      customerId,
      customerName: `${customer.firstName} ${customer.lastName}`,
      rentalRequestId,
      rampConfiguration,
      pricingCalculations,
    };

    const quote = new Quote(quoteData);
    await quote.save();

    res.status(201).json(quote);
  } catch (error: any) {
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
      amount: Math.round(quote.pricingCalculations.totalAmount * 100), // Stripe uses cents
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
    return next(new CustomError('Validation failed', 400));
  }

  try {
    const customerData: Partial<ICustomer> = req.body;
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

const router = Router();

interface RampConfiguration {
  components: string[];
  totalLength: number;
  rentalDuration: number;
}

interface QuoteRequest {
  rampConfiguration: RampConfiguration;
  customerAddress: string;
  companyAddress: string;
}

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rampConfiguration, customerAddress, companyAddress } = req.body as QuoteRequest;
    const variables = await PricingVariables.findOne().sort({ updatedAt: -1 });

    if (!variables) {
      throw new CustomError('Pricing variables not set', 500);
    }

    const { distance } = await calculateDistance(companyAddress, customerAddress);

    const deliveryFee = variables.baseDeliveryFee + 
      variables.deliveryFeePerMile * distance;

    const installFee = variables.baseInstallFee + 
      variables.installFeePerComponent * rampConfiguration.components.length;

    const monthlyRentalRate = variables.monthlyRentalRatePerFt * rampConfiguration.totalLength;

    const totalRentalCost = monthlyRentalRate * rampConfiguration.rentalDuration;

    const totalAmount = deliveryFee + installFee + totalRentalCost;

    const pricingCalculations = {
      deliveryFee,
      installFee,
      monthlyRentalRate,
      totalRentalCost,
      totalAmount,
      distance,
      rentalDuration: rampConfiguration.rentalDuration,
    };

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
  createdAt: Date;
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
    rampLength: { type: Number, required: false },
    knowRentalDuration: { type: Boolean, required: true },
    rentalDuration: { type: Number, required: false },
    installTimeframe: { type: String, required: true },
    mobilityAids: { type: [String], required: true },
  },
  installAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const RentalRequest = model<IRentalRequest>('RentalRequest', rentalRequestSchema);
```

# src/models/Quote.ts

```ts
// src/models/Quote.ts
import { Schema, model, Document, Types } from 'mongoose';

export interface IQuote extends Document {
  customerId: Types.ObjectId;
  customerName: string;
  rentalRequestId?: Types.ObjectId;
  rampConfiguration: {
    components: string[];
    totalLength: number;
    rentalDuration: number;
  };
  pricingCalculations: {
    deliveryFee: number;
    installFee: number;
    monthlyRentalRate: number;
    totalRentalCost: number;
    totalAmount: number;
    distance: number;
  };
  createdAt: Date;
}

const quoteSchema = new Schema<IQuote>({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  customerName: { type: String, required: true },
  rentalRequestId: { type: Schema.Types.ObjectId, ref: 'RentalRequest', required: false },
  rampConfiguration: {
    components: { type: [String], required: true },
    totalLength: { type: Number, required: true },
    rentalDuration: { type: Number, required: true },
  },
  pricingCalculations: {
    deliveryFee: { type: Number, required: true },
    installFee: { type: Number, required: true },
    monthlyRentalRate: { type: Number, required: true },
    totalRentalCost: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    distance: { type: Number, required: true },
  },
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

# src/components/SettingsPage.tsx

```tsx
 
```

# src/components/PricingVariablesForm.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { fetchPricingVariables, updatePricingVariables } from '../apiService';

const PricingVariablesForm: React.FC = () => {
  const [variables, setVariables] = useState({
    baseDeliveryFee: 0,
    deliveryFeePerMile: 0,
    baseInstallFee: 0,
    installFeePerComponent: 0,
    monthlyRentalRatePerFt: 0,
  });

  useEffect(() => {
    fetchPricingVariables().then(setVariables);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedVariables = await updatePricingVariables(variables);
      setVariables(updatedVariables);
      alert('Pricing variables updated successfully');
    } catch (error) {
      console.error('Failed to update pricing variables:', error);
      alert('Failed to update pricing variables');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVariables(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Add input fields for each variable */}
      <button type="submit">Update Pricing Variables</button>
    </form>
  );
};

export default PricingVariablesForm;
```

# src/components/Navigation.tsx

```tsx
 
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

# src/__tests__/rentalRequests.test.ts

```ts
// src/__tests__/rentalRequests.test.ts
import request from 'supertest';
import app from '../index';
import { RentalRequest } from '../models/RentalRequest';

describe('Rental Requests API', () => {
    test('should create a new rental request', async () => {
        const rentalRequestData = {
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890',
          email: 'john.doe@example.com',
          estimatedRampLength: 10,
          estimatedRentalDuration: 3,
          mobilityAids: ['Wheelchair'],
          installTimeframe: 'Next Week',
          installAddress: '123 Main St',
        };
      
        const response = await request(app)
          .post('/api/rental-requests')
          .send(rentalRequestData)
          .expect(201);
      
        expect(response.body).toMatchObject(rentalRequestData);
      
    // Ensure the rental request was saved in the database
    const rentalRequests = await RentalRequest.find();
    expect(rentalRequests.length).toBe(1);
    expect(rentalRequests[0].firstName).toBe('John');
  });

  test('should get all rental requests', async () => {
    // Seed the database with a rental request
    await RentalRequest.create({
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '0987654321',
      email: 'jane.smith@example.com',
      estimatedRampLength: 12,
      estimatedRentalDuration: 2,
      mobilityAids: ['Walker'],
      installTimeframe: 'Tomorrow',
      installAddress: '456 Elm St',
    });

    const response = await request(app)
      .get('/api/rental-requests')
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].firstName).toBe('Jane');
  });

  test('should get a specific rental request', async () => {
    const rentalRequest = await RentalRequest.create({
      firstName: 'Alice',
      lastName: 'Johnson',
      phone: '5551234567',
      email: 'alice.johnson@example.com',
      estimatedRampLength: 8,
      estimatedRentalDuration: 1,
      mobilityAids: ['Scooter'],
      installTimeframe: 'Next Month',
      installAddress: '789 Oak St',
    });

    const response = await request(app)
      .get(`/api/rental-requests/${rentalRequest._id}`)
      .expect(200);

    expect(response.body.firstName).toBe('Alice');
  });

  test('should return 404 for non-existing rental request', async () => {
    const nonExistingId = '60c72b2f5f1b2c001c8e4dfe';

    await request(app)
      .get(`/api/rental-requests/${nonExistingId}`)
      .expect(404);
  });
});
```

# src/__tests__/quotes.test.ts

```ts
// src/__tests__/quotes.test.ts
import request from 'supertest';
import app from '../index';
import { Quote } from '../models/Quote';
import { Customer, ICustomer } from '../models/Customer';
import { HydratedDocument } from 'mongoose';

describe('Quotes API', () => {
  test('should create a new quote', async () => {
    const customerData = {
      firstName: 'Kevin',
      lastName: 'Malone',
      phone: '1231231234',
      email: 'kevin.malone@dundermifflin.com',
      installAddress: 'Scranton',
      mobilityAids: ['Wheelchair'],
    };

    const customer: HydratedDocument<ICustomer> = await Customer.create(customerData);

    const quoteData = {
      customerId: customer._id,
      rampConfiguration: { totalLength: 15, components: ['Ramp', 'Platform'] },
      pricingCalculations: { deliveryFee: 50, installFee: 100, monthlyRentalRate: 150 },
    };

    const response = await request(app)
      .post('/api/quotes')
      .send(quoteData)
      .expect(201);

    expect(response.body.customerId).toBe(customer._id.toString());
    expect(response.body.rampConfiguration.totalLength).toBe(15);

    const quotes = await Quote.find();
    expect(quotes.length).toBe(1);
    expect(quotes[0].customerId.toString()).toBe(customer._id.toString());
  });

  // Update other tests similarly...
});
```

# src/__tests__/pricingVariables.test.ts

```ts
// src/__tests__/pricingVariables.test.ts
import request from 'supertest';
import app from '../index';
import { PricingVariables } from '../models/PricingVariables';

describe('Pricing Variables API', () => {
  beforeEach(async () => {
    await PricingVariables.deleteMany({});
  });

  test('should create pricing variables when none exist', async () => {
    const variablesData = {
      deliveryFeePerMile: 2,
      baseDeliveryFee: 30,
      installFeePerComponent: 15,
      baseInstallFee: 50,
      monthlyRentalRatePerFt: 10,
    };

    const response = await request(app)
      .put('/api/pricing-variables')
      .send(variablesData)
      .expect(200);

    expect(response.body).toMatchObject(variablesData);

    const variables = await PricingVariables.find();
    expect(variables.length).toBe(1);
    expect(variables[0].deliveryFeePerMile).toBe(2);
  });

  test('should update existing pricing variables', async () => {
    await PricingVariables.create({
      deliveryFeePerMile: 1,
      baseDeliveryFee: 20,
      installFeePerComponent: 10,
      baseInstallFee: 40,
      monthlyRentalRatePerFt: 8,
    });

    const updatedData = {
      deliveryFeePerMile: 3,
      baseDeliveryFee: 25,
      installFeePerComponent: 20,
      baseInstallFee: 45,
      monthlyRentalRatePerFt: 12,
    };

    const response = await request(app)
      .put('/api/pricing-variables')
      .send(updatedData)
      .expect(200);

    expect(response.body).toMatchObject(updatedData);

    const variables = await PricingVariables.find();
    expect(variables.length).toBe(1);
    expect(variables[0].deliveryFeePerMile).toBe(3);
  });

  test('should get the current pricing variables', async () => {
    const variablesData = {
      deliveryFeePerMile: 2,
      baseDeliveryFee: 30,
      installFeePerComponent: 15,
      baseInstallFee: 50,
      monthlyRentalRatePerFt: 10,
    };

    await PricingVariables.create(variablesData);

    const response = await request(app)
      .get('/api/pricing-variables')
      .expect(200);

    expect(response.body).toMatchObject(variablesData);
  });

  test('should return 404 when no pricing variables exist', async () => {
    const response = await request(app)
      .get('/api/pricing-variables')
      .expect(404);

    expect(response.body.message).toBe('Pricing variables not found');
  });
});
```

# src/__tests__/customers.test.ts

```ts
// src/__tests__/customers.test.ts
import request from 'supertest';
import app from '../index';
import { Customer } from '../models/Customer';

describe('Customers API', () => {
    test('should create a new customer', async () => {
        const customerData = {
          firstName: 'Michael',
          lastName: 'Scott',
          phone: '7778889999',
          email: 'michael.scott@dundermifflin.com',
          installAddress: '1725 Slough Ave',
          mobilityAids: ['Wheelchair'],
        };
      
        const response = await request(app)
          .post('/api/customers')
          .send(customerData)
          .expect(201);
      
        expect(response.body).toMatchObject(customerData);
      
        const customers = await Customer.find();
        expect(customers.length).toBe(1); // Failing here
        expect(customers[0].firstName).toBe('Michael');
    });

  test('should get all customers', async () => {
    await Customer.create({
      firstName: 'Jim',
      lastName: 'Halpert',
      phone: '6665554444',
      email: 'jim.halpert@dundermifflin.com',
      installAddress: 'Scranton',
      mobilityAids: ['None'],
    });

    const response = await request(app)
      .get('/api/customers')
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].firstName).toBe('Jim');
  });

  test('should get a specific customer', async () => {
    const customer = await Customer.create({
      firstName: 'Pam',
      lastName: 'Beesly',
      phone: '3332221111',
      email: 'pam.beesly@dundermifflin.com',
      installAddress: 'Scranton',
      mobilityAids: ['None'],
    });

    const response = await request(app)
      .get(`/api/customers/${customer._id}`)
      .expect(200);

    expect(response.body.firstName).toBe('Pam');
  });

  test('should update a customer', async () => {
    const customer = await Customer.create({
      firstName: 'Dwight',
      lastName: 'Schrute',
      phone: '1112223333',
      email: 'dwight.schrute@dundermifflin.com',
      installAddress: 'Schrute Farms',
      mobilityAids: ['None'],
    });

    const updatedData = {
      phone: '9998887777',
    };

    const response = await request(app)
      .put(`/api/customers/${customer._id}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.phone).toBe('9998887777');
  });

  test('should delete a customer', async () => {
    const customer = await Customer.create({
      firstName: 'Stanley',
      lastName: 'Hudson',
      phone: '4445556666',
      email: 'stanley.hudson@dundermifflin.com',
      installAddress: 'Scranton',
      mobilityAids: ['None'],
    });

    await request(app)
      .delete(`/api/customers/${customer._id}`)
      .expect(200);

    const customers = await Customer.find();
    expect(customers.length).toBe(0);
  });
});
```

# src/__tests__/calculatePricing.test.ts

```ts
// src/__tests__/calculatePricing.test.ts
import request from 'supertest';
import app from '../index';
import { PricingVariables } from '../models/PricingVariables';

describe('Calculate Pricing API', () => {
  beforeEach(async () => {
    // Set up pricing variables
    await PricingVariables.create({
      deliveryFeePerMile: 2,
      baseDeliveryFee: 30,
      installFeePerComponent: 15,
      baseInstallFee: 50,
      monthlyRentalRatePerFt: 10,
    });
  });

  test('should calculate pricing based on ramp configuration', async () => {
    const rampConfiguration = {
      distance: 10, // miles
      components: ['Ramp', 'Platform', 'Handrail'],
      totalLength: 20, // feet
    };

    const response = await request(app)
      .post('/api/calculate-pricing')
      .send({ rampConfiguration })
      .expect(200);

    expect(response.body.deliveryFee).toBe(50); // 30 + (2 * 10)
    expect(response.body.installFee).toBe(95); // 50 + (15 * 3)
    expect(response.body.monthlyRentalRate).toBe(200); // 10 * 20
  });

  test('should return an error if pricing variables are not set', async () => {
    // Clear pricing variables
    await PricingVariables.deleteMany({});

    const rampConfiguration = {
      distance: 5,
      components: ['Ramp'],
      totalLength: 10,
    };

    const response = await request(app)
      .post('/api/calculate-pricing')
      .send({ rampConfiguration })
      .expect(500);

    expect(response.body.message).toBe('Pricing variables not set');
  });
});
```

