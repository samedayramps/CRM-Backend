import express from 'express';
import { SalesProcess, SalesStage } from '../../models/SalesProcess';
import { CustomError } from '../../utils/CustomError';
import { RampConfiguration } from '../../models/Quote';

export const createStage2Route = () => {
  const router = express.Router();

  router.post('/:id', async (req, res, next) => {
    try {
      const { height, components, totalLength, pricingCalculations, scheduledInstallationDate } = req.body;

      if (!components || !totalLength || !pricingCalculations || !scheduledInstallationDate) {
        throw new CustomError('Missing required fields', 400);
      }

      const salesProcess = await SalesProcess.findById(req.params.id);
      if (!salesProcess) {
        return next(new CustomError('Sales process not found', 404));
      }

      const rampConfiguration: RampConfiguration = {
        height,
        components,
        totalLength,
      };

      salesProcess.stage = SalesStage.RAMP_CONFIGURATION;
      salesProcess.rampConfiguration = rampConfiguration;
      salesProcess.pricingCalculations = pricingCalculations;
      salesProcess.scheduledInstallationDate = scheduledInstallationDate;

      await salesProcess.save();
      res.json(salesProcess);
    } catch (error: any) {
      console.error('Error updating sales process:', error);
      next(new CustomError(error.message, 500));
    }
  });

  return router;
};