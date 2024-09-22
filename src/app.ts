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