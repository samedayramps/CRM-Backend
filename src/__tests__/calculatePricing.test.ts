// src/__tests__/calculatePricing.test.ts
import request from 'supertest';
import app from '../app';
import { PricingVariables } from '../models/PricingVariables';

describe('Calculate Pricing API', () => {
  beforeEach(async () => {
    // Set up pricing variables
    await PricingVariables.create({
      deliveryFeePerMile: 2,
      baseDeliveryFee: 30,
      installFeePerComponent: 15,
      baseInstallFee: 50,
      monthlyRentalRatePerFt: 10,
    });
  });

  test('should calculate pricing based on ramp configuration', async () => {
    const rampConfiguration = {
      distance: 10, // miles
      components: ['Ramp', 'Platform', 'Handrail'],
      totalLength: 20, // feet
    };

    const response = await request(app)
      .post('/api/calculate-pricing')
      .send({ rampConfiguration })
      .expect(200);

    expect(response.body.deliveryFee).toBe(50); // 30 + (2 * 10)
    expect(response.body.installFee).toBe(95); // 50 + (15 * 3)
    expect(response.body.monthlyRentalRate).toBe(200); // 10 * 20
  });

  test('should return an error if pricing variables are not set', async () => {
    // Clear pricing variables
    await PricingVariables.deleteMany({});

    const rampConfiguration = {
      distance: 5,
      components: ['Ramp'],
      totalLength: 10,
    };

    const response = await request(app)
      .post('/api/calculate-pricing')
      .send({ rampConfiguration })
      .expect(500);

    expect(response.body.message).toBe('Pricing variables not set');
  });
});