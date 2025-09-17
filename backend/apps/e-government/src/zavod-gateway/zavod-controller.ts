import { Controller, Post, Inject, Body, Param, Get } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import type { CreateSurwayDto } from 'apps/zavod-za-statistiku-service/src/surway/dto/create-surway.dto';
import type { CreateQuestionDto } from 'apps/zavod-za-statistiku-service/src/question/dto/create-question.dto';
import type { CreateSampleDto } from 'apps/zavod-za-statistiku-service/src/sample/dto/sample.dto';
import type { CreateParticipantDto } from 'apps/zavod-za-statistiku-service/src/participant/dto/create-participant.dto';
import type { SubmitAnswersDto } from 'apps/zavod-za-statistiku-service/src/answer/dto/submit-answers.dto';

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

  @Post('surway/:id/participant')
  createParticipant(
    @Param('id') id: string,
    @Body() dto: CreateParticipantDto,
  ) {
    return this.zavodService.send('createParticipant', { id, dto });
  }

  @Post('surway/:id/participant/:token/answers')
  submitAnswers(
    @Param('id') id: string,
    @Param('token') token: string,
    @Body() dto: SubmitAnswersDto,
  ) {
    return this.zavodService.send('submitAnswers', { id, token, dto });
  }

  @Get('surway/:id/participant/:token')
  findParticipantByToken(
    @Param('id') id: string,
    @Param('token') token: string,
  ) {
    return this.zavodService.send('findParticipantByToken', { id, token });
  }
}
