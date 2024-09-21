import axios from 'axios';
import { CustomError } from '../utils/CustomError';

export class EsignatureService {
  private token: string;
  private apiUrl: string;

  constructor() {
    this.token = process.env.ESIGNATURES_IO_TOKEN ?? '';
    this.apiUrl = 'https://esignatures.io/api'; // Update this to the correct API URL

    if (!this.token) {
      throw new CustomError('ESIGNATURES_IO_TOKEN is not set in the environment variables.', 500);
    }
  }

  async sendEsignatureRequest(data: {
    templateId: string;
    signers: Array<{ name: string; email: string }>;
    metadata?: string;
    placeholderFields?: Array<{ api_key: string; value: string }>;
  }) {
    try {
      console.log('Sending e-signature request:', JSON.stringify(data, null, 2));
      const response = await axios.post(
        `${this.apiUrl}/contracts?token=${this.token}`,
        data,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000 // 10 seconds timeout
        }
      );
      console.log('E-signature response:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error: any) {
      console.error('Error in sendEsignatureRequest:', error);
      if (axios.isAxiosError(error)) {
        console.error('E-signature request failed:', error.response?.data || error.message);
        throw new CustomError(`E-signature request failed: ${error.message}`, error.response?.status || 500);
      }
      throw new CustomError('An unexpected error occurred while sending e-signature request', 500);
    }
  }

  async checkEsignatureStatus(contractId: string) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/contracts/${contractId}?token=${this.token}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error checking e-signature status:', error.response?.data || error.message);
      throw new CustomError('Failed to check e-signature status', 500);
    }
  }
}
