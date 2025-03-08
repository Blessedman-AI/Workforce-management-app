-- DropForeignKey
ALTER TABLE "ShiftExchangeRequest" DROP CONSTRAINT "ShiftExchangeRequest_shiftId_fkey";

-- AlterTable
ALTER TABLE "ShiftExchangeRequest" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "ShiftExchangeRequest" ADD CONSTRAINT "ShiftExchangeRequest_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE CASCADE ON UPDATE CASCADE;
