/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Answer } from './entities/answer.entity';

@Injectable()
export class AnswerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(
    participantId: number,
    answers: { value: string; questionId: number }[],
  ): Promise<void> {
    await this.prisma.answer.createMany({
      data: answers.map((a) => ({
        value: a.value,
        questionId: a.questionId,
        participantId,
      })),
    });
  }

  async findByParticipant(participantId: number): Promise<Answer[]> {
    return this.prisma.answer.findMany({
      where: { participantId },
    });
  }
}
