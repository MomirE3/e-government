import { Module } from '@nestjs/common';
import { ZavodZaStatistikuServiceController } from './zavod-za-statistiku-service.controller';
import { ZavodZaStatistikuServiceService } from './zavod-za-statistiku-service.service';
import { SurwayModule } from './surway/surway.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, SurwayModule],
  controllers: [ZavodZaStatistikuServiceController],
  providers: [ZavodZaStatistikuServiceService],
})
export class ZavodZaStatistikuServiceModule {}
