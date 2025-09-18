import { Injectable } from '@nestjs/common';
import { ReportRepository } from './report.repository';
import { CreateDuiReportDto } from './dto/create-dui-report.dto';
import { CreateDocsReportDto } from './dto/create-docs-report.dto';
import { CreateSurveyReportDto } from './dto/create-survey-report.dto';

@Injectable()
export class ReportService {
  constructor(private repo: ReportRepository) {}

  async generateDui(dto: CreateDuiReportDto) {
    const report = await this.repo.createReport(
      `DUI report ${dto.year}`,
      'DUI',
      dto,
    );

    // MOCK podaci za sad
    await this.repo.addDuiIndicators(report.id, [
      {
        year: dto.year,
        municipality: 'Novi Sad',
        ageBand: '18-24',
        bacBand: '0.5-1.0',
        caseCount: 42,
      },
      {
        year: dto.year,
        municipality: 'Beograd',
        ageBand: '25-34',
        bacBand: '1.0+',
        caseCount: 33,
      },
    ]);

    return this.repo.findById(report.id);
  }

  async generateDocs(dto: CreateDocsReportDto) {
    const report = await this.repo.createReport(
      dto.title ?? `Docs report ${dto.periodFrom}-${dto.periodTo}`,
      'DOCS_ISSUED',
      dto,
    );

    await this.repo.addDocsIssuedIndicators(report.id, [
      {
        periodFrom: new Date(dto.periodFrom),
        periodTo: new Date(dto.periodTo),
        documentType: 'LICNA_KARTA',
        count: 1234,
      },
      {
        periodFrom: new Date(dto.periodFrom),
        periodTo: new Date(dto.periodTo),
        documentType: 'PASOS',
        count: 456,
      },
    ]);

    return this.repo.findById(report.id);
  }

  async generateSurvey(dto: CreateSurveyReportDto) {
    // Za sad samo napravi report koji referencira survey
    return this.repo.createReport(
      `Survey report ${dto.surveyId}`,
      'SURVEY',
      dto.config,
      dto.surveyId,
    );
  }

  getReport(id: number) {
    return this.repo.findById(id);
  }
}
