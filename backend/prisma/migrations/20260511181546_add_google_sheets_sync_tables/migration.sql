-- CreateTable
CREATE TABLE "FailedSync" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "registrationData" JSONB NOT NULL,
    "error" TEXT NOT NULL,
    "errorType" TEXT NOT NULL,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "nextRetryTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FailedSync_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeadLetterSync" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "registrationData" JSONB NOT NULL,
    "error" TEXT NOT NULL,
    "errorType" TEXT NOT NULL,
    "retryCount" INTEGER NOT NULL,
    "lastAttemptTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeadLetterSync_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FailedSync_nextRetryTime_idx" ON "FailedSync"("nextRetryTime");

-- CreateIndex
CREATE INDEX "FailedSync_registrationId_idx" ON "FailedSync"("registrationId");

-- CreateIndex
CREATE INDEX "DeadLetterSync_registrationId_idx" ON "DeadLetterSync"("registrationId");

-- CreateIndex
CREATE INDEX "DeadLetterSync_createdAt_idx" ON "DeadLetterSync"("createdAt");
