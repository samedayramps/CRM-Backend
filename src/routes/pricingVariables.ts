import express, { Request, Response, NextFunction } from 'express';
import { PricingVariables } from '../models/PricingVariables';
import { validationResult } from 'express-validator';
import { pricingVariablesRules } from '../utils/validationRules';
import { CustomError } from '../utils/CustomError';

const router = express.Router();

// GET /api/pricing-variables
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const variables = await PricingVariables.findOne().sort({ updatedAt: -1 });
    if (!variables) {
      return res.status(404).json({ message: 'Pricing variables not found. Please set initial values.' });
    }
    res.json(variables);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

// POST /api/pricing-variables
router.post('/', pricingVariablesRules, async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError('Validation failed', 400));
  }

  try {
    const pricingVariables = new PricingVariables(req.body);
    await pricingVariables.save();
    res.status(201).json(pricingVariables);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

// PUT /api/pricing-variables
router.put('/', pricingVariablesRules, async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError('Validation failed', 400));
  }

  try {
    const variables = await PricingVariables.findOne().sort({ updatedAt: -1 });
    if (!variables) {
      return next(new CustomError('Pricing variables not found', 404));
    }

    const updatedVariables = await PricingVariables.findByIdAndUpdate(
      variables._id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    res.json(updatedVariables);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

export default router;