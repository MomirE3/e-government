import { Controller } from '@nestjs/common';
import { SurwayService } from './surway.service';
import type { CreateSurwayDto } from './dto/create-surway.dto';
import type { UpdateSurwayDto } from './dto/update-surway.dto';
import type { CreateQuestionDto } from '../question/dto/create-question.dto';
import { QuestionService } from '../question/question.service';
import { SampleService } from '../sample/sample.service';
import type { CreateSampleDto } from '../sample/dto/sample.dto';
import { ParticipantService } from '../participant/participant.service';
import type { CreateParticipantDto } from '../participant/dto/create-participant.dto';
import { AnswerService } from '../answer/answer.service';
import { SubmitAnswersDto } from '../answer/dto/submit-answers.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('surway')
export class SurwayController {
  constructor(
    private readonly surwayService: SurwayService,
    private readonly questionService: QuestionService,
    private readonly sampleService: SampleService,
    private readonly participantService: ParticipantService,
    private readonly answerService: AnswerService,
  ) {}

  @MessagePattern('getSurway')
  getSurway() {
    return this.surwayService.findAll();
  }

  @MessagePattern('createSurway')
  create(dto: CreateSurwayDto) {
    return this.surwayService.create(dto);
  }

  @MessagePattern('updateSurway')
  update(data: { id: string; dto: UpdateSurwayDto }) {
    return this.surwayService.update(+data.id, data.dto);
  }

  @MessagePattern('updateSurwayStatus')
  updateStatus(data: { id: string; status: string }) {
    return this.surwayService.updateStatus(+data.id, data.status);
  }

  @MessagePattern('createQuestion')
  createQuestion(data: { id: string; dto: CreateQuestionDto }) {
    return this.questionService.create(+data.id, data.dto);
  }

  @MessagePattern('getQuestions')
  getQuestions(data: { id: string }) {
    return this.questionService.findAllBySurveyId(+data.id);
  }

  @MessagePattern('updateQuestion')
  updateQuestion(data: { id: string; dto: CreateQuestionDto }) {
    return this.questionService.update(+data.id, data.dto);
  }

  @MessagePattern('deleteQuestion')
  deleteQuestion(data: { id: string }) {
    return this.questionService.delete(+data.id);
  }

  @MessagePattern('createSample')
  createSample(data: { id: string; dto: CreateSampleDto }) {
    return this.sampleService.upsert(+data.id, data.dto);
  }

  @MessagePattern('getSample')
  getSample(data: { id: string }) {
    return this.sampleService.findBySurveyId(+data.id);
  }

  @MessagePattern('createParticipant')
  createParticipant(data: { id: string; dto: CreateParticipantDto }) {
    return this.participantService.create(+data.id, data.dto);
  }

  @MessagePattern('findParticipantByToken')
  findParticipantByToken(data: { id: string; token: string }) {
    return this.participantService.findByToken(data.token);
  }

  @MessagePattern('markParticipantCompleted')
  markParticipantCompleted(data: { id: string }) {
    return this.participantService.markCompleted(+data.id);
  }

  @MessagePattern('submitAnswers')
  submitAnswers(data: { id: string; token: string; dto: SubmitAnswersDto }) {
    return this.answerService.submitAnswers(data.token, data.dto);
  }

  @MessagePattern('getSurveyAnswers')
  getSurveyAnswers(data: { id: string }) {
    return this.answerService.getSurveyAnswers(+data.id);
  }

  @MessagePattern('removeSurway')
  remove(data: { id: string }) {
    return this.surwayService.remove(+data.id);
  }
}
