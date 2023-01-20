/* eslint-disable no-use-before-define */
import { sheets_v4 as sheetsv4, Auth } from 'googleapis';

import { AUTH, SHEETS } from '../common/constant.js';

export default class SpreadsheetHandler {
  private static instance: SpreadsheetHandler;

  private static googleAuth: Auth.GoogleAuth = AUTH;

  private static googleSheets: sheetsv4.Sheets = SHEETS;

  /* 
    eslint-disable-next-line no-useless-constructor, 
    @typescript-eslint/no-empty-function
  */
  private constructor() {}

  public static async getInstance(): Promise<SpreadsheetHandler> {
    let { instance } = SpreadsheetHandler;

    if (!instance) {
      instance = new SpreadsheetHandler();
    }

    return instance;
  }

  public static async getSheets() {
    const response = await SpreadsheetHandler.googleSheets.spreadsheets.get({
      auth: SpreadsheetHandler.googleAuth,
      spreadsheetId: <string>process.env.SPREADSHEET_ID,
    });

    return response.data.sheets!;
  }
}
