/*
  Warnings:

  - You are about to drop the column `gradeReport_id` on the `enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `grade_average_reports` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[grade_report_id]` on the table `enrollments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `grade_report_id` to the `enrollments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `grade_average_reports` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_gradeReport_id_fkey";

-- DropForeignKey
ALTER TABLE "grade_average_reports" DROP CONSTRAINT "grade_average_reports_studentId_fkey";

-- DropIndex
DROP INDEX "enrollments_gradeReport_id_key";

-- AlterTable
ALTER TABLE "enrollments" DROP COLUMN "gradeReport_id",
ADD COLUMN     "grade_report_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "grade_average_reports" DROP COLUMN "studentId",
ADD COLUMN     "student_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_grade_report_id_key" ON "enrollments"("grade_report_id");

-- AddForeignKey
ALTER TABLE "grade_average_reports" ADD CONSTRAINT "grade_average_reports_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_grade_report_id_fkey" FOREIGN KEY ("grade_report_id") REFERENCES "grade_reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
