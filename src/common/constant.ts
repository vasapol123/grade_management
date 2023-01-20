import { google } from 'googleapis';

export enum Attributes {
  ACADEMIC_YEAR = 1,
  SEMESTER,
  COURSE_CODE,
  COURSE_NAME,
  CREDIT,
  GPA,
  GPAX,
}

export const AUTH = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

export const SHEETS = google.sheets({
  version: 'v4',
  auth: await AUTH.getClient(),
});
