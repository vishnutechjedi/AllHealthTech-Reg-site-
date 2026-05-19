/*
  Warnings:

  - You are about to drop the column `eventId` on the `AgendaItem` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `Registration` table. All the data in the column will be lost.
  - You are about to drop the column `ticketTypeId` on the `Registration` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `Speaker` table. All the data in the column will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TicketType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AgendaItem" DROP CONSTRAINT "AgendaItem_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Registration" DROP CONSTRAINT "Registration_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Registration" DROP CONSTRAINT "Registration_ticketTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Speaker" DROP CONSTRAINT "Speaker_eventId_fkey";

-- DropForeignKey
ALTER TABLE "TicketType" DROP CONSTRAINT "TicketType_eventId_fkey";

-- DropIndex
DROP INDEX "AgendaItem_eventId_startTime_idx";

-- AlterTable
ALTER TABLE "AgendaItem" DROP COLUMN "eventId";

-- AlterTable
ALTER TABLE "Registration" DROP COLUMN "eventId",
DROP COLUMN "ticketTypeId";

-- AlterTable
ALTER TABLE "Speaker" DROP COLUMN "eventId";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "TicketType";

-- CreateIndex
CREATE INDEX "AgendaItem_startTime_idx" ON "AgendaItem"("startTime");
