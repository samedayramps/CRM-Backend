import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PUSHOVER_API_URL = 'https://api.pushover.net/1/messages.json';

export const sendPushNotification = async (title: string, message: string) => {
  try {
    const response = await axios.post(PUSHOVER_API_URL, {
      token: process.env.PUSHOVER_API_TOKEN,
      user: process.env.PUSHOVER_USER_KEY,
      title,
      message,
    });

    if (response.status !== 200) {
      throw new Error(`Failed to send push notification: ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('Error sending push notification:', error);
  }
};