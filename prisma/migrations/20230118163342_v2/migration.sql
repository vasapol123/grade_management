/*
  Warnings:

  - You are about to drop the `AveragePoint` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Grade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Registration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AveragePoint" DROP CONSTRAINT "AveragePoint_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Registration" DROP CONSTRAINT "Registration_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Registration" DROP CONSTRAINT "Registration_studentId_fkey";

-- DropTable
DROP TABLE "AveragePoint";

-- DropTable
DROP TABLE "Grade";

-- DropTable
DROP TABLE "Registration";

-- CreateTable
CREATE TABLE "GradeReport" (
    "id" SERIAL NOT NULL,
    "letter" TEXT NOT NULL,
    "number" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GradeReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradeAverageReport" (
    "id" SERIAL NOT NULL,
    "semester" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "gpa" TEXT NOT NULL,
    "gpax" TEXT NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "GradeAverageReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" SERIAL NOT NULL,
    "semester" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "studentId" INTEGER NOT NULL,
    "gradeReportId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_gradeReportId_key" ON "Enrollment"("gradeReportId");

-- AddForeignKey
ALTER TABLE "GradeAverageReport" ADD CONSTRAINT "GradeAverageReport_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_gradeReportId_fkey" FOREIGN KEY ("gradeReportId") REFERENCES "GradeReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
