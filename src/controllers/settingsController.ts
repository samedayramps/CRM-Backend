// src/controllers/settingsController.ts

import { Request, Response } from 'express';
import Settings from '../models/Settings';

export const getPricingVariables = async (_req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        pricingVariables: {
          deliveryFeePerMile: 0,
          installFeePerComponent: 0,
          rentalRatePerFoot: 0,
        }
      });
    }
    res.status(200).json(settings.pricingVariables);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pricing variables', error });
  }
};

export const updatePricingVariables = async (req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    settings.pricingVariables = req.body;
    await settings.save();
    res.status(200).json(settings.pricingVariables);
  } catch (error) {
    res.status(500).json({ message: 'Error updating pricing variables', error });
  }
};