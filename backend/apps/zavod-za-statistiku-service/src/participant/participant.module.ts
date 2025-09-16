import { Module } from '@nestjs/common';
import { ParticipantRepository } from './participant.repository';
import { ParticipantService } from './participant.service';
import { MailService } from './mailService';

@Module({
  providers: [ParticipantService, ParticipantRepository, MailService],
  exports: [ParticipantService],
})
export class ParticipantModule {}
