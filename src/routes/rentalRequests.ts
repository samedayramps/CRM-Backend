// src/routes/rentalRequests.ts
import express, { Request, Response, NextFunction } from 'express';
import { RentalRequest, IRentalRequest } from '../models/RentalRequest';
import { validationResult } from 'express-validator';
import { rentalRequestRules } from '../utils/validationRules';
import { CustomError } from '../utils/CustomError';
import { sendRentalRequestNotification } from '../utils/emailNotification';
import { sendPushNotification } from '../utils/pushNotification';

const router = express.Router();

// Get all rental requests
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rentalRequests = await RentalRequest.find().sort({ createdAt: -1 });
    res.json(rentalRequests);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

router.post('/', rentalRequestRules, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { customerInfo, rampDetails, installAddress } = req.body;

    const rentalRequest = new RentalRequest({
      customerInfo,
      rampDetails,
      installAddress,
      status: 'pending'
    });

    await rentalRequest.save();

    // Send email notification
    sendRentalRequestNotification(rentalRequest).catch((error) => {
      console.error('Failed to send email notification:', error);
    });

    // Send push notification
    sendPushNotification(`New rental request from ${customerInfo.firstName} ${customerInfo.lastName}`).catch((error) => {
      console.error('Failed to send push notification:', error);
    });

    res.status(201).json(rentalRequest);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

router.put('/:id', rentalRequestRules, async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError('Validation failed', 400));
  }

  try {
    const updatedRequest = await RentalRequest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedRequest) {
      return next(new CustomError('Rental request not found', 404));
    }
    res.json(updatedRequest);
  } catch (error: any) {
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

// Delete a rental request
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedRequest = await RentalRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) {
      return next(new CustomError('Rental request not found', 404));
    }
    res.status(204).send();
  } catch (error: any) {
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

export default router;