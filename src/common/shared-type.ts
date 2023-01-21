import {
  courses,
  students,
  grade_reports,
  grade_average_reports,
  enrollments,
} from '@prisma/client';

export type coursesWithoutId = Omit<courses, 'id'>;

export type studentsWithoutId = Omit<students, 'id'>;

export type grade_reportsWithoutId = Omit<grade_reports, 'id'>;

export type grade_average_reportsWithoutId = Omit<grade_average_reports, 'id'>;

export type enrollmentsWithoutId = Omit<enrollments, 'id'>;
