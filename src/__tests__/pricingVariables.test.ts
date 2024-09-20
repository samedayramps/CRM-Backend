// src/__tests__/pricingVariables.test.ts
import request from 'supertest';
import app from '../index';
import { PricingVariables } from '../models/PricingVariables';

describe('Pricing Variables API', () => {
  beforeEach(async () => {
    await PricingVariables.deleteMany({});
  });

  test('should create pricing variables when none exist', async () => {
    const variablesData = {
      deliveryFeePerMile: 2,
      baseDeliveryFee: 30,
      installFeePerComponent: 15,
      baseInstallFee: 50,
      monthlyRentalRatePerFt: 10,
    };

    const response = await request(app)
      .put('/api/pricing-variables')
      .send(variablesData)
      .expect(200);

    expect(response.body).toMatchObject(variablesData);

    const variables = await PricingVariables.find();
    expect(variables.length).toBe(1);
    expect(variables[0].deliveryFeePerMile).toBe(2);
  });

  test('should update existing pricing variables', async () => {
    await PricingVariables.create({
      deliveryFeePerMile: 1,
      baseDeliveryFee: 20,
      installFeePerComponent: 10,
      baseInstallFee: 40,
      monthlyRentalRatePerFt: 8,
    });

    const updatedData = {
      deliveryFeePerMile: 3,
      baseDeliveryFee: 25,
      installFeePerComponent: 20,
      baseInstallFee: 45,
      monthlyRentalRatePerFt: 12,
    };

    const response = await request(app)
      .put('/api/pricing-variables')
      .send(updatedData)
      .expect(200);

    expect(response.body).toMatchObject(updatedData);

    const variables = await PricingVariables.find();
    expect(variables.length).toBe(1);
    expect(variables[0].deliveryFeePerMile).toBe(3);
  });

  test('should get the current pricing variables', async () => {
    const variablesData = {
      deliveryFeePerMile: 2,
      baseDeliveryFee: 30,
      installFeePerComponent: 15,
      baseInstallFee: 50,
      monthlyRentalRatePerFt: 10,
    };

    await PricingVariables.create(variablesData);

    const response = await request(app)
      .get('/api/pricing-variables')
      .expect(200);

    expect(response.body).toMatchObject(variablesData);
  });

  test('should return 404 when no pricing variables exist', async () => {
    const response = await request(app)
      .get('/api/pricing-variables')
      .expect(404);

    expect(response.body.message).toBe('Pricing variables not found');
  });
});