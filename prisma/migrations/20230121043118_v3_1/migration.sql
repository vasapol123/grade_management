/*
  Warnings:

  - Changed the type of `gpa` on the `grade_average_reports` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `gpax` on the `grade_average_reports` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "grade_average_reports" DROP COLUMN "gpa",
ADD COLUMN     "gpa" DOUBLE PRECISION NOT NULL,
DROP COLUMN "gpax",
ADD COLUMN     "gpax" DOUBLE PRECISION NOT NULL;
