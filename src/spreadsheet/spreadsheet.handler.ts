/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable camelcase */
import { google, sheets_v4, Auth } from 'googleapis';
import { GaxiosError } from 'gaxios';
import * as dotenv from 'dotenv';

dotenv.config();

enum MergedCell {
  ACADEMIC_YEAR = 1,
  SEMESTER = 2,
  GPA = 7,
  GPAX = 8,
}

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

const sheets = google.sheets({
  version: 'v4',
  auth: await auth.getClient(),
});

export default class SpreadsheetHandler {
  private static instance: SpreadsheetHandler;

  private _rawData: string[][] | null | undefined;

  private constructor(
    private readonly spreadsheetId: string,
    private readonly googleAuth: Auth.GoogleAuth = auth,
    private readonly googleSheets: sheets_v4.Sheets = sheets
  ) {
    this.spreadsheetId = spreadsheetId;
  }

  public static getInstance(): SpreadsheetHandler {
    if (!SpreadsheetHandler.instance) {
      SpreadsheetHandler.instance = new SpreadsheetHandler(
        <string>process.env.SPREADSHEET_ID
      );
    }

    return SpreadsheetHandler.instance;
  }

  public get rawData() {
    return this._rawData;
  }

  public async getSheets() {
    const response = await this.googleSheets.spreadsheets.get({
      auth: this.googleAuth,
      spreadsheetId: this.spreadsheetId,
    });

    return response.data.sheets!;
  }

  private async fetchData(
    sheet_name: string
  ): Promise<string[][] | null | undefined> {
    const response = await this.googleSheets.spreadsheets.values.get({
      auth: this.googleAuth,
      spreadsheetId: this.spreadsheetId,
      range: `${sheet_name}!A1:Z1000`,
    });

    return response.data.values;
  }

  public async getHeader(sheet_name: string): Promise<string[]> {
    if (!this._rawData) {
      this._rawData = await this.fetchData(sheet_name);
    }

    return this._rawData![0];
  }

  public async getCell(sheet_name: string, value: string) {
    const response = await this.googleSheets.spreadsheets.values.get({
      auth: this.googleAuth,
      spreadsheetId: this.spreadsheetId,
      range: `${sheet_name}!${value}`,
    });

    return response.data.values?.[0];
  }

  public async getRow(sheet_name: string, num: number): Promise<string[]> {
    try {
      if (!this._rawData) {
        this._rawData = await this.fetchData(sheet_name);
      }

      const unpopulatedRow = <string[]>this._rawData![num - 1];

      const populatedRow = await Promise.all(
        (<(keyof typeof MergedCell | string)[]>(
          await this.getHeader(sheet_name)
        )).map(async (curr, i) => {
          if (
            (<string[]>Object.keys(MergedCell)).includes(curr.toUpperCase())
          ) {
            const col = await this.populateMergedCol(
              sheet_name,
              <keyof typeof MergedCell>curr.toUpperCase()
            );
            if (!unpopulatedRow[i]) {
              return col[num][0] || col[col.length - 1][0];
            }
          }
          return unpopulatedRow[i];
        })
      );

      return populatedRow;
    } catch (e) {
      throw Error((<GaxiosError>e).response?.statusText);
    }
  }

  public async getCol(sheet_name: string, num: number) {
    try {
      if (!this._rawData) {
        this._rawData = await this.fetchData(sheet_name);
      }

      const col = this._rawData!.map((curr) => {
        if (!curr[num - 1]) return [];
        return [curr[num - 1].trim()];
      });

      return col;
    } catch (e) {
      throw Error((<GaxiosError>e).response?.statusText);
    }
  }

  private async populateMergedCol(
    sheet_name: string,
    value: keyof typeof MergedCell
  ): Promise<string[][]> {
    try {
      const col = await this.getCol(sheet_name, MergedCell[value]);

      return col.map((curr, i, arr) => {
        if (!curr.length) arr[i].push(arr[i - 1][0]);
        return curr;
      });
    } catch (e) {
      throw Error((<GaxiosError>e).response?.statusText);
    }
  }
}
