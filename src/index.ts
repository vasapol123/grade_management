/* eslint-disable import/extensions */
import { PrismaClient } from '@prisma/client';
// eslint-disable-next-line import/no-unresolved
import SpreadSheetHandler from './spreadsheet.js';

const spreadsheetHandler = new SpreadSheetHandler(
  <string>process.env.SPREADSHEET_ID
);
const prisma = new PrismaClient();

console.log(await spreadsheetHandler.getRow('6301012620171', 3));
