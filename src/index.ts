/* eslint-disable import/no-unresolved */
// import { studentCodeToYear } from './spreadsheet/spreadsheet.helper.js';
import SpreadsheetHelper from './spreadsheet/spreadsheet.helper.js';
import DatabaseHandler from './database.handler.js';
import SpreadsheetHandler from './spreadsheet/spreadsheet.handler.js';

const spreadsheetHandler = SpreadsheetHandler.getInstance();
const spreadsheetHelper = new SpreadsheetHelper();
const databaseHandler = new DatabaseHandler();

const sheets = await spreadsheetHandler.getSheets();

// databaseHandler.createStudents(
//   sheets.map((curr) => { year: studentCodeToYear(<string>curr.properties?.title) })
// );
