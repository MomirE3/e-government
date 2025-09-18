-- DropForeignKey
ALTER TABLE "public"."Report" DROP CONSTRAINT "Report_surveyId_fkey";

-- AlterTable
ALTER TABLE "public"."Report" ALTER COLUMN "surveyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Report" ADD CONSTRAINT "Report_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "public"."Survey"("id") ON DELETE SET NULL ON UPDATE CASCADE;
