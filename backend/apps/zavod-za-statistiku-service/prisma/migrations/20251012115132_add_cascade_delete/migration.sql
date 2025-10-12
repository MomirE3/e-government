-- DropForeignKey
ALTER TABLE "public"."Answer" DROP CONSTRAINT "Answer_participantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Answer" DROP CONSTRAINT "Answer_questionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Participant" DROP CONSTRAINT "Participant_surveyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Question" DROP CONSTRAINT "Question_surveyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Sample" DROP CONSTRAINT "Sample_surveyId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "public"."Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sample" ADD CONSTRAINT "Sample_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "public"."Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Participant" ADD CONSTRAINT "Participant_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "public"."Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Answer" ADD CONSTRAINT "Answer_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "public"."Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
