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