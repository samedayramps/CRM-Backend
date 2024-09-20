import app from './app';
import connectToDatabase from './api/api';

const port = process.env.PORT || 3000;

const startServer = async () => {
  await connectToDatabase();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();