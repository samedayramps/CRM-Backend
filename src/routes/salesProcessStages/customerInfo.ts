import express from 'express';
import { SalesProcess, SalesStage } from '../../models/SalesProcess';
import { CustomError } from '../../utils/CustomError';

export const createCustomerInfoRoute = () => {
  const router = express.Router();

  router.post('/', async (req, res, next) => {
    try {
      const { firstName, lastName, email, phone, installAddress } = req.body;

      if (!firstName || !lastName || !email || !phone || !installAddress) {
        throw new CustomError('Missing required fields', 400);
      }

      const salesProcess = new SalesProcess({
        stage: SalesStage.CUSTOMER_INFO,
        customerInfo: { firstName, lastName, email, phone, installAddress },
      });

      await salesProcess.save();
      res.status(201).json(salesProcess);
    } catch (error: any) {
      console.error('Error creating sales process:', error);
      next(new CustomError(error.message, 500));
    }
  });

  return router;
};