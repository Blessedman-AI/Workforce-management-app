-- AlterTable
ALTER TABLE "ShiftExchangeRequest" ADD COLUMN     "availableForOthers" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rejectedAt" TIMESTAMP(3);
