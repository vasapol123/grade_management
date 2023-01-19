/* eslint-disable no-use-before-define */
import { Prisma, Course } from '@prisma/client';
import SpreadsheetHandler from './spreadsheet.handler.js';

const spreadsheetHandler = await SpreadsheetHandler.getInstance(
  '6301012620171'
);

export default class SpreadsheetHelper {
  static studentCodeToYear(studentCode: string): number {
    const currentYear = Number(
      (Number(new Date().getFullYear()) + 543).toString().slice(-2)
    );

    const studentYear = currentYear - Number(studentCode.slice(0, 2));

    return studentYear;
  }

  static async getCourses() {
    const headers = await spreadsheetHandler.getHeader();
    const courseScalarFieldEnum = Object.values(Prisma.CourseScalarFieldEnum);

    const courses: { [key in Omit<Course, 'id'> as string]: string }[] = [];

    await Promise.all(
      Array(spreadsheetHandler.rawData.length)
        .fill(0)
        .map(async (curr, i) => {
          if (i > 1) {
            await spreadsheetHandler.getRow(i + 1).then((values) => {
              const course = {};
              headers.map((header) => {
                const idx = courseScalarFieldEnum.findIndex((el) =>
                  header.includes(el)
                );
                if (idx !== -1) {
                  Object.assign(course, {
                    [courseScalarFieldEnum[idx]]: values[idx + 1].trim(),
                  });
                }
                return header;
              });
              courses.push(course);
            });
          }
          return curr;
        })
    );
    return courses;
  }
}
