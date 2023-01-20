/*
 * 🎉 Phase 1 — Worksheet Data Fetching
 * Worksheet Data Fetching refers to the process of importing or retrieving
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
import { sheets_v4 as sheetsv4, Auth } from 'googleapis';
import { GaxiosError } from 'gaxios';
import * as dotenv from 'dotenv';

import redisClient from '../redis-connection.js';
import { Attributes, AUTH, SHEETS } from '../common/constant.js';
import SpreadsheetHandler from './spreadsheet-handler.js';

dotenv.config();

export default class WorksheetHandler {
  private static instance: WorksheetHandler;

  private static googleAuth: Auth.GoogleAuth = AUTH;

  private static googleSheets: sheetsv4.Sheets = SHEETS;

  private _rawData!: string[][];

  private _sheetName!: string;

  /* 
    eslint-disable-next-line no-useless-constructor, 
    @typescript-eslint/no-empty-function
  */
  private constructor() {}

  public static async getInstance(
    sheetName: string
  ): Promise<WorksheetHandler> {
    let { instance } = WorksheetHandler;

    if (!instance) {
      instance = new WorksheetHandler();
    }

    instance.sheetName = sheetName;
    instance.rawData = await WorksheetHandler.fetchData(sheetName);

    return instance;
  }

  public get rawData() {
    return this._rawData;
  }

  public set rawData(value: string[][]) {
    this._rawData = value;
  }

  public get sheetName() {
    return this._sheetName;
  }

  public set sheetName(value: string) {
    this._sheetName = value;
  }

  public static async fetchData(sheetName: string): Promise<string[][]> {
    if (!(await redisClient.get('rawData'))) {
      const response =
        await WorksheetHandler.googleSheets.spreadsheets.values.get({
          auth: WorksheetHandler.googleAuth,
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

  public async getRow(num: number): Promise<{ [key: string]: string }> {
    try {
      const result: { [key: string]: string } = {};
      const headers = <(keyof typeof Attributes | string)[]>(
        await this.getHeader()
      );
      const mergedCols = await this.getMergeCol();

      const unpopulatedRow = <string[]>this._rawData[num - 1];
      const populatedRow = await Promise.all(
        headers.map(async (curr, i) => {
          if (curr.match(new RegExp(mergedCols.join('|'), 'i'))) {
            const col = await this.populateMergedCol(
              <keyof typeof Attributes>curr.toUpperCase()
            );
            if (!unpopulatedRow[i]) {
              return col[num - 1][0] || col[col.length - 1][0];
            }
          }
          return unpopulatedRow[i];
        })
      );

      headers.forEach(function _(key, i) {
        result[key] = populatedRow[i].trim();
      });

      return result;
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

  public async getMergeCol() {
    const headers = <(keyof typeof Attributes | string)[]>(
      await this.getHeader()
    );
    const sheets = await SpreadsheetHandler.getSheets();

    const merges = <sheetsv4.Schema$GridRange[]>sheets.filter((curr) => {
      return curr.properties?.title === this._sheetName;
    })[0].merges;

    const duplicated = merges.map((curr) => {
      return headers[curr.startColumnIndex!];
    });

    const unduplicated = duplicated.filter((curr, i) => {
      return duplicated.indexOf(curr) === i;
    });

    return unduplicated;
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
