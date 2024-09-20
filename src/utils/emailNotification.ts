import { IRentalRequest } from '../models/RentalRequest';
import { sendEmail } from './email';

export const sendRentalRequestNotification = async (rentalRequest: IRentalRequest) => {
  const emailBody = prepareEmailBody(rentalRequest);
  await sendEmail('ty@samedayramps.com', 'New Rental Request Received', emailBody);
};

const prepareEmailBody = (rentalRequest: IRentalRequest): string => {
  return `
    <h2>New Rental Request Received</h2>
    <p>Customer: ${rentalRequest.customerInfo.firstName} ${rentalRequest.customerInfo.lastName}</p>
    <p>Email: ${rentalRequest.customerInfo.email}</p>
    <p>Phone: ${rentalRequest.customerInfo.phone}</p>
    <p>Install Address: ${rentalRequest.installAddress}</p>
    <h3>Ramp Details:</h3>
    <ul>
      <li>Ramp Length: ${rentalRequest.rampDetails.knowRampLength ? rentalRequest.rampDetails.rampLength + ' feet' : 'Unknown'}</li>
      <li>Rental Duration: ${rentalRequest.rampDetails.knowRentalDuration ? rentalRequest.rampDetails.rentalDuration + ' months' : 'Unknown'}</li>
      <li>Install Timeframe: ${rentalRequest.rampDetails.installTimeframe}</li>
      <li>Mobility Aids: ${rentalRequest.rampDetails.mobilityAids.join(', ')}</li>
    </ul>
  `;
};