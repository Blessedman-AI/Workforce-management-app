-- CreateTable
CREATE TABLE "Unavailability" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unavailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnavailabilityInterval" (
    "id" TEXT NOT NULL,
    "unavailabilityId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "UnavailabilityInterval_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Unavailability_userId_idx" ON "Unavailability"("userId");

-- CreateIndex
CREATE INDEX "Unavailability_type_idx" ON "Unavailability"("type");

-- CreateIndex
CREATE INDEX "UnavailabilityInterval_unavailabilityId_idx" ON "UnavailabilityInterval"("unavailabilityId");

-- AddForeignKey
ALTER TABLE "Unavailability" ADD CONSTRAINT "Unavailability_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnavailabilityInterval" ADD CONSTRAINT "UnavailabilityInterval_unavailabilityId_fkey" FOREIGN KEY ("unavailabilityId") REFERENCES "Unavailability"("id") ON DELETE CASCADE ON UPDATE CASCADE;
