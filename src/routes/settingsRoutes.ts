// src/routes/settingsRoutes.ts

import express from 'express';
import { getPricingVariables, updatePricingVariables } from '../controllers/settingsController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/pricing')
  .get(protect, getPricingVariables)
  .put(protect, updatePricingVariables);

export default router;