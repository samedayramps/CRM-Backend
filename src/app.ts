import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
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
import './config/passport'; // Add this line
import MongoStore from 'connect-mongo';

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
  'https://samedayramps.netlify.app',
  process.env.GOOGLE_REDIRECT_URI // Add this line
];

app.use(cors({
  origin: process.env.FRONTEND_URL,
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

// Session management
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Non-webhook routes
app.use('/api/rental-requests', rentalRequestsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/quotes', quotesRouter);
app.use('/api/pricing-variables', pricingVariablesRouter);
app.use('/api/calculate-pricing', calculatePricingRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/manual-signature', manualSignatureRouter);
app.use('/api/jobs', jobsRouter);

// Error handling middleware (should be last)
app.use(errorHandler);

console.log('Application setup complete');

export default app;