/*
  Warnings:

  - You are about to drop the column `breaks` on the `Shift` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "breaks",
ADD COLUMN     "break" INTEGER;
