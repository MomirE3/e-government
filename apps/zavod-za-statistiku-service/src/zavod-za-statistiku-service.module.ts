import { Module } from '@nestjs/common';
import { ZavodZaStatistikuServiceController } from './zavod-za-statistiku-service.controller';
import { ZavodZaStatistikuServiceService } from './zavod-za-statistiku-service.service';

@Module({
  imports: [],
  controllers: [ZavodZaStatistikuServiceController],
  providers: [ZavodZaStatistikuServiceService],
})
export class ZavodZaStatistikuServiceModule {}
