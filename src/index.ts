/* eslint-disable import/extensions */
// eslint-disable-next-line import/no-unresolved
import SpreadSheetHandler from './spreadsheet.js';

const spreadsheetHandler = new SpreadSheetHandler(
  <string>process.env.SPREADSHEET_ID
);

console.log(
  await spreadsheetHandler.populateMergedCell('Grade', 'GPA')
);
