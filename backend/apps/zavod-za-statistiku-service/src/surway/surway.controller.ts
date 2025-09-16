import { Controller, Post, Body, Param, Get, Patch } from '@nestjs/common';
import { SurwayService } from './surway.service';
import type { CreateSurwayDto } from './dto/create-surway.dto';
import type { CreateQuestionDto } from '../question/dto/create-question.dto';
import { QuestionService } from '../question/question.service';
import { SampleService } from '../sample/sample.service';
import type { CreateSampleDto } from '../sample/dto/sample.dto';
import { ParticipantService } from '../participant/participant.service';
import type { CreateParticipantDto } from '../participant/dto/create-participant.dto';

@Controller('surway')
export class SurwayController {
  constructor(
    private readonly surwayService: SurwayService,
    private readonly questionService: QuestionService,
    private readonly sampleService: SampleService,
    private readonly participantService: ParticipantService,
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

  @Post(':id/participants')
  createParticipant(
    @Param('id') id: string,
    @Body() dto: CreateParticipantDto,
  ) {
    return this.participantService.create(+id, dto);
  }

  @Get('participants/:token')
  findParticipantByToken(@Param('token') token: string) {
    return this.participantService.findByToken(token);
  }

  @Patch('participants/:id/complete')
  markParticipantCompleted(@Param('id') id: string) {
    return this.participantService.markCompleted(+id);
  }
}
