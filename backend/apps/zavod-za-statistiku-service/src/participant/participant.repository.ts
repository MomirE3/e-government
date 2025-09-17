import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import {
  Participant,
  ParticipantStatus,
  Survey,
  Question,
} from './entity/participant.entity';

type PrismaParticipant = Prisma.ParticipantGetPayload<{
  include: {
    survey: {
      include: {
        questions: true;
      };
    };
  };
}>;

@Injectable()
export class ParticipantRepository {
  constructor(private prisma: PrismaService) {}

  private toEntity(prismaP: PrismaParticipant): Participant {
    const questions: Question[] =
      prismaP.survey?.questions?.map((q) => ({
        id: q.id,
        text: q.text,
        type: q.type,
        required: q.required,
        surveyId: q.surveyId,
      })) || [];

    const survey: Survey | undefined = prismaP.survey
      ? {
          id: prismaP.survey.id,
          title: prismaP.survey.title,
          description: prismaP.survey.description || undefined,
          period: prismaP.survey.period,
          status: prismaP.survey.status,
          questions,
        }
      : undefined;

    return {
      id: prismaP.id,
      contact: prismaP.contact,
      token: prismaP.token,
      status: prismaP.status as ParticipantStatus,
      surveyId: prismaP.surveyId,
      survey,
    };
  }

  async create(
    surveyId: number,
    dto: CreateParticipantDto,
  ): Promise<Participant> {
    const prismaP = await this.prisma.participant.create({
      data: {
        contact: dto.contact,
        token: randomUUID(), // generišeš unikatan token
        status: ParticipantStatus.PENDING,
        surveyId,
      },
    });
    return this.toEntity(prismaP as PrismaParticipant);
  }

  async findByToken(token: string): Promise<Participant | null> {
    const prismaP = await this.prisma.participant.findUnique({
      where: { token },
      include: {
        survey: {
          include: {
            questions: true,
          },
        },
      },
    });
    return prismaP ? this.toEntity(prismaP) : null;
  }

  async markCompleted(id: number): Promise<Participant> {
    const prismaP = await this.prisma.participant.update({
      where: { id },
      data: { status: ParticipantStatus.COMPLETED },
    });
    return this.toEntity(prismaP as PrismaParticipant);
  }
}
