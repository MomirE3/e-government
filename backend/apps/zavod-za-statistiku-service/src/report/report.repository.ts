/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportRepository {
  constructor(private prisma: PrismaService) {}

  async createReport(
    title: string,
    type: string,
    config: unknown,
    surveyId?: number,
  ) {
    return this.prisma.report.create({
      data: {
        title,
        type,
        configJSON: JSON.stringify(config),
        surveyId: surveyId ?? (undefined as any),
      },
    });
  }

  async addDuiIndicators(reportId: number, rows: any[]) {
    await this.prisma.dUIIndicator.createMany({
      data: rows.map((r) => ({
        reportId,
        year: r.year,
        municipality: r.municipality,
        type: r.type, // ✅ koristi tip prekršaja
        caseCount: r.caseCount,
      })),
    });
  }

  async addDocsIssuedIndicators(reportId: number, rows: any[]) {
    console.log('📝 rows za insert:', rows);

    if (!Array.isArray(rows) || rows.length === 0) {
      return;
    }

    await this.prisma.docsIssuedIndicator.createMany({
      data: rows.map((r) => ({
        reportId,
        periodFrom: new Date(r.periodFrom),
        periodTo: new Date(r.periodTo),
        documentType: r.documentType,
        count: r.count,
      })),
    });
  }

  async findById(id: number) {
    return this.prisma.report.findUnique({
      where: { id },
      include: {
        duiIndicators: true,
        docsIssued: true,
      },
    });
  }
}
