-- AlterTable
ALTER TABLE "public"."requests" ADD COLUMN     "adminMessage" TEXT,
ADD COLUMN     "processedAt" TIMESTAMP(3),
ADD COLUMN     "processedBy" TEXT;
