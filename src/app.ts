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

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['https://samedayramps.com', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
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

// Error handling middleware (should be last)
app.use(errorHandler);

export default app;