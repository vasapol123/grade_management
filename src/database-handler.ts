/*
 * 🎉 Phase 3 — Database Inputting
 * Database Inputting refers to the process of inserting data into a database.
 * This is done by creating new records and fields using a database management
 * system (DBMS). The data come from spreadsheets. The process of inputting
 * data into a database includes the validation of the data, ensuring that it
 * meets specific criteria such as data types, format, and completeness. After
 * that, the data is stored in the database and can be accessed, queried, and
 * analyzed as needed.
 */

import { PrismaClient } from '@prisma/client';
import {
  coursesWithoutId,
  grade_average_reportsWithoutId,
  grade_reportsWithoutId,
  studentsWithoutId,
} from 'common/shared-type.js';

import DataPreparer from './data-preparer.js';

export default class DatabaseHandler {
  private readonly prisma = new PrismaClient();

  public async dumpStudentData(students: studentsWithoutId[]) {
    const response = await this.prisma.students.createMany({
      data: students,
    });

    return response;
  }

  public async dumpCourseData(courses: coursesWithoutId[]) {
    const response = await this.prisma.courses.createMany({
      data: courses,
      skipDuplicates: true,
    });

    return response;
  }

  public async dumpGradeReportData(gradeReports: grade_reportsWithoutId[]) {
    const courses = await DataPreparer.prepareCourseData();
    const enrollments = await DataPreparer.prepareEnrollmentData();

    const response = await Promise.all(
      gradeReports.map((curr, i) => {
        return this.prisma.grade_reports.create({
          data: {
            ...curr,
            enrollment: {
              create: {
                academic_year: enrollments[i].academic_year,
                semester: enrollments[i].semester,
                student: {
                  connect: {
                    id: enrollments[i].student_id,
                  },
                },
                course: {
                  connect: {
                    course_code: courses[i].course_code,
                  },
                },
              },
            },
          },
        });
      })
    );

    return response;
  }

  public async dumpGradeAverageReportData(
    gradeAverageReports: grade_average_reportsWithoutId[]
  ) {
    const response = await this.prisma.grade_average_reports.createMany({
      data: gradeAverageReports,
    });

    return response;
  }

  // Run the database Inputting process
  public async run() {
    await this.dumpCourseData(await DataPreparer.prepareCourseData());

    await this.dumpStudentData([await DataPreparer.prepareStudentData()]);

    await this.dumpGradeReportData(await DataPreparer.prepareGradeReportData());

    await this.dumpGradeAverageReportData(
      await DataPreparer.prepareGradeAverageReportData()
    );
  }
}
