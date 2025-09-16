import { Module } from '@nestjs/common';
import { InfractionService } from './infraction.service';
import { InfractionController } from './infraction.controller';
import { InfractionRepository } from './infraction.repository';

@Module({
  controllers: [InfractionController],
  providers: [InfractionService, InfractionRepository],
})
export class InfractionModule {}
