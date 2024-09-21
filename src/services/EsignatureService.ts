import axios from 'axios';
import { CustomError } from '../utils/CustomError';

export class EsignatureService {
  private token: string;
  private apiUrl: string;

  constructor() {
    this.token = process.env.ESIGNATURES_IO_TOKEN ?? '';
    this.apiUrl = process.env.ESIGNATURES_IO_API_URL ?? 'https://api.esignatures.io';

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
      const response = await axios.post(
        `${this.apiUrl}/contracts?token=${this.token}`,
        data,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000 // 10 seconds timeout
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.code === 'ENOTFOUND') {
        console.error('DNS resolution failed for e-signature service:', error);
        throw new CustomError('Unable to connect to e-signature service. Please try again later.', 503);
      }
      if (axios.isAxiosError(error)) {
        console.error('E-signature request failed:', error.response?.data || error.message);
        throw new CustomError(`E-signature request failed: ${error.message}`, error.response?.status || 500);
      }
      console.error('Unexpected error in sendEsignatureRequest:', error);
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
