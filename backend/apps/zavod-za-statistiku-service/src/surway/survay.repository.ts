import { Injectable } from '@nestjs/common';
import { CreateSurwayDto } from './dto/create-surway.dto';
import { UpdateSurwayDto } from './dto/update-surway.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Survey } from './entities/surway.entity';

type PrismaSurveyWithRelations = Prisma.SurveyGetPayload<{
  include: { questions: true; sample: true; participants: true; reports: true };
}>;

@Injectable()
export class SurveyRepository {
  private toEntity(survey: PrismaSurveyWithRelations): Survey {
    return {
      id: survey.id,
      title: survey.title,
      description: survey.description ?? undefined,
      period: survey.period,
      status: survey.status,
      questions: survey.questions || [],
      sample: survey.sample || null,
      participants: survey.participants || [],
      reports: survey.reports || [],
    };
  }

  constructor(private prisma: PrismaService) {}

  async create(createSurveyDto: CreateSurwayDto): Promise<Survey> {
    const survey = await this.prisma.survey.create({
      data: createSurveyDto,
      include: {
        questions: true,
        sample: true,
        participants: true,
        reports: true,
      },
    });
    return this.toEntity(survey);
  }

  async findAll(): Promise<Survey[]> {
    const surveys = await this.prisma.survey.findMany({
      include: {
        questions: true,
        sample: true,
        participants: true,
        reports: true,
      },
    });
    return surveys.map((survey) => this.toEntity(survey));
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} surway`;
  // }

  async update(id: number, updateSurwayDto: UpdateSurwayDto): Promise<Survey> {
    const survey = await this.prisma.survey.update({
      where: { id },
      data: updateSurwayDto,
      include: {
        questions: true,
        sample: true,
        participants: true,
        reports: true,
      },
    });
    return this.toEntity(survey);
  }

  async updateStatus(id: number, status: string): Promise<Survey> {
    const survey = await this.prisma.survey.update({
      where: { id },
      data: { status },
      include: {
        questions: true,
        sample: true,
        participants: true,
        reports: true,
      },
    });
    return this.toEntity(survey);
  }

  async remove(id: number): Promise<void> {
    // Prisma will handle cascade deletion automatically due to onDelete: Cascade
    await this.prisma.survey.delete({
      where: { id },
    });
  }
}
