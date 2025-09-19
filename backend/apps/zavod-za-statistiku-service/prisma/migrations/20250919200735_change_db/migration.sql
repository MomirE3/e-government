/*
  Warnings:

  - You are about to drop the column `ageBand` on the `DUIIndicator` table. All the data in the column will be lost.
  - You are about to drop the column `bacBand` on the `DUIIndicator` table. All the data in the column will be lost.
  - Added the required column `type` to the `DUIIndicator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."DUIIndicator" DROP COLUMN "ageBand",
DROP COLUMN "bacBand",
ADD COLUMN     "type" TEXT NOT NULL;
