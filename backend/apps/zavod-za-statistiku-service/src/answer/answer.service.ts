import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnswerRepository } from './answer.repository';
import { SubmitAnswersDto } from './dto/submit-answers.dto';

@Injectable()
export class AnswerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly answerRepository: AnswerRepository,
  ) {}

  async submitAnswers(token: string, dto: SubmitAnswersDto) {
    const participant = await this.prisma.participant.findUnique({
      where: { token },
    });

    if (!participant) throw new NotFoundException('Participant not found');
    if (participant.status === 'answered')
      throw new ConflictException('Survey already filled');

    await this.answerRepository.createMany(
      participant.id,
      dto.answers.map((a) => ({
        value: a.value,
        questionId: a.questionId,
      })),
    );

    await this.prisma.participant.update({
      where: { id: participant.id },
      data: { status: 'answered' },
    });

    return { message: 'Survey submitted successfully' };
  }

  async getSurveyAnswers(surveyId: number) {
    return this.prisma.answer.findMany({
      where: {
        question: {
          surveyId: surveyId,
        },
      },
      include: {
        question: true,
        participant: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
