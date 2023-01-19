import { Course } from '@prisma/client';
import SpreadsheetHandler from './spreadsheet.handler.js';

export default class SpreadsheetHelper {
  private readonly spreadsheetHandler = SpreadsheetHandler.getInstance();

  static studentCodeToYear(studentCode: string): number {
    const currentYear = Number(
      (Number(new Date().getFullYear()) + 543).toString().slice(-2)
    );

    const studentYear = currentYear - Number(studentCode.slice(0, 2));

    return studentYear;
  }
}
