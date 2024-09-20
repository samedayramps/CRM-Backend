// src/__tests__/quotes.test.ts
import request from 'supertest';
import app from '../index';
import { Quote } from '../models/Quote';
import { Customer, ICustomer } from '../models/Customer';
import { HydratedDocument, Types } from 'mongoose';

describe('Quotes API', () => {
  test('should create a new quote', async () => {
    const customerData = {
      firstName: 'Kevin',
      lastName: 'Malone',
      phone: '1231231234',
      email: 'kevin.malone@dundermifflin.com',
      installAddress: 'Scranton',
      mobilityAids: ['Wheelchair'],
    };

    const customer = {
      _id: new Types.ObjectId(),
      // ... other customer properties
    };

    const quoteData = {
      customerId: customer._id,
      rampConfiguration: { totalLength: 15, components: ['Ramp', 'Platform'] },
      pricingCalculations: { deliveryFee: 50, installFee: 100, monthlyRentalRate: 150 },
    };

    const response = await request(app)
      .post('/api/quotes')
      .send(quoteData)
      .expect(201);

    expect(response.body.customerId).toBe(customer._id.toString());
    expect(response.body.rampConfiguration.totalLength).toBe(15);

    const quotes = await Quote.find();
    expect(quotes.length).toBe(1);
    expect(quotes[0].customerId.toString()).toBe(customer._id.toString());
  });

  // Update other tests similarly...
});