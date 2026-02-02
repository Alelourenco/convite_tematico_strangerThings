-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('YES', 'NO', 'MAYBE');

-- CreateTable
CREATE TABLE "guests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'YES',
    "additionalQty" INTEGER NOT NULL DEFAULT 0,
    "companionName" TEXT,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "guests_createdAt_idx" ON "guests"("createdAt");
