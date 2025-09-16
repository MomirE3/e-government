import { Injectable } from '@nestjs/common';
import { ParticipantRepository } from './participant.repository';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { MailService } from './mailService';
import { Participant } from './entity/participant.entity';

@Injectable()
export class ParticipantService {
  constructor(
    private repo: ParticipantRepository,
    private mail: MailService,
  ) {}

  async create(
    surveyId: number,
    dto: CreateParticipantDto,
  ): Promise<Participant> {
    const participant = await this.repo.create(surveyId, dto);

    await this.mail.sendSurveyInvitation(
      participant.contact,
      participant.token,
    );

    return participant;
  }

  findByToken(token: string): Promise<Participant | null> {
    return this.repo.findByToken(token);
  }

  markCompleted(id: number): Promise<Participant> {
    return this.repo.markCompleted(id);
  }
}
