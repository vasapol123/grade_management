/* eslint-disable import/no-unresolved */
// import { studentCodeToYear } from './spreadsheet/spreadsheet.helper.js';
import SpreadsheetHelper from './spreadsheet/spreadsheet.helper.js';
import DatabaseHandler from './database.handler.js';
import SpreadsheetHandler from './spreadsheet/spreadsheet.handler.js';

const spreadsheetHandler = await SpreadsheetHandler.getInstance(
  '6301012620171'
);
const spreadsheetHelper = new SpreadsheetHelper();
const databaseHandler = new DatabaseHandler();

const sheets = await SpreadsheetHandler.getSheets();
const sheetTitles = sheets.map((curr) => {
  return <string>curr.properties?.title;
});

// databaseHandler.createStudents(
//   sheets.map((curr) => { year: studentCodeToYear(<string>curr.properties?.title) })
// );

// spreadsheetHandler.fetchData('6301012620171');

console.log(spreadsheetHandler.getHeader());
