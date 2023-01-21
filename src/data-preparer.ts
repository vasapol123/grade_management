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
/* eslint-disable no-underscore-dangle */
import { Prisma } from '@prisma/client';
import {
  coursesWithoutId,
  enrollmentsWithoutId,
  grade_average_reportsWithoutId,
  grade_reportsWithoutId,
} from './common/shared-type.js';
import { GRADE_MAPPING } from './common/constant.js';
import WorksheetHandler from './spreadsheet/worksheet-handler.js';
import SpreadsheetHandler from './spreadsheet/spreadsheet-handler.js';

const worksheetHandler = await WorksheetHandler.getInstance('6301012620171');

const sheets = await SpreadsheetHandler.getInstance().getSheets();

export default class DataPreparer {
  static _studentIdMapping: Record<string, number> = sheets.reduce<
    Record<string, number>
  >(
    (obj, key) => ({
      ...obj,
      [<string>key.properties!.title]: <number>key.properties!.index + 1,
    }),
    {}
  );

  static studentCodeToYear(studentCode: string): number {
    const currentYear = Number(
      (Number(new Date().getFullYear()) + 543).toString().slice(-2)
    );

    const studentYear = currentYear - Number(studentCode.slice(0, 2));

    return studentYear;
  }

  static async prepareCourseData(): Promise<coursesWithoutId[]> {
    const coursesScalarFieldEnum = Object.keys(Prisma.CoursesScalarFieldEnum);

    const courses: coursesWithoutId[] = [];

    await Promise.all(
      Array(worksheetHandler.rawData.length)
        .fill(0)
        .map(async (curr, i) => {
          if (i >= 1) {
            await worksheetHandler.getRow(i + 1).then((values) => {
              const filtered = Object.keys(values)
                .filter((key) => {
                  return coursesScalarFieldEnum.includes(key.toLowerCase());
                })
                .reduce((obj, key) => {
                  return {
                    ...obj,
                    [key.toLowerCase()]: key
                      .toLowerCase()
                      .match(/course_credit/i)
                      ? +values[key]
                      : values[key],
                  };
                }, {});
              courses.push(<coursesWithoutId>filtered);
            });
          }
          return curr;
        })
    );
    return courses;
  }

  static async prepareGradeReportData(): Promise<grade_reportsWithoutId[]> {
    const grade_reportsScalarFieldEnum = Object.keys(
      Prisma.Grade_reportsScalarFieldEnum
    );

    const gradeReports: grade_reportsWithoutId[] = [];

    await Promise.all(
      Array(worksheetHandler.rawData.length)
        .fill(0)
        .map(async (curr, i) => {
          if (i >= 1) {
            await worksheetHandler.getRow(i + 1).then((values) => {
              const filtered = Object.keys(values)
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
              gradeReports.push(<grade_reportsWithoutId>filtered);
            });
          }
          return curr;
        })
    );
    return gradeReports;
  }

  static async prepareGradeAverageReportData(): Promise<
    grade_average_reportsWithoutId[]
  > {
    const grade_average_reportsScalarFieldEnum = Object.keys(
      Prisma.Grade_average_reportsScalarFieldEnum
    );

    const duplicated: grade_average_reportsWithoutId[] = [];

    await Promise.all(
      Array(worksheetHandler.rawData.length)
        .fill(0)
        .map(async (curr, i) => {
          if (i >= 1) {
            await worksheetHandler.getRow(i + 1).then((values) => {
              const filtered = Object.keys(values)
                .filter((key) => {
                  return grade_average_reportsScalarFieldEnum.includes(
                    key.toLowerCase()
                  );
                })
                .reduce((obj, key) => {
                  return {
                    ...obj,
                    [key.toLowerCase()]: key.toLowerCase().match(/gpa|gpax/i)
                      ? +values[key]
                      : values[key],
                  };
                }, {});
              duplicated.push(<grade_average_reportsWithoutId>filtered);
            });
          }
          return curr;
        })
    );

    let unduplicated = duplicated.filter(
      (curr, i, self) =>
        i ===
        self.findIndex(
          (t) =>
            t.semester === curr.semester &&
            t.gpa === curr.gpa &&
            t.gpax === curr.gpax
        )
    );

    unduplicated = unduplicated.map((curr) => {
      return {
        ...curr,
        student_id: this._studentIdMapping[worksheetHandler.sheetName],
      };
    });

    return unduplicated;
  }

  static async prepareEnrollmentData(): Promise<enrollmentsWithoutId[]> {
    const enrollmentsScalarFieldEnum = Object.keys(
      Prisma.EnrollmentsScalarFieldEnum
    );

    let enrollments: enrollmentsWithoutId[] = [];

    await Promise.all(
      Array(worksheetHandler.rawData.length)
        .fill(0)
        .map(async (curr, i) => {
          if (i >= 1) {
            await worksheetHandler.getRow(i + 1).then((values) => {
              const filtered = Object.keys(values)
                .filter((key) => {
                  return enrollmentsScalarFieldEnum.includes(key.toLowerCase());
                })
                .reduce((obj, key) => {
                  return {
                    ...obj,
                    [key.toLowerCase()]: values[key],
                  };
                }, {});
              enrollments.push(<enrollmentsWithoutId>filtered);
            });
          }
          return curr;
        })
    );

    enrollments = enrollments.map((curr) => {
      return {
        ...curr,
        student_id: this._studentIdMapping[worksheetHandler.sheetName],
      };
    });

    return enrollments;
  }

  static async prepareStudentData(): Promise<{ student_year: number }> {
    return {
      student_year: this.studentCodeToYear(worksheetHandler.sheetName),
    };
  }
}
