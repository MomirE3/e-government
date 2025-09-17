import { Module } from '@nestjs/common';
import { CitizenService } from './citizen.service';
import { CitizenController } from './citizen.controller';
import { CitizenRepository } from './citizen.repository';

@Module({
  controllers: [CitizenController],
  providers: [CitizenService, CitizenRepository],
})
export class CitizenModule {}
