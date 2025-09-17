import {
  Controller,
  Post,
  Inject,
  Body,
  Param,
  Get,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import type { CreateSurwayDto } from 'apps/zavod-za-statistiku-service/src/surway/dto/create-surway.dto';
import type { CreateQuestionDto } from 'apps/zavod-za-statistiku-service/src/question/dto/create-question.dto';
import type { CreateSampleDto } from 'apps/zavod-za-statistiku-service/src/sample/dto/sample.dto';
import type { CreateParticipantDto } from 'apps/zavod-za-statistiku-service/src/participant/dto/create-participant.dto';
import { SubmitAnswersDto } from 'apps/zavod-za-statistiku-service/src/answer/dto/submit-answers.dto';

@Controller('zavod')
export class ZavodController {
  constructor(
    @Inject('ZAVOD-SERVICE') private readonly zavodService: ClientProxy,
  ) {}

  @Post('surway')
  createSurway(@Body() dto: CreateSurwayDto) {
    return this.zavodService.send('createSurway', dto);
  }

  @Post('surway/:id/questions')
  createQuestion(@Param('id') id: string, @Body() dto: CreateQuestionDto) {
    return this.zavodService.send('createQuestion', { id, dto });
  }

  @Post('surway/:id/sample')
  createSample(@Param('id') id: string, @Body() dto: CreateSampleDto) {
    return this.zavodService.send('createSample', { id, dto });
  }

  @Get('surway/:id/sample')
  getSample(@Param('id') id: string) {
    return this.zavodService.send('getSample', { id });
  }

  @Post('surway/:id/participants')
  createParticipant(
    @Param('id') id: string,
    @Body() dto: CreateParticipantDto,
  ) {
    return this.zavodService.send('createParticipant', { id, dto });
  }

  @Post('surway/:id/participants/:token/answers')
  submitAnswers(
    @Param('id') id: string,
    @Param('token') token: string,
    @Body() dto: SubmitAnswersDto,
  ) {
    return this.zavodService.send('submitAnswers', { id, token, dto });
  }

  @Get('surway/:id/participants/:token')
  findParticipantByToken(
    @Param('id') id: string,
    @Param('token') token: string,
  ) {
    return this.zavodService.send('findParticipantByToken', { id, token });
  }

  @Get('surway/fill/:token')
  serveSurveyForm(@Param('token') token: string, @Res() res: Response) {
    const htmlPath =
      '/app/apps/zavod-za-statistiku-service/public/survey/index.html';
    res.sendFile(htmlPath);
  }

  @Get('surway/participants/:token')
  getParticipantByToken(@Param('token') token: string) {
    return this.zavodService.send('findParticipantByToken', { id: '0', token });
  }

  @Post('surway/participants/:token/answers')
  submitAnswersByToken(
    @Param('token') token: string,
    @Body() dto: SubmitAnswersDto,
  ) {
    return this.zavodService.send('submitAnswers', { id: '0', token, dto });
  }
}
