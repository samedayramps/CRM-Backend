// src/routes/rentalRequests.ts
import express, { Request, Response, NextFunction } from 'express';
import { RentalRequest, IRentalRequest } from '../models/RentalRequest';
import { sendEmail } from '../utils/email';
import { validationResult } from 'express-validator';
import { rentalRequestRules } from '../utils/validationRules';
import { CustomError } from '../utils/CustomError';

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

// ... (keep other routes and helper functions)

function prepareEmailBody(rentalRequest: IRentalRequest): string {
  return `
    <h2>New Rental Request Received</h2>
    <p>Customer: ${rentalRequest.customerInfo.firstName} ${rentalRequest.customerInfo.lastName}</p>
    <p>Email: ${rentalRequest.customerInfo.email}</p>
    <p>Phone: ${rentalRequest.customerInfo.phone}</p>
    <p>Install Address: ${rentalRequest.installAddress}</p>
    <h3>Ramp Details:</h3>
    <ul>
      <li>Ramp Length: ${rentalRequest.rampDetails.knowRampLength ? rentalRequest.rampDetails.rampLength + ' feet' : 'Unknown'}</li>
      <li>Rental Duration: ${rentalRequest.rampDetails.knowRentalDuration ? rentalRequest.rampDetails.rentalDuration + ' months' : 'Unknown'}</li>
      <li>Install Timeframe: ${rentalRequest.rampDetails.installTimeframe}</li>
      <li>Mobility Aids: ${rentalRequest.rampDetails.mobilityAids.join(', ')}</li>
    </ul>
  `;
}

export default router;