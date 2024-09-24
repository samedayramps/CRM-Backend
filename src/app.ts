import express from 'express';
import cors from 'cors';
import jobsRouter from './routes/jobs';
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
  'https://localhost:3001',
  'https://app.samedayramps.com',
  'https://samedayramps.netlify.app',
  process.env.GOOGLE_REDIRECT_URI
];

app.use(cors({
  origin: function(origin, callback) {
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

// Stripe webhook route (needs raw body)
app.use('/api/jobs/stripe-webhook', express.raw({ type: 'application/json' }));

// Global middleware for JSON requests
app.use(express.json());

// Handle OPTIONS requests
app.options('*', cors());

// Use the consolidated jobs router
app.use('/api/jobs', jobsRouter);

// Error handling middleware (should be last)
app.use(errorHandler);

console.log('Application setup complete');

export default app;