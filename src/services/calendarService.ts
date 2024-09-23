import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { CustomError } from '../utils/CustomError';

export class CalendarError extends CustomError {
  constructor(message: string, statusCode: number = 500) {
    super(message, statusCode);
    this.name = 'CalendarError';
  }
}

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
    throw new CalendarError('Failed to create calendar event');
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
    throw new CalendarError('Failed to update calendar event');
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
    throw new CalendarError('Failed to delete calendar event');
  }
}

export async function getCalendarEvent(eventId: string) {
  try {
    const response = await calendar.events.get({
      calendarId: 'primary',
      eventId: eventId,
    });
    return response.data;
  } catch (error) {
    console.error('Error getting calendar event:', error);
    throw new CalendarError('Failed to get calendar event');
  }
}