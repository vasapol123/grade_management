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
