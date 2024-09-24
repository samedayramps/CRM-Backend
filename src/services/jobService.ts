import { Job, IJob } from '../models/Job';
import { CustomError } from '../utils/CustomError';

export async function createJobFromRentalRequest(rentalRequest: any): Promise<IJob> {
  try {
    const newJob = new Job({
      stage: 'CUSTOMER_INFO',
      customerInfo: {
        firstName: rentalRequest.customerInfo.firstName,
        lastName: rentalRequest.customerInfo.lastName,
        phone: rentalRequest.customerInfo.phone,
        email: rentalRequest.customerInfo.email,
        installAddress: rentalRequest.installAddress,
        mobilityAids: rentalRequest.rampDetails.mobilityAids,
      },
      // ... other fields as needed
    });

    const savedJob = await newJob.save();
    return savedJob;
  } catch (error) {
    console.error('Error creating job from rental request:', error);
    throw new CustomError('Failed to create job from rental request', 500);
  }
}

export async function getJobById(jobId: string): Promise<IJob | null> {
  try {
    const job = await Job.findById(jobId);
    return job;
  } catch (error) {
    console.error('Error getting job by ID:', error);
    throw new CustomError('Failed to get job', 500);
  }
}