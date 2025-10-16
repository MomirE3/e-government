import { Injectable } from '@nestjs/common';
import { ReportRepository } from './report.repository';
import { InfractionService } from '../infraction/infraction.service';
import { DocumentService } from '../document/document.service';

@Injectable()
export class ReportService {
  constructor(
    private repo: ReportRepository,
    private infractionService: InfractionService,
    private documentService: DocumentService,
  ) {}

  async generateDui(dto: { year: number }) {
    const report = await this.repo.createReport(
      `DUI report ${dto.year}`,
      'DUI',
      dto,
    );

    // dobija podatke iz MUP-a
    const duiData = await this.infractionService.getDuiStatistics(dto.year);

    // upis u DUIIndicator tabelu
    await this.repo.addDuiIndicators(report.id.toString(), duiData);
    return this.repo.findById(report.id.toString());
  }

  async generateDocs(dto: {
    periodFrom: string;
    periodTo: string;
    title?: string;
  }) {
    const report = await this.repo.createReport(
      dto.title ?? `Docs report ${dto.periodFrom}-${dto.periodTo}`,
      'DOCS_ISSUED',
      dto,
    );

    const docsData = await this.documentService.getDocsIssued({
      periodFrom: dto.periodFrom,
      periodTo: dto.periodTo,
    });

    console.log('📊 docsData iz MUP-a:', docsData);

    if (!Array.isArray(docsData)) {
      throw new Error('getDocsIssued nije vratio niz!');
    }

    await this.repo.addDocsIssuedIndicators(report.id.toString(), docsData);
    return this.repo.findById(report.id.toString());
  }

  getReport(id: string) {
    return this.repo.findById(id);
  }

  getAllReports() {
    return this.repo.findAll();
  }

  async generateSurveyReport(dto: { surveyId: number; title?: string }) {
    const report = await this.repo.createReport(
      dto.title ?? `Survey report ${dto.surveyId}`,
      'SURVEY',
      dto,
    );

    // TODO: Dodati anketa statistike kada budu implementirane
    console.log('📊 Survey report created in MUP:', report.id);

    return report;
  }

  getSurveyStatistics(dto: { surveyId: number }) {
    // TODO: Implementirati kada budu anketa podaci u MUP bazi
    return Promise.resolve({
      surveyId: dto.surveyId,
      totalParticipants: 0,
      totalAnswers: 0,
      completionRate: 0,
    });
  }
}
