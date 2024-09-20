// src/__tests__/customers.test.ts
import request from 'supertest';
import app from '../index';
import { Customer } from '../models/Customer';

describe('Customers API', () => {
    test('should create a new customer', async () => {
        const customerData = {
          firstName: 'Michael',
          lastName: 'Scott',
          phone: '7778889999',
          email: 'michael.scott@dundermifflin.com',
          installAddress: '1725 Slough Ave',
          mobilityAids: ['Wheelchair'],
        };
      
        const response = await request(app)
          .post('/api/customers')
          .send(customerData)
          .expect(201);
      
        expect(response.body).toMatchObject(customerData);
      
        const customers = await Customer.find();
        expect(customers.length).toBe(1); // Failing here
        expect(customers[0].firstName).toBe('Michael');
    });

  test('should get all customers', async () => {
    await Customer.create({
      firstName: 'Jim',
      lastName: 'Halpert',
      phone: '6665554444',
      email: 'jim.halpert@dundermifflin.com',
      installAddress: 'Scranton',
      mobilityAids: ['None'],
    });

    const response = await request(app)
      .get('/api/customers')
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].firstName).toBe('Jim');
  });

  test('should get a specific customer', async () => {
    const customer = await Customer.create({
      firstName: 'Pam',
      lastName: 'Beesly',
      phone: '3332221111',
      email: 'pam.beesly@dundermifflin.com',
      installAddress: 'Scranton',
      mobilityAids: ['None'],
    });

    const response = await request(app)
      .get(`/api/customers/${customer._id}`)
      .expect(200);

    expect(response.body.firstName).toBe('Pam');
  });

  test('should update a customer', async () => {
    const customer = await Customer.create({
      firstName: 'Dwight',
      lastName: 'Schrute',
      phone: '1112223333',
      email: 'dwight.schrute@dundermifflin.com',
      installAddress: 'Schrute Farms',
      mobilityAids: ['None'],
    });

    const updatedData = {
      phone: '9998887777',
    };

    const response = await request(app)
      .put(`/api/customers/${customer._id}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.phone).toBe('9998887777');
  });

  test('should delete a customer', async () => {
    const customer = await Customer.create({
      firstName: 'Stanley',
      lastName: 'Hudson',
      phone: '4445556666',
      email: 'stanley.hudson@dundermifflin.com',
      installAddress: 'Scranton',
      mobilityAids: ['None'],
    });

    await request(app)
      .delete(`/api/customers/${customer._id}`)
      .expect(200);

    const customers = await Customer.find();
    expect(customers.length).toBe(0);
  });
});