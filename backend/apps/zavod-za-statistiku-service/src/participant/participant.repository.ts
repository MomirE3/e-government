import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { Participant, ParticipantStatus } from './entity/participant.entity';

type PrismaParticipant = Prisma.ParticipantGetPayload<{}>;

@Injectable()
export class ParticipantRepository {
  constructor(private prisma: PrismaService) {}

  private toEntity(prismaP: PrismaParticipant): Participant {
    return {
      id: prismaP.id,
      contact: prismaP.contact,
      token: prismaP.token,
      status: prismaP.status as ParticipantStatus,
      surveyId: prismaP.surveyId,
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
    return this.toEntity(prismaP);
  }

  async findByToken(token: string): Promise<Participant | null> {
    const prismaP = await this.prisma.participant.findUnique({
      where: { token },
    });
    return prismaP ? this.toEntity(prismaP) : null;
  }

  async markCompleted(id: number): Promise<Participant> {
    const prismaP = await this.prisma.participant.update({
      where: { id },
      data: { status: ParticipantStatus.COMPLETED },
    });
    return this.toEntity(prismaP);
  }
}
