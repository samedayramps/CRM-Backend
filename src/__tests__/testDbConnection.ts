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