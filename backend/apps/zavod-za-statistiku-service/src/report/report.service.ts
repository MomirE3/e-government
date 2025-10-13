import { Injectable, Inject } from '@nestjs/common';
import { ReportRepository } from './report.repository';
import { CreateDuiReportDto } from './dto/create-dui-report.dto';
import { CreateDocsReportDto } from './dto/create-docs-report.dto';
import { CreateSurveyReportDto } from './dto/create-survey-report.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportService {
  constructor(
    private repo: ReportRepository,
    @Inject('MUP-SERVICE') private readonly mupClient: ClientProxy,
    private prisma: PrismaService,
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

    // upis u DUIIndicator tabelu u Zavod bazi
    await this.repo.addDuiIndicators(report.id, duiData);

    // takođe čuva izveštaj u MUP bazi
    await firstValueFrom(
      this.mupClient.send('generateDuiReport', dto),
    );

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

    // upis u DocsIssuedIndicator tabelu u Zavod bazi
    await this.repo.addDocsIssuedIndicators(report.id, docsData);

    // takođe čuva izveštaj u MUP bazi
    await firstValueFrom(
      this.mupClient.send('generateDocsIssuedReport', dto),
    );

    return this.repo.findById(report.id);
  }

  async generateSurvey(dto: CreateSurveyReportDto) {
    const report = await this.repo.createReport(
      dto.title ?? `Survey report ${dto.surveyId}`,
      'SURVEY',
      dto,
      dto.surveyId,
    );

    // Dobija podatke o anketi
    const surveyData = await firstValueFrom(
      this.mupClient.send('getSurveyStatistics', { surveyId: dto.surveyId }),
    );

    console.log('📊 surveyData iz MUP-a:', surveyData);

    // Čuva anketa izveštaj u MUP bazi
    await firstValueFrom(
      this.mupClient.send('generateSurveyReport', dto),
    );

    return report;
  }

  getReport(id: number) {
    return this.repo.findById(id);
  }

  getAllReports() {
    return this.repo.findAll();
  }

  async getSurveyStatistics(surveyId: number) {
    // Dobij anketa podatke
    const survey = await this.prisma.survey.findUnique({
      where: { id: surveyId },
      include: {
        questions: true,
        participants: {
          include: {
            answers: true,
          },
        },
      },
    });

    if (!survey) {
      throw new Error(`Survey with ID ${surveyId} not found`);
    }

    const totalParticipants = survey.participants.length;
    const totalAnswers = survey.participants.reduce(
      (sum, participant) => sum + participant.answers.length,
      0,
    );
    const questionsCount = survey.questions.length;
    const completionRate = questionsCount > 0 ? Math.round((totalAnswers / (totalParticipants * questionsCount)) * 100) : 0;

    // Analiziraj odgovore po pitanjima
    const responsesByQuestion = survey.questions.map((question) => {
      const questionAnswers = survey.participants
        .flatMap((p) => p.answers)
        .filter((answer) => answer.questionId === question.id);

      const responseCount = questionAnswers.length;
      
      // Pronađi najčešći odgovor
      const answerCounts: { [key: string]: number } = {};
      questionAnswers.forEach((answer) => {
        answerCounts[answer.value] = (answerCounts[answer.value] || 0) + 1;
      });

      const mostCommonAnswer = Object.keys(answerCounts).reduce((a, b) =>
        answerCounts[a] > answerCounts[b] ? a : b,
        'Nema odgovora',
      );

      return {
        questionId: question.id,
        questionText: question.text,
        responseCount,
        mostCommonAnswer,
      };
    });

    return {
      surveyId,
      totalParticipants,
      totalAnswers,
      completionRate,
      questionsCount,
      responsesByQuestion,
    };
  }
}
