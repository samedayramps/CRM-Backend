import { Request, Response } from 'express';
import Customer, { ICustomer } from '../models/Customer';

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, notes } = req.body;
    const customer: ICustomer = await Customer.create({ 
      firstName, 
      lastName, 
      email, 
      phone, 
      notes 
    });
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: 'Error creating customer', error });
  }
};

export const getCustomers = async (_req: Request, res: Response) => {
  try {
    const customers: ICustomer[] = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching customers', error });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customer: ICustomer | null = await Customer.findById(req.params.id);
    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error fetching customer', error });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, notes } = req.body;
    const customer: ICustomer | null = await Customer.findByIdAndUpdate(
      req.params.id, 
      { firstName, lastName, email, phone, notes }, 
      { new: true }
    );
    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating customer', error });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const customer: ICustomer | null = await Customer.findByIdAndDelete(req.params.id);
    if (customer) {
      res.status(200).json({ message: 'Customer deleted successfully' });
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error deleting customer', error });
  }
};

export const deleteAllCustomers = async (_req: Request, res: Response) => {
  try {
    await Customer.deleteMany({});
    res.status(200).json({ message: 'All customers have been deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting all customers', error });
  }
};