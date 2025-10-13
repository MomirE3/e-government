import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ReportService } from './report.service';
import { CreateDuiReportDto } from './dto/create-dui-report.dto';
import { CreateDocsReportDto } from './dto/create-docs-report.dto';
import { CreateSurveyReportDto } from './dto/create-survey-report.dto';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @MessagePattern('generateDuiReport')
  generateDui(dto: CreateDuiReportDto) {
    return this.reportService.generateDui(dto);
  }

  @MessagePattern('generateDocsIssuedReport')
  generateDocs(dto: CreateDocsReportDto) {
    return this.reportService.generateDocs(dto);
  }

  @MessagePattern('generateSurveyReport')
  generateSurvey(dto: CreateSurveyReportDto) {
    return this.reportService.generateSurvey(dto);
  }

  @MessagePattern('getReportById')
  getReportById(data: { id: number }) {
    return this.reportService.getReport(+data.id);
  }

  @MessagePattern('getAllReports')
  getAllReports() {
    return this.reportService.getAllReports();
  }

  @MessagePattern('getSurveyStatistics')
  getSurveyStatistics(data: { surveyId: number }) {
    return this.reportService.getSurveyStatistics(data.surveyId);
  }
}
