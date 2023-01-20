/*
 * 🎉 Phase 2 — Data Preparing/Wrangling
 * Data Preparing, also known as data preparation or data wrangling, is the
 * process of cleaning, transforming, and organizing data in order to make it
 * usable for inputting information into a database. This process involves a
 * series of tasks that are performed to ensure that the data is accurate,
 * consistent, complete, and usable as possible for the intended purpose. All
 * prepared information should be ready to input into a database.
 *
 */

/* eslint-disable no-use-before-define */
import { Prisma, Course } from '@prisma/client';
import { GRADE_MAPPING } from './common/constant.js';
import WooksheetHandler from './spreadsheet/worksheet-handler.js';

const wooksheetHandler = await WooksheetHandler.getInstance('6301012620171');

export default class DataPreparer {
  static studentCodeToYear(studentCode: string): number {
    const currentYear = Number(
      (Number(new Date().getFullYear()) + 543).toString().slice(-2)
    );

    const studentYear = currentYear - Number(studentCode.slice(0, 2));

    return studentYear;
  }

  static async prepareCourseData(): Promise<{ [name: string]: string }[]> {
    const headers = await wooksheetHandler.getHeader();
    const courseScalarFieldEnum = Object.values(Prisma.CourseScalarFieldEnum);

    const courses: { [name: string]: string }[] = [];

    await Promise.all(
      Array(wooksheetHandler.rawData.length)
        .fill(0)
        .map(async (curr, i) => {
          if (i > 1) {
            await wooksheetHandler.getRow(i + 1).then((values) => {
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

  static async prepareGradeReportData() {
    const headers = await wooksheetHandler.getHeader();

    const gradeReports: { [name: string]: string }[] = [];

    await Promise.all(
      Array(wooksheetHandler.rawData.length)
        .fill(0)
        .map(async (curr, i) => {
          if (i > 1) {
            await wooksheetHandler.getRow(i + 1).then((values) => {
              console.log(values);
              const gradeReport = {};
              const idx = headers.findIndex((el) => el === 'grade');
              if (idx !== -1) {
                Object.assign(gradeReport, {
                  letter: values[idx].trim(),
                  number: GRADE_MAPPING[values[idx]],
                });
              }
              gradeReports.push(gradeReport);
            });
          }
          return curr;
        })
    );
    return gradeReports;
  }

  static async prepareStudentData(): Promise<{ [name: string]: string }[]> {
    const headers = await wooksheetHandler.getHeader();
    const studentScalarFieldEnum = Object.values(Prisma.StudentScalarFieldEnum);

    const studentYears: { [name: string]: string }[] = [];

    const studentYear = {};
    headers.map((header) => {
      const idx = studentScalarFieldEnum.findIndex((el) => header.includes(el));
      if (idx !== -1) {
        Object.assign(studentYear, {
          [studentScalarFieldEnum[idx]]: DataPreparer.studentCodeToYear(
            <string>wooksheetHandler.sheetName
          ),
        });
      }
      return header;
    });
    studentYears.push(studentYear);

    return studentYears;
  }
}
