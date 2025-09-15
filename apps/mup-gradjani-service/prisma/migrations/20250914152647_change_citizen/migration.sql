/*
  Warnings:

  - You are about to drop the `request_address` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[citizenId]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `citizenId` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."request_address" DROP CONSTRAINT "request_address_addressId_fkey";

-- DropForeignKey
ALTER TABLE "public"."request_address" DROP CONSTRAINT "request_address_requestId_fkey";

-- AlterTable
ALTER TABLE "public"."addresses" ADD COLUMN     "citizenId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."request_address";

-- CreateIndex
CREATE UNIQUE INDEX "addresses_citizenId_key" ON "public"."addresses"("citizenId");

-- AddForeignKey
ALTER TABLE "public"."addresses" ADD CONSTRAINT "addresses_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "public"."citizens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
