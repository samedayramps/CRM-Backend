import { Job } from '../models/Job';
import { IQuote } from '../models/Quote';

export async function createJobFromQuote(quote: IQuote) {
  const installationDate = new Date();
  installationDate.setDate(installationDate.getDate() + 7); // Set installation date to 7 days from now

  const newJob = new Job({
    quoteId: quote._id,
    customerId: quote.customerId,
    installationDate: installationDate,
    address: quote.installAddress,
    status: 'scheduled'
  });

  await newJob.save();
  return newJob;
}