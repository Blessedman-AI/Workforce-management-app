/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Shift` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_createdBy_fkey";

-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "createdBy",
ADD COLUMN     "createdByUserId" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "assignedToUserId" SET DEFAULT '';

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
