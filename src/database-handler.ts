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

import { Course, Student, PrismaClient } from '@prisma/client';

export default class DatabaseHandler {
  private readonly prisma = new PrismaClient();

  public async createStudents(students: Omit<Student, 'id'>[]) {
    const response = await this.prisma.student.createMany({
      data: students,
    });

    return response;
  }

  public async createCourses(courses: Omit<Course, 'id'>[]) {
    const response = await this.prisma.course.createMany({
      data: courses,
    });

    return response;
  }
}
