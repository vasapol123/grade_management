/* eslint-disable import/no-unresolved */
// import { studentCodeToYear } from './spreadsheet/spreadsheet.helper.js';
import { disconnect } from './redis-connection.js';
import SpreadsheetHelper from './data-preparer.js';
import DatabaseHandler from './database-handler.js';
import SpreadsheetHandler from './spreadsheet/spreadsheet-handler.js';

const spreadsheetHandler = await SpreadsheetHandler.getInstance(
  '6301012620171'
);
const spreadsheetHelper = new SpreadsheetHelper();
const databaseHandler = new DatabaseHandler();

console.log(await SpreadsheetHelper.prepareStudentData());
// console.log(spreadsheetHandler.rawData);

await disconnect();
