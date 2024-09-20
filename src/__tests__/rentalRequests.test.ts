// src/__tests__/rentalRequests.test.ts
import request from 'supertest';
import app from '../index';
import { RentalRequest } from '../models/RentalRequest';

describe('Rental Requests API', () => {
    test('should create a new rental request', async () => {
        const rentalRequestData = {
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890',
          email: 'john.doe@example.com',
          estimatedRampLength: 10,
          estimatedRentalDuration: 3,
          mobilityAids: ['Wheelchair'],
          installTimeframe: 'Next Week',
          installAddress: '123 Main St',
        };
      
        const response = await request(app)
          .post('/api/rental-requests')
          .send(rentalRequestData)
          .expect(201);
      
        expect(response.body).toMatchObject(rentalRequestData);
      
    // Ensure the rental request was saved in the database
    const rentalRequests = await RentalRequest.find();
    expect(rentalRequests.length).toBe(1);
    expect(rentalRequests[0].firstName).toBe('John');
  });

  test('should get all rental requests', async () => {
    // Seed the database with a rental request
    await RentalRequest.create({
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '0987654321',
      email: 'jane.smith@example.com',
      estimatedRampLength: 12,
      estimatedRentalDuration: 2,
      mobilityAids: ['Walker'],
      installTimeframe: 'Tomorrow',
      installAddress: '456 Elm St',
    });

    const response = await request(app)
      .get('/api/rental-requests')
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].firstName).toBe('Jane');
  });

  test('should get a specific rental request', async () => {
    const rentalRequest = await RentalRequest.create({
      firstName: 'Alice',
      lastName: 'Johnson',
      phone: '5551234567',
      email: 'alice.johnson@example.com',
      estimatedRampLength: 8,
      estimatedRentalDuration: 1,
      mobilityAids: ['Scooter'],
      installTimeframe: 'Next Month',
      installAddress: '789 Oak St',
    });

    const response = await request(app)
      .get(`/api/rental-requests/${rentalRequest._id}`)
      .expect(200);

    expect(response.body.firstName).toBe('Alice');
  });

  test('should return 404 for non-existing rental request', async () => {
    const nonExistingId = '60c72b2f5f1b2c001c8e4dfe';

    await request(app)
      .get(`/api/rental-requests/${nonExistingId}`)
      .expect(404);
  });
});