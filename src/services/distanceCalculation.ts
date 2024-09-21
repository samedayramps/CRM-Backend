import axios from 'axios';
import { CustomError } from '../utils/CustomError';

interface DistanceResult {
  distance: number; // in miles
  duration: number; // in seconds
}

export async function calculateDistance(origin: string, destination: string): Promise<DistanceResult> {
  try {
    console.log('Calculating distance:', { origin, destination }); // Add this line for debugging

    if (!origin || !destination) {
      throw new CustomError('Origin and destination are required', 400);
    }

    if (!process.env.GOOGLE_MAPS_API_KEY) {
      throw new CustomError('Google Maps API key is not set', 500);
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
      params: {
        origins: origin,
        destinations: destination,
        units: 'imperial',
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const data = response.data;
    if (data.status !== 'OK') {
      console.error('Google Maps API error:', data);
      throw new CustomError(`Google Maps API error: ${data.status}`, 500);
    }

    if (!data.rows || data.rows.length === 0 || !data.rows[0].elements || data.rows[0].elements.length === 0) {
      console.error('Unexpected Google Maps API response structure:', data);
      throw new CustomError('Invalid response from Google Maps API', 500);
    }

    const element = data.rows[0].elements[0];
    if (element.status !== 'OK') {
      console.error('Route calculation error:', element);
      throw new CustomError(`Route calculation error: ${element.status}`, 500);
    }

    if (!element.distance || !element.duration) {
      console.error('Missing distance or duration in API response:', element);
      throw new CustomError('Invalid distance or duration data', 500);
    }

    return {
      distance: element.distance.value / 1609.34, // Convert meters to miles
      duration: element.duration.value,
    };
  } catch (error: any) {
    console.error('Error in calculateDistance:', error); // Add this line for debugging
    if (error instanceof CustomError) {
      throw error;
    }
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
      throw new CustomError(`Failed to calculate distance: ${error.message}`, 500);
    }
    console.error('Unexpected error in calculateDistance:', error);
    throw new CustomError('An unexpected error occurred while calculating distance', 500);
  }
}