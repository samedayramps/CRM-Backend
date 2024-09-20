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
app.use(cors({
  origin: 'https://form.samedayramps.com',
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