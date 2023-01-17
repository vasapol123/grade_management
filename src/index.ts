/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import { studentCodeToYear } from './spreadsheet/spreadsheet.helper.js';
import DatabaseHandler from './database.handler.js';
import SpreadSheetHandler from './spreadsheet/spreadsheet.handler.js';

const spreadsheetHandler = new SpreadSheetHandler(
  <string>process.env.SPREADSHEET_ID
);

const databaseHandler = new DatabaseHandler();

const sheets = await spreadsheetHandler.getSheets();

// databaseHandler.createStudents(
//   sheets.map((curr) => { year: studentCodeToYear(<string>curr.properties?.title) })
// );

databaseHandler.createRegistrations();
