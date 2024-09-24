// src/routes/salesProcess.ts

import express from 'express';
import { SalesProcess, SalesStage } from '../models/SalesProcess';
import { CustomError } from '../utils/CustomError';
import { createCustomerInfoRoute } from './salesProcessStages/customerInfo';
import { createRampConfigurationRoute } from './salesProcessStages/rampConfiguration';
import { createJobRoute } from './salesProcessStages/job';

const router = express.Router();

// Get all sales processes
router.get('/', async (req, res, next) => {
  try {
    const salesProcesses = await SalesProcess.find().sort({ createdAt: -1 });
    res.json(salesProcesses);
  } catch (error: any) {
    console.error('Error fetching sales processes:', error);
    next(new CustomError(error.message, 500));
  }
});

// Get a specific sales process
router.get('/:id', async (req, res, next) => {
  try {
    const salesProcess = await SalesProcess.findById(req.params.id);
    if (!salesProcess) {
      return next(new CustomError('Sales process not found', 404));
    }
    res.json(salesProcess);
  } catch (error: any) {
    console.error('Error fetching sales process:', error);
    next(new CustomError(error.message, 500));
  }
});

// Stage-specific routes
router.use('/customerInfo', createCustomerInfoRoute());
router.use('/rampConfiguration', createRampConfigurationRoute());
router.use('/job', createJobRoute());

// Update a sales process
router.put('/:id', async (req, res, next) => {
  try {
    const updatedSalesProcess = await SalesProcess.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedSalesProcess) {
      return next(new CustomError('Sales process not found', 404));
    }
    res.json(updatedSalesProcess);
  } catch (error: any) {
    console.error('Error updating sales process:', error);
    next(new CustomError(error.message, 500));
  }
});

// Delete a sales process
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedSalesProcess = await SalesProcess.findByIdAndDelete(req.params.id);
    if (!deletedSalesProcess) {
      return next(new CustomError('Sales process not found', 404));
    }
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting sales process:', error);
    next(new CustomError(error.message, 500));
  }
});

export default router;