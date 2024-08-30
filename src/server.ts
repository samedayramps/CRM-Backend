import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import customerRoutes from './routes/customerRoutes';
import jobRoutes from './routes/jobRoutes';
import authRoutes from './routes/authRoutes';
import settingsRoutes from './routes/settingsRoutes';

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:3000'];
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);
  res.status(500).json({ message: 'An unexpected error occurred' });
});

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (e: NodeJS.ErrnoException) => {
  if (e.code === 'EADDRINUSE') {
    console.log('Port is busy, trying the next one...');
    server.listen(0, () => {
      const address = server.address();
      if (address && typeof address !== 'string') {
        console.log(`Server is running on port ${address.port}`);
      } else {
        console.log('Server is running on an unknown port');
      }
    });
  } else {
    console.error('Failed to start server:', e);
  }
});

export default app;