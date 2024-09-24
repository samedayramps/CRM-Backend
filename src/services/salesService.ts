import { RentalRequest, IRentalRequest } from '../models/RentalRequest';
import { Customer, ICustomer } from '../models/Customer';
import { Quote, IQuote } from '../models/Quote';
import { Job, IJob } from '../models/Job';
import { SalesStage } from '../types/SalesStage';
import { Types } from 'mongoose';

export const createCustomerFromRentalRequest = async (rentalRequestId: Types.ObjectId): Promise<ICustomer> => {
  const rentalRequest = await RentalRequest.findById(rentalRequestId);
  if (!rentalRequest) throw new Error('Rental request not found');

  const customerData = {
    firstName: rentalRequest.customerInfo.firstName,
    lastName: rentalRequest.customerInfo.lastName,
    phone: rentalRequest.customerInfo.phone,
    email: rentalRequest.customerInfo.email,
    installAddress: rentalRequest.installAddress,
    mobilityAids: rentalRequest.rampDetails.mobilityAids,
    rentalRequestId: rentalRequest._id,
    salesStage: SalesStage.CUSTOMER_CREATED,
  };

  const customer = new Customer(customerData);
  await customer.save();

  rentalRequest.salesStage = SalesStage.CUSTOMER_CREATED;
  await rentalRequest.save();

  return customer;
};

export const createQuoteFromCustomer = async (customerId: Types.ObjectId, quoteData: Partial<IQuote>): Promise<IQuote> => {
  const customer = await Customer.findById(customerId);
  if (!customer) throw new Error('Customer not found');

  const quote = new Quote({
    ...quoteData,
    customerId: customer._id,
    customerName: `${customer.firstName} ${customer.lastName}`,
    salesStage: SalesStage.QUOTE_DRAFT,
  });
  await quote.save();

  customer.salesStage = SalesStage.QUOTE_DRAFT;
  await customer.save();

  return quote;
};

export const createJobFromQuote = async (quoteId: Types.ObjectId): Promise<IJob> => {
  const quote = await Quote.findById(quoteId);
  if (!quote) throw new Error('Quote not found');

  const jobData = {
    quoteId: quote._id,
    customerId: quote.customerId,
    installAddress: quote.installAddress,
    rampConfiguration: quote.rampConfiguration,
    scheduledInstallationDate: new Date(),
    salesStage: SalesStage.JOB_CREATED,
  };

  const job = new Job(jobData);
  await job.save();

  quote.salesStage = SalesStage.JOB_CREATED;
  await quote.save();

  const customer = await Customer.findById(quote.customerId);
  if (customer) {
    customer.salesStage = SalesStage.JOB_CREATED;
    await customer.save();
  }

  return job;
};