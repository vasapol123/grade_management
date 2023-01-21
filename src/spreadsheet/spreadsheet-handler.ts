/* eslint-disable no-use-before-define */
import { sheets_v4 as sheetsv4, Auth } from 'googleapis';

import RedisClient from '../redis-connection.js';
import { AUTH, SHEETS } from '../common/constant.js';

const redisClient = RedisClient.getInstance();

export default class SpreadsheetHandler {
  private static instance: SpreadsheetHandler;

  private googleAuth: Auth.GoogleAuth = AUTH;

  private googleSheets: sheetsv4.Sheets = SHEETS;

  /* 
    eslint-disable-next-line no-useless-constructor, 
    @typescript-eslint/no-empty-function
  */
  private constructor() {}

  public static getInstance(): SpreadsheetHandler {
    let { instance } = SpreadsheetHandler;

    if (!instance) {
      instance = new SpreadsheetHandler();
    }

    return instance;
  }

  public async getSheets(): Promise<sheetsv4.Schema$Sheet[]> {
    if (!(await redisClient.Client!.get('spreadsheets'))) {
      const response = await this.googleSheets.spreadsheets.get({
        auth: this.googleAuth,
        spreadsheetId: <string>process.env.SPREADSHEET_ID,
      });

      redisClient.Client!.set(
        'spreadsheets',
        JSON.stringify(response.data.sheets)
      );
    }

    return JSON.parse((await redisClient.Client!.get('spreadsheets'))!);
  }
}
