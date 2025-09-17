import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AnswerService } from './answer.service';
import { AnswerRepository } from './answer.repository';

@Module({
  imports: [PrismaModule],
  providers: [AnswerService, AnswerRepository],
  exports: [AnswerService],
})
export class AnswerModule {}
