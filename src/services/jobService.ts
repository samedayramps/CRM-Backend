import { Job, IJob } from '../models/Job';
import { Quote, IQuote } from '../models/Quote';
import { CustomError } from '../utils/CustomError';

export async function createJobFromQuote(quote: IQuote): Promise<IJob> {
  try {
    const newJob = new Job({
      jobId: `JOB-${Date.now()}`, // Generate a unique job ID
      quoteId: quote._id,
      customerId: quote.customerId,
      installAddress: quote.installAddress,
      rampConfiguration: quote.rampConfiguration,
      scheduledInstallationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: 'scheduled'
    });

    const savedJob = await newJob.save();

    // Update the quote with the new job ID
    await Quote.findByIdAndUpdate(quote._id, { jobId: savedJob._id });

    return savedJob;
  } catch (error) {
    console.error('Error creating job from quote:', error);
    throw new CustomError('Failed to create job from quote', 500);
  }
}

export async function getJobById(jobId: string): Promise<IJob | null> {
  try {
    const job = await Job.findById(jobId).populate('quoteId').populate('customerId');
    return job;
  } catch (error) {
    console.error('Error getting job by ID:', error);
    throw new CustomError('Failed to get job', 500);
  }
}

export async function updateJob(jobId: string, updates: Partial<IJob>): Promise<IJob | null> {
  try {
    const job = await Job.findByIdAndUpdate(jobId, updates, { new: true, runValidators: true });
    return job;
  } catch (error) {
    console.error('Error updating job:', error);
    throw new CustomError('Failed to update job', 500);
  }
}

export async function deleteJob(jobId: string): Promise<void> {
  try {
    const job = await Job.findByIdAndDelete(jobId);
    if (!job) {
      throw new CustomError('Job not found', 404);
    }
  } catch (error) {
    console.error('Error deleting job:', error);
    throw new CustomError('Failed to delete job', 500);
  }
}