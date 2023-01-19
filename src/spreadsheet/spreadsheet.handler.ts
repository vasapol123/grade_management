/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable camelcase */
import { google, sheets_v4, Auth } from 'googleapis';
import { GaxiosError } from 'gaxios';
import * as dotenv from 'dotenv';

import redisClient from '../redis-connection.js';

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

  private static googleAuth: Auth.GoogleAuth = auth;

  private static googleSheets: sheets_v4.Sheets = sheets;

  private _rawData!: string[][];

  // eslint-disable-next-line no-useless-constructor, @typescript-eslint/no-empty-function
  private constructor() {}

  public static async getInstance(
    sheetName: string
  ): Promise<SpreadsheetHandler> {
    let { instance } = SpreadsheetHandler;

    if (!instance) {
      instance = new SpreadsheetHandler();
    }

    instance.rawData = await SpreadsheetHandler.fetchData(sheetName);

    return instance;
  }

  public set rawData(value: string[][]) {
    this._rawData = value;
  }

  static async getSheets() {
    const response = await SpreadsheetHandler.googleSheets.spreadsheets.get({
      auth: SpreadsheetHandler.googleAuth,
      spreadsheetId: <string>process.env.SPREADSHEET_ID,
    });

    return response.data.sheets!;
  }

  static async fetchData(sheetName: string): Promise<string[][]> {
    if (!(await redisClient.get('rawData'))) {
      const response =
        await SpreadsheetHandler.googleSheets.spreadsheets.values.get({
          auth: SpreadsheetHandler.googleAuth,
          spreadsheetId: <string>process.env.SPREADSHEET_ID,
          range: `${sheetName}!A1:Z1000`,
        });

      redisClient.set('rawData', JSON.stringify(response.data.values));
    }

    return JSON.parse((await redisClient.get('rawData'))!);
  }

  public async getHeader(): Promise<string[]> {
    return this._rawData![0];
  }

  public async getRow(num: number): Promise<string[]> {
    try {
      const unpopulatedRow = <string[]>this._rawData[num - 1];

      const populatedRow = await Promise.all(
        (<(keyof typeof MergedCell | string)[]>await this.getHeader()).map(
          async (curr, i) => {
            if (
              (<string[]>Object.keys(MergedCell)).includes(curr.toUpperCase())
            ) {
              const col = await this.populateMergedCol(
                <keyof typeof MergedCell>curr.toUpperCase()
              );
              if (!unpopulatedRow[i]) {
                return col[num][0] || col[col.length - 1][0];
              }
            }
            return unpopulatedRow[i];
          }
        )
      );

      return populatedRow;
    } catch (e) {
      throw Error((<GaxiosError>e).response?.statusText);
    }
  }

  public async getCol(num: number) {
    try {
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
    value: keyof typeof MergedCell
  ): Promise<string[][]> {
    try {
      const col = await this.getCol(MergedCell[value]);

      return col.map((curr, i, arr) => {
        if (!curr.length) arr[i].push(arr[i - 1][0]);
        return curr;
      });
    } catch (e) {
      throw Error((<GaxiosError>e).response?.statusText);
    }
  }
}
