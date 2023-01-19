/* eslint-disable import/no-unresolved */
// import { studentCodeToYear } from './spreadsheet/spreadsheet.helper.js';
import redis from 'redis';
import SpreadsheetHelper from './spreadsheet/spreadsheet.helper.js';
import DatabaseHandler from './database.handler.js';
import SpreadsheetHandler from './spreadsheet/spreadsheet.handler.js';

const spreadsheetHandler = SpreadsheetHandler.getInstance();
const spreadsheetHelper = new SpreadsheetHelper();
const databaseHandler = new DatabaseHandler();

const sheets = await spreadsheetHandler.getSheets();
const sheetTitles = sheets.map((curr) => {
  return <string>curr.properties?.title;
});

// databaseHandler.createStudents(
//   sheets.map((curr) => { year: studentCodeToYear(<string>curr.properties?.title) })
// );

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.connect().then(async () => {
  console.log(await client.get('key'));
  client.quit();
});
