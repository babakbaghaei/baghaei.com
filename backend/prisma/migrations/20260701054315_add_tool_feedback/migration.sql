-- CreateTable
CREATE TABLE "ToolReview" (
    "id" SERIAL NOT NULL,
    "toolSlug" TEXT NOT NULL,
    "name" TEXT,
    "rating" INTEGER NOT NULL,
    "body" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ToolReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolReport" (
    "id" SERIAL NOT NULL,
    "toolSlug" TEXT NOT NULL,
    "issue" TEXT NOT NULL,
    "contact" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ToolReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ToolReview_toolSlug_approved_createdAt_idx" ON "ToolReview"("toolSlug", "approved", "createdAt");

-- CreateIndex
CREATE INDEX "ToolReport_toolSlug_createdAt_idx" ON "ToolReport"("toolSlug", "createdAt");

-- CreateIndex
CREATE INDEX "ToolReport_resolved_createdAt_idx" ON "ToolReport"("resolved", "createdAt");

