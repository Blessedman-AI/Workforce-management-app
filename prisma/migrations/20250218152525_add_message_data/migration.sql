/*
  Warnings:

  - You are about to drop the column `messageJsx` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "messageJsx",
ADD COLUMN     "messageData" TEXT;
