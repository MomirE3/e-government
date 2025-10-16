import { Module } from '@nestjs/common';
import { MupGradjaniServiceController } from './mup-gradjani-service.controller';
import { MupGradjaniServiceService } from './mup-gradjani-service.service';
import { PrismaModule } from './prisma/prisma.module';
import { CitizenModule } from './citizen/citizen.module';
import { AddressModule } from './address/address.module';
import { InfractionModule } from './infraction/infraction.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RpcErrorInterceptor } from './interceptors/rpc-error.interceptor';
import { RequestsModule } from './requests/requests.module';
import { AppointmentModule } from './appointment/appointment.module';
import { PaymentModule } from './payment/payment.module';
import { DocumentModule } from './document/document.module';
import { ReportModule } from './report/report.module';
import { MinioModule } from './minio/minio.module';

@Module({
  imports: [
    PrismaModule,
    CitizenModule,
    AddressModule,
    InfractionModule,
    RequestsModule,
    AppointmentModule,
    PaymentModule,
    DocumentModule,
    ReportModule,
    MinioModule,
  ],
  controllers: [MupGradjaniServiceController],
  providers: [
    MupGradjaniServiceService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RpcErrorInterceptor,
    },
  ],
})
export class MupGradjaniServiceModule {}
