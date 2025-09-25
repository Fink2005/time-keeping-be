-- AlterTable
ALTER TABLE "public"."Attendance" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Location" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Attendance_deletedAt_idx" ON "public"."Attendance"("deletedAt");

-- CreateIndex
CREATE INDEX "Location_deletedAt_idx" ON "public"."Location"("deletedAt");
