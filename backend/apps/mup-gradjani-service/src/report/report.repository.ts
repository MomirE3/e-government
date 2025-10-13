import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportRepository {
  constructor(private prisma: PrismaService) {}

  async createReport(
    title: string,
    type: string,
    config: unknown,
  ) {
    return this.prisma.report.create({
      data: {
        title,
        type,
        configJSON: JSON.stringify(config),
      },
    });
  }

  async addDuiIndicators(reportId: string, rows: any[]) {
    await this.prisma.dUIIndicator.createMany({
      data: rows.map((r) => ({
        reportId,
        year: r.year,
        municipality: r.municipality,
        type: r.type,
        caseCount: r.caseCount,
      })),
    });
  }

  async addDocsIssuedIndicators(reportId: string, rows: any[]) {
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

  async findById(id: string) {
    return this.prisma.report.findUnique({
      where: { id },
      include: {
        duiIndicators: true,
        docsIssued: true,
      },
    });
  }

  async findAll() {
    return this.prisma.report.findMany({
      include: {
        duiIndicators: true,
        docsIssued: true,
      },
      orderBy: {
        generatedAt: 'desc',
      },
    });
  }
}
