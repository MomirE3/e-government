import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Sample } from './entities/sample.entity';
import { Prisma } from '@prisma/client';
import { CreateSampleDto } from './dto/sample.dto';

type PrismaSample = Prisma.SampleGetPayload<{}>;

@Injectable()
export class SampleRepository {
  constructor(private prisma: PrismaService) {}

  private toEntity(prismaS: PrismaSample): Sample {
    return {
      id: prismaS.id,
      size: prismaS.size,
      criteria: prismaS.criteria,
      surveyId: prismaS.surveyId,
    };
  }

  async upsert(surveyId: number, dto: CreateSampleDto): Promise<Sample> {
    const prismaS: PrismaSample = await this.prisma.sample.upsert({
      where: { surveyId },
      update: { ...dto },
      create: { ...dto, surveyId },
    });
    return this.toEntity(prismaS);
  }

  async findBySurveyId(surveyId: number): Promise<Sample | null> {
    const prismaS = await this.prisma.sample.findUnique({
      where: { surveyId },
    });
    return prismaS ? this.toEntity(prismaS) : null;
  }
}
