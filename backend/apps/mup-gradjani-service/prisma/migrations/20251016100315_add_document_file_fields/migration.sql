-- AlterTable
ALTER TABLE "public"."documents" ADD COLUMN     "fileName" TEXT,
ADD COLUMN     "fileSize" INTEGER,
ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "mimeType" TEXT;
