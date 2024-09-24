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
import manualSignatureRouter from './routes/manualSignature';
import jobsRouter from './routes/jobs';
import { errorHandler } from './middlewares/errorHandler';
import dotenv from 'dotenv';
import path from 'path';
import salesProcessRouter from './routes/salesProcess';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('Starting application...');

const app = express();

console.log('Express app created');

// Updated CORS configuration
const allowedOrigins = [
  'https://form.samedayramps.com',
  'http://localhost:3001',
  'https://localhost:3001', // Add this line
  'https://app.samedayramps.com',
  'https://samedayramps.netlify.app',
  process.env.GOOGLE_REDIRECT_URI
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
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
app.use('/api/jobs', jobsRouter);
app.use('/api/quotes', quotesRouter);

// Sales process route
app.use('/api/sales-processes', salesProcessRouter);

// Error handling middleware (should be last)
app.use(errorHandler);

console.log('Application setup complete');

export default app;