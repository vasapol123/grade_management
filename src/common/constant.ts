import { google } from 'googleapis';

export enum Attributes {
  ACADEMICYEAR = 1,
  SEMESTER,
  COURSECODE,
  COURSENAME,
  CREDIT,
  GRADE,
  GPA,
  GPAX,
}

export const GRADE_MAPPING: { [letter: string]: number } = {
  A: 4,
  'B+': 3.5,
  B: 3,
  'C+': 2.5,
  C: 2,
  'D+': 1.5,
  D: 1,
  F: 0,
};

export const AUTH = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

export const SHEETS = google.sheets({
  version: 'v4',
  auth: await AUTH.getClient(),
});
