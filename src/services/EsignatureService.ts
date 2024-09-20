import axios from 'axios';
import { CustomError } from '../utils/CustomError';

export class EsignatureService {
  private token: string;
  private apiUrl: string;

  constructor() {
    this.token = process.env.ESIGNATURES_IO_TOKEN ?? '';
    this.apiUrl = process.env.ESIGNATURES_IO_API_URL ?? 'https://api.esignatures.io';

    if (!this.token) {
      throw new CustomError('ESIGNATURES_IO_TOKEN is not set in the environment variables. Please add it to your .env file.', 500);
    }

    if (!this.apiUrl) {
      throw new CustomError('ESIGNATURES_IO_API_URL is not set in the environment variables. Please add it to your .env file.', 500);
    }
  }

  async sendEsignatureRequest(data: {
    templateId: string;
    signers: Array<{ name: string; email: string }>;
    metadata?: string;
    placeholderFields?: Array<{ api_key: string; value: string }>;
  }) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/contracts?token=${this.token}`,
        data,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error sending e-signature request:', error.response?.data || error.message);
      throw new CustomError('Failed to send e-signature request', 500);
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