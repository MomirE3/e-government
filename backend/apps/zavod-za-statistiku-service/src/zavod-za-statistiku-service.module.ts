import { Module } from '@nestjs/common';
import { ZavodZaStatistikuServiceController } from './zavod-za-statistiku-service.controller';
import { ZavodZaStatistikuServiceService } from './zavod-za-statistiku-service.service';
import { SurwayModule } from './surway/surway.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RpcErrorInterceptor } from './interceptors/rpc-error.interceptor';
import { ReportModule } from './report/report.module';

@Module({
  imports: [PrismaModule, SurwayModule, ReportModule],
  controllers: [ZavodZaStatistikuServiceController],
  providers: [
    ZavodZaStatistikuServiceService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RpcErrorInterceptor,
    },
  ],
})
export class ZavodZaStatistikuServiceModule {}
