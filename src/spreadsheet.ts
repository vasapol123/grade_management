/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable camelcase */
import { google, sheets_v4, Auth } from 'googleapis';
import * as dotenv from 'dotenv';

dotenv.config();

enum MergedCell {
  ACADEMIC_YEAR = 'A',
  SEMESTER = 'B',
  GPA = 'G',
  GPAX = 'H',
}

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

const sheets = google.sheets({
  version: 'v4',
  auth: await auth.getClient(),
});

export default class SpreadSheetHandler {
  constructor(
    private readonly spreadsheetId: string,
    private readonly googleAuth: Auth.GoogleAuth = auth,
    private readonly googleSheets: sheets_v4.Sheets = sheets
  ) {
    this.spreadsheetId = spreadsheetId;
  }

  public async getHeader(sheet_name: string): Promise<string[] | undefined> {
    const response = await this.googleSheets.spreadsheets.values.get({
      auth: this.googleAuth,
      spreadsheetId: this.spreadsheetId,
      range: `${sheet_name}!A1:H1`,
    });

    return response.data.values?.[0];
  }

  public async getCell(sheet_name: string, value: string) {
    const response = await this.googleSheets.spreadsheets.values.get({
      auth: this.googleAuth,
      spreadsheetId: this.spreadsheetId,
      range: `${sheet_name}!${value}`,
    });

    return response.data.values?.[0];
  }

  public async populateMergedCell(
    sheet_name: string,
    value: keyof typeof MergedCell
  ) {
    const range = `${sheet_name}!${MergedCell[value]}:${MergedCell[value]}`;

    const response = await this.googleSheets.spreadsheets.values.get({
      auth: this.googleAuth,
      spreadsheetId: this.spreadsheetId,
      range,
    });

    (response.data.values! as string[][]).map((curr, i, arr) => {
      if (!curr.length) arr[i].push(arr[i - 1][0]);
      return curr;
    });

    return response.data.values;
  }
}
