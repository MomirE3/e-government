import { Module } from '@nestjs/common';
import { MupGradjaniServiceController } from './mup-gradjani-service.controller';
import { MupGradjaniServiceService } from './mup-gradjani-service.service';
import { PrismaModule } from './prisma/prisma.module';
import { CitizenModule } from './citizen/citizen.module';

@Module({
  imports: [PrismaModule, CitizenModule],
  controllers: [MupGradjaniServiceController],
  providers: [MupGradjaniServiceService],
})
export class MupGradjaniServiceModule {}
