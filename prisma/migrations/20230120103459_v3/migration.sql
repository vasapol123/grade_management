/*
  Warnings:

  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Enrollment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GradeAverageReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GradeReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_gradeReportId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_studentId_fkey";

-- DropForeignKey
ALTER TABLE "GradeAverageReport" DROP CONSTRAINT "GradeAverageReport_studentId_fkey";

-- DropTable
DROP TABLE "Course";

-- DropTable
DROP TABLE "Enrollment";

-- DropTable
DROP TABLE "GradeAverageReport";

-- DropTable
DROP TABLE "GradeReport";

-- DropTable
DROP TABLE "Student";

-- CreateTable
CREATE TABLE "students" (
    "id" SERIAL NOT NULL,
    "student_year" INTEGER NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "course_code" TEXT NOT NULL,
    "course_name" TEXT NOT NULL,
    "course_credit" INTEGER NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grade_reports" (
    "id" SERIAL NOT NULL,
    "letter_grade" TEXT NOT NULL,
    "number_grade" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "grade_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grade_average_reports" (
    "id" SERIAL NOT NULL,
    "academic_year" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "gpa" TEXT NOT NULL,
    "gpax" TEXT NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "grade_average_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollments" (
    "id" SERIAL NOT NULL,
    "semester" TEXT NOT NULL,
    "academic_year" TEXT NOT NULL,
    "student_id" INTEGER NOT NULL,
    "gradeReport_id" INTEGER NOT NULL,
    "course_id" INTEGER NOT NULL,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "courses_course_code_key" ON "courses"("course_code");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_gradeReport_id_key" ON "enrollments"("gradeReport_id");

-- AddForeignKey
ALTER TABLE "grade_average_reports" ADD CONSTRAINT "grade_average_reports_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_gradeReport_id_fkey" FOREIGN KEY ("gradeReport_id") REFERENCES "grade_reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
