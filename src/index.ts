/* eslint-disable import/no-unresolved */
// import { studentCodeToYear } from './spreadsheet/spreadsheet.helper.js';
import { disconnect } from './redis-connection.js';
import SpreadsheetHelper from './data-preparer.js';
import DatabaseHandler from './database-handler.js';
import WooksheetHandler from './spreadsheet/worksheet-handler.js';

const wooksheetHandler = await WooksheetHandler.getInstance('6301012620171');
const spreadsheetHelper = new SpreadsheetHelper();
const databaseHandler = new DatabaseHandler();

console.log(await SpreadsheetHelper.prepareGradeReportData());
// console.log(spreadsheetHandler.rawData);
// console.log(await wooksheetHandler.getMergeCol());

await disconnect();
