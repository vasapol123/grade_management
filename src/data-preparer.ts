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

/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
import { Prisma } from '@prisma/client';
import { GRADE_MAPPING } from './common/constant.js';
import WorksheetHandler from './spreadsheet/worksheet-handler.js';

const worksheetHandler = await WorksheetHandler.getInstance('6301012620171');

export default class DataPreparer {
  static studentCodeToYear(studentCode: string): number {
    const currentYear = Number(
      (Number(new Date().getFullYear()) + 543).toString().slice(-2)
    );

    const studentYear = currentYear - Number(studentCode.slice(0, 2));

    return studentYear;
  }

  static async prepareCourseData(): Promise<{ [name: string]: string }[]> {
    const coursesScalarFieldEnum = Object.keys(Prisma.CoursesScalarFieldEnum);

    const courses: { [name: string]: string }[] = [];

    await Promise.all(
      Array(worksheetHandler.rawData.length)
        .fill(0)
        .map(async (curr, i) => {
          if (i > 1) {
            await worksheetHandler.getRow(i + 1).then((values) => {
              const filtered = Object.keys(values)
                .filter((key) => {
                  return coursesScalarFieldEnum.includes(key.toLowerCase());
                })
                .reduce((obj, key) => {
                  return {
                    ...obj,
                    [key.toLowerCase()]: values[key],
                  };
                }, {});
              courses.push(filtered);
            });
          }
          return curr;
        })
    );
    return courses;
  }

  static async prepareGradeReportData() {
    const grade_reportsScalarFieldEnum = Object.keys(
      Prisma.Grade_reportsScalarFieldEnum
    );

    const gradeReports: { [name: string]: string }[] = [];

    await Promise.all(
      Array(worksheetHandler.rawData.length)
        .fill(0)
        .map(async (curr, i) => {
          if (i > 1) {
            await worksheetHandler.getRow(i + 1).then((values) => {
              const filtered:any = Object.keys(values)
                .filter((key) => {
                  return (
                    grade_reportsScalarFieldEnum.findIndex((el) =>
                      el.includes(key.toLowerCase())
                    ) !== -1
                  );
                })
                .reduce((_, key) => {
                  return {
                    letter_grade: values[key],
                    number_grade: GRADE_MAPPING[values[key]],
                  };
                }, {});
              gradeReports.push(filtered);
            });
          }
          return curr;
        })
    );
    return gradeReports;
  }

  static async prepareStudentData(): Promise<{ student_year: number }> {
    return {
      student_year: this.studentCodeToYear(worksheetHandler.sheetName),
    };
  }
}
