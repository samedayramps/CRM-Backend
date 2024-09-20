// src/routes/customers.ts
import express, { Request, Response, NextFunction } from 'express';
import { Customer, ICustomer } from '../models/Customer';
import { RentalRequest } from '../models/RentalRequest';
import { body, validationResult } from 'express-validator';
import { customerRules } from '../utils/validationRules';
import { CustomError } from '../utils/CustomError';

const router = express.Router();

// Validation middleware
const validateCustomer = [
  body('firstName').trim().notEmpty().escape(),
  body('lastName').trim().notEmpty().escape(),
  body('phone').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('installAddress').trim().notEmpty(),
  body('mobilityAids').isArray(),
  body('preferredContactMethod').optional().isIn(['email', 'phone', 'text']),
  body('notes').optional().trim().escape(),
];

// Get all customers
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

// Get a specific customer
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      throw new CustomError('Customer not found', 404);
    }
    res.json(customer);
  } catch (error: any) {
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

// Create a new customer
router.post('/', customerRules, async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const customerData: Partial<ICustomer> = req.body;
    if (!customerData.mobilityAids) {
      customerData.mobilityAids = []; // Set a default empty array if not provided
    }
    const customer = new Customer(customerData);
    await customer.save();
    res.status(201).json(customer);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

// Update an existing customer
router.put('/:id', customerRules, async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new CustomError('Validation failed', 400));
  }

  try {
    const customerData: Partial<ICustomer> = req.body;
    const customer = await Customer.findByIdAndUpdate(req.params.id, customerData, {
      new: true,
      runValidators: true,
    });

    if (!customer) {
      return next(new CustomError('Customer not found', 404));
    }
    res.json(customer);
  } catch (error: any) {
    next(new CustomError(error.message, error.statusCode || 500));
  }
});

// Create a customer from a rental request
router.post('/from-rental-request/:rentalRequestId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rentalRequestId } = req.params;
    const rentalRequest = await RentalRequest.findById(rentalRequestId);

    if (!rentalRequest) {
      return res.status(404).json({ message: 'Rental request not found' });
    }

    const customerData = {
      firstName: rentalRequest.customerInfo.firstName,
      lastName: rentalRequest.customerInfo.lastName,
      phone: rentalRequest.customerInfo.phone,
      email: rentalRequest.customerInfo.email,
      installAddress: rentalRequest.installAddress,
      mobilityAids: rentalRequest.rampDetails.mobilityAids,
      rentalRequestId: rentalRequest._id,
    };

    const customer = new Customer(customerData);
    await customer.save();

    res.status(201).json(customer);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

// Delete a customer
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await Customer.findOneAndDelete({ _id: req.params.id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
});

export default router;