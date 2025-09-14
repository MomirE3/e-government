/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."RequestType" AS ENUM ('ID_CARD', 'PASSPORT', 'CITIZENSHIP', 'DRIVING_LICENSE');

-- CreateEnum
CREATE TYPE "public"."RequestStatus" AS ENUM ('CREATED', 'IN_PROCESS', 'REJECTED', 'APPROVED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."InfractionType" AS ENUM ('DRUNK_DRIVING', 'SPEEDING', 'RED_LIGHT_VIOLATION', 'NO_SEATBELT');

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."citizens" (
    "id" TEXT NOT NULL,
    "jmbg" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "citizens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."addresses" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."requests" (
    "id" TEXT NOT NULL,
    "caseNumber" TEXT NOT NULL,
    "type" "public"."RequestType" NOT NULL,
    "status" "public"."RequestStatus" NOT NULL,
    "submissionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "citizenId" TEXT NOT NULL,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."infractions" (
    "id" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "municipality" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "penaltyPoints" INTEGER NOT NULL,
    "fine" DECIMAL(10,2) NOT NULL,
    "type" "public"."InfractionType" NOT NULL,
    "citizenId" TEXT NOT NULL,

    CONSTRAINT "infractions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."appointments" (
    "id" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payments" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requestId" TEXT NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."documents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "issuedDate" TIMESTAMP(3) NOT NULL,
    "requestId" TEXT NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."request_address" (
    "requestId" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,

    CONSTRAINT "request_address_pkey" PRIMARY KEY ("requestId","addressId")
);

-- CreateIndex
CREATE UNIQUE INDEX "citizens_jmbg_key" ON "public"."citizens"("jmbg");

-- CreateIndex
CREATE UNIQUE INDEX "requests_caseNumber_key" ON "public"."requests"("caseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "appointments_requestId_key" ON "public"."appointments"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_requestId_key" ON "public"."payments"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "documents_requestId_key" ON "public"."documents"("requestId");

-- AddForeignKey
ALTER TABLE "public"."requests" ADD CONSTRAINT "requests_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "public"."citizens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."infractions" ADD CONSTRAINT "infractions_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "public"."citizens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."appointments" ADD CONSTRAINT "appointments_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "public"."requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "public"."requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "public"."requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."request_address" ADD CONSTRAINT "request_address_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "public"."requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."request_address" ADD CONSTRAINT "request_address_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
