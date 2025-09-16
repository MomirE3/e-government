import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { SurwayService } from './surway.service';
import type { CreateSurwayDto } from './dto/create-surway.dto';
import type { CreateQuestionDto } from '../question/dto/create-question.dto';
import { QuestionService } from '../question/question.service';
import { SampleService } from '../sample/sample.service';
import type { CreateSampleDto } from '../sample/dto/sample.dto';

@Controller('surway')
export class SurwayController {
  constructor(
    private readonly surwayService: SurwayService,
    private readonly questionService: QuestionService,
    private readonly sampleService: SampleService,
  ) {}

  @Post()
  create(@Body() dto: CreateSurwayDto) {
    return this.surwayService.create(dto);
  }

  @Post(':id/questions')
  createQuestion(@Param('id') id: string, @Body() dto: CreateQuestionDto) {
    return this.questionService.create(+id, dto);
  }

  @Get(':id/questions')
  getQuestions(@Param('id') id: string) {
    return this.questionService.findAllBySurveyId(+id);
  }

  @Post(':id/sample')
  createSample(@Param('id') id: string, @Body() dto: CreateSampleDto) {
    return this.sampleService.upsert(+id, dto);
  }

  @Get(':id/sample')
  getSample(@Param('id') id: string) {
    return this.sampleService.findBySurveyId(+id);
  }
}
