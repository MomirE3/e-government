import { Module } from '@nestjs/common';
import { SurwayService } from './surway.service';
import { SurwayController } from './surway.controller';
import { SurveyRepository } from './survay.repository';

@Module({
  controllers: [SurwayController],
  providers: [SurwayService, SurveyRepository],
})
export class SurwayModule {}
