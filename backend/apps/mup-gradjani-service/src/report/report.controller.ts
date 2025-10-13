import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @MessagePattern('generateDuiReport')
  generateDui(@Payload() dto: { year: number }) {
    return this.reportService.generateDui(dto);
  }

  @MessagePattern('generateDocsIssuedReport')
  generateDocs(@Payload() dto: { periodFrom: string; periodTo: string; title?: string }) {
    return this.reportService.generateDocs(dto);
  }

  @MessagePattern('getReportById')
  getReportById(@Payload() data: { id: string }) {
    return this.reportService.getReport(data.id);
  }

  @MessagePattern('getAllReports')
  getAllReports() {
    return this.reportService.getAllReports();
  }

  @MessagePattern('generateSurveyReport')
  generateSurveyReport(@Payload() dto: { surveyId: number; title?: string }) {
    return this.reportService.generateSurveyReport(dto);
  }

  @MessagePattern('getSurveyStatistics')
  getSurveyStatistics(@Payload() dto: { surveyId: number }) {
    return this.reportService.getSurveyStatistics(dto);
  }
}
