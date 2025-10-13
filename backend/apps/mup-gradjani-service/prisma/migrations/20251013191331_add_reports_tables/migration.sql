-- CreateTable
CREATE TABLE "public"."reports" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "configJSON" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."dui_indicators" (
    "id" SERIAL NOT NULL,
    "reportId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "municipality" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "caseCount" INTEGER NOT NULL,

    CONSTRAINT "dui_indicators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."docs_issued_indicators" (
    "id" SERIAL NOT NULL,
    "reportId" TEXT NOT NULL,
    "periodFrom" TIMESTAMP(3) NOT NULL,
    "periodTo" TIMESTAMP(3) NOT NULL,
    "documentType" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "docs_issued_indicators_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."dui_indicators" ADD CONSTRAINT "dui_indicators_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "public"."reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."docs_issued_indicators" ADD CONSTRAINT "docs_issued_indicators_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "public"."reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
