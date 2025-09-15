/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { CreateSurwayDto } from './dto/create-surway.dto';
// import { UpdateSurwayDto } from './dto/update-surway.dto';
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

  // findAll() {
  //   return `This action returns all surway`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} surway`;
  // }

  // update(id: number, updateSurwayDto: UpdateSurwayDto) {
  //   return `This action updates a #${id} surway`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} surway`;
  // }
}
