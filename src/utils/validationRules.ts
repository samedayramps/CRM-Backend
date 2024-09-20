import { body } from 'express-validator';

export const pricingVariablesRules = [
  body('warehouseAddress').isString().notEmpty(),
  body('baseDeliveryFee').isFloat({ min: 0 }),
  body('deliveryFeePerMile').isFloat({ min: 0 }),
  body('baseInstallFee').isFloat({ min: 0 }),
  body('installFeePerComponent').isFloat({ min: 0 }),
  body('monthlyRentalRatePerFt').isFloat({ min: 0 }),
];

export const quoteRules = [
  body('customerId').isMongoId(),
  body('rentalRequestId').optional().isMongoId(),
  body('rampConfiguration.components').isArray().notEmpty(),
  body('rampConfiguration.totalLength').isFloat({ min: 0 }),
  body('rampConfiguration.rentalDuration').isInt({ min: 1 }),
];

export const customerRules = [
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('phone').trim().notEmpty(),
  body('email').isEmail(),
  body('installAddress').trim().notEmpty(),
  body('mobilityAids').isArray(),
  body('preferredContactMethod').optional().isIn(['email', 'phone', 'text']),
  body('notes').optional().trim(),
];

export const rentalRequestRules = [
  body('customerInfo.firstName').trim().notEmpty(),
  body('customerInfo.lastName').trim().notEmpty(),
  body('customerInfo.email').isEmail(),
  body('customerInfo.phone').trim().notEmpty(),
  body('rampDetails.knowRampLength').isBoolean(),
  body('rampDetails.rampLength').optional().isFloat({ min: 0 }),
  body('rampDetails.knowRentalDuration').isBoolean(),
  body('rampDetails.rentalDuration').optional().isInt({ min: 1 }),
  body('rampDetails.installTimeframe').isIn([
    'Within 24 hours',
    'Within 2 days',
    'Within 3 days',
    'Within 1 week',
    'Over 1 week'
  ]),
  body('rampDetails.mobilityAids').isArray(),
  body('rampDetails.mobilityAids.*').isIn(['wheelchair', 'motorized_scooter', 'walker_cane', 'none']),
  body('installAddress').trim().notEmpty(),
];