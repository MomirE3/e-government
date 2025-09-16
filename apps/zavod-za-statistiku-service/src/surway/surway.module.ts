import { Module } from '@nestjs/common';
import { SurwayService } from './surway.service';
import { SurwayController } from './surway.controller';
import { SurveyRepository } from './survay.repository';
import { QuestionModule } from '../question/question.module';
import { SampleModule } from '../sample/sample.module';

@Module({
  imports: [QuestionModule, SampleModule],
  controllers: [SurwayController],
  providers: [SurwayService, SurveyRepository],
})
export class SurwayModule {}
