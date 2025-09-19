import { Injectable, Inject } from '@nestjs/common';
import { ReportRepository } from './report.repository';
import { CreateDuiReportDto } from './dto/create-dui-report.dto';
import { CreateDocsReportDto } from './dto/create-docs-report.dto';
import { CreateSurveyReportDto } from './dto/create-survey-report.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ReportService {
  constructor(
    private repo: ReportRepository,
    @Inject('MUP-SERVICE') private readonly mupClient: ClientProxy,
  ) {}

  async generateDui(dto: CreateDuiReportDto) {
    const report = await this.repo.createReport(
      `DUI report ${dto.year}`,
      'DUI',
      dto,
    );

    // dobija podatke iz MUP-a
    const duiData = await firstValueFrom(
      this.mupClient.send('getDuiStatistics', { year: dto.year }),
    );

    // upis u DUIIndicator tabelu
    await this.repo.addDuiIndicators(report.id, duiData);
    return this.repo.findById(report.id);
  }

  async generateDocs(dto: CreateDocsReportDto) {
    const report = await this.repo.createReport(
      dto.title ?? `Docs report ${dto.periodFrom}-${dto.periodTo}`,
      'DOCS_ISSUED',
      dto,
    );

    const docsData = await firstValueFrom(
      this.mupClient.send('getDocsIssued', {
        periodFrom: dto.periodFrom,
        periodTo: dto.periodTo,
      }),
    );

    console.log('📊 docsData iz MUP-a:', docsData);

    if (!Array.isArray(docsData)) {
      throw new Error('getDocsIssued nije vratio niz!');
    }

    await this.repo.addDocsIssuedIndicators(report.id, docsData);
    return this.repo.findById(report.id);
  }

  async generateSurvey(dto: CreateSurveyReportDto) {
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
