import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Question } from './entities/question.entity';
import { Prisma } from '@prisma/client';

type PrismaQuestion = Prisma.QuestionGetPayload<{}>;

@Injectable()
export class QuestionRepository {
  constructor(private prisma: PrismaService) {}

  private toEntity(prismaQ: PrismaQuestion): Question {
    return {
      id: prismaQ.id,
      text: prismaQ.text,
      type: prismaQ.type,
      required: prismaQ.required,
      surveyId: prismaQ.surveyId,
    };
  }

  async create(surveyId: number, dto: CreateQuestionDto): Promise<Question> {
    console.log('dto', dto);
    console.log('surveyId', surveyId);
    const prismaQ = await this.prisma.question.create({
      data: {
        ...dto,
        surveyId,
      },
    });
    return this.toEntity(prismaQ);
  }

  async findAllBySurveyId(surveyId: number): Promise<Question[]> {
    const prismaQ = await this.prisma.question.findMany({
      where: { surveyId },
    });
    return prismaQ.map((q) => this.toEntity(q));
  }
}
