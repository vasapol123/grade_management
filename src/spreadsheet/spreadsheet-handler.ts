/*
 * 🎉 Phase 1 — Spreadsheet Data Fetching
 * Spreadsheet Data Fetching refers to the process of importing or retrieving
 * data from a spreadsheet, which is Google Sheets in this case, and using it
 * in another program or application. The data will be used for inputting in-
 * formation into a database. However, it can be also used for other variety
 * of purposes, such as creating charts and graphs, analyzing trends. Spread-
 * sheet Data Fetching will also include the ability to filter and manipulate
 * the data to meet specific needs.
 *
 */

/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
import { google, sheets_v4 as sheetsv4, Auth } from 'googleapis';
import { GaxiosError } from 'gaxios';
import * as dotenv from 'dotenv';

import redisClient from '../redis-connection.js';
import { Attributes } from '../common/constant.js';

dotenv.config();

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

  private static googleSheets: sheetsv4.Sheets = sheets;

  private _rawData!: string[][];

  /* 
    eslint-disable-next-line no-useless-constructor, 
    @typescript-eslint/no-empty-function
  */
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

  public get rawData() {
    return this._rawData;
  }

  public set rawData(value: string[][]) {
    this._rawData = value;
  }

  public static async getSheets() {
    const response = await SpreadsheetHandler.googleSheets.spreadsheets.get({
      auth: SpreadsheetHandler.googleAuth,
      spreadsheetId: <string>process.env.SPREADSHEET_ID,
    });

    return response.data.sheets!;
  }

  public static async fetchData(sheetName: string): Promise<string[][]> {
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
        (<(keyof typeof Attributes | string)[]>await this.getHeader()).map(
          async (curr, i) => {
            if (
              (<string[]>Object.keys(Attributes)).includes(curr.toUpperCase())
            ) {
              const col = await this.populateMergedCol(
                <keyof typeof Attributes>curr.toUpperCase()
              );
              if (!unpopulatedRow[i]) {
                return col[num - 1][0] || col[col.length - 1][0];
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
    value: keyof typeof Attributes
  ): Promise<string[][]> {
    try {
      const col = await this.getCol(Attributes[value]);

      return col.map((curr, i, arr) => {
        if (!curr.length) arr[i].push(arr[i - 1][0]);
        return curr;
      });
    } catch (e) {
      throw Error((<GaxiosError>e).response?.statusText);
    }
  }
}
