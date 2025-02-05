/*
  Warnings:

  - You are about to drop the column `shiftType` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Shift` table. All the data in the column will be lost.
  - You are about to drop the column `isFirstAdmin` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_userId_fkey";

-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "shiftType",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isFirstAdmin";

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
