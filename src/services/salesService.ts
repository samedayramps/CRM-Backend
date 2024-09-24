import { RentalRequest, IRentalRequest } from '../models/RentalRequest';
import { Job, IJob, JobStage } from '../models/Job';
import { Types } from 'mongoose';

export const createJobFromRentalRequest = async (rentalRequestId: Types.ObjectId): Promise<IJob> => {
  const rentalRequest = await RentalRequest.findById(rentalRequestId);
  if (!rentalRequest) throw new Error('Rental request not found');

  const jobData = {
    stage: JobStage.CUSTOMER_INFO,
    customerInfo: {
      firstName: rentalRequest.customerInfo.firstName,
      lastName: rentalRequest.customerInfo.lastName,
      phone: rentalRequest.customerInfo.phone,
      email: rentalRequest.customerInfo.email,
      installAddress: rentalRequest.installAddress,
      mobilityAids: rentalRequest.rampDetails.mobilityAids,
    },
    // ... other fields as needed
  };

  const job = new Job(jobData);
  await job.save();

  // Update rental request status if needed
  rentalRequest.status = 'job_created';
  await rentalRequest.save();

  return job;
};

// Remove or comment out the createQuoteFromCustomer function as it's no longer needed

export const createJobFromQuote = async (jobId: Types.ObjectId): Promise<IJob> => {
  const job = await Job.findById(jobId);
  if (!job) throw new Error('Job not found');

  job.stage = JobStage.QUOTE;
  await job.save();

  return job;
};