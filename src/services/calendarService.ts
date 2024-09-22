import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { CustomError } from '../utils/CustomError';

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

interface CalendarEventParams {
  summary: string;
  description: string;
  startDateTime: Date;
  endDateTime: Date;
  location: string;
}

export async function createCalendarEvent(params: CalendarEventParams) {
  try {
    const event = {
      summary: params.summary,
      description: params.description,
      start: {
        dateTime: params.startDateTime.toISOString(),
        timeZone: 'America/Chicago',
      },
      end: {
        dateTime: params.endDateTime.toISOString(),
        timeZone: 'America/Chicago',
      },
      location: params.location,
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw new CustomError('Failed to create calendar event', 500);
  }
}

export async function updateCalendarEvent(eventId: string, params: CalendarEventParams) {
  try {
    const event = {
      summary: params.summary,
      description: params.description,
      start: {
        dateTime: params.startDateTime.toISOString(),
        timeZone: 'America/Chicago',
      },
      end: {
        dateTime: params.endDateTime.toISOString(),
        timeZone: 'America/Chicago',
      },
      location: params.location,
    };

    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId: eventId,
      requestBody: event,
    });

    return response.data;
  } catch (error) {
    console.error('Error updating calendar event:', error);
    throw new CustomError('Failed to update calendar event', 500);
  }
}

export async function deleteCalendarEvent(eventId: string) {
  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    throw new CustomError('Failed to delete calendar event', 500);
  }
}