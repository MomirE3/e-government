import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CitizenService } from './citizen.service';
import { CitizenController } from './citizen.controller';
import { CitizenRepository } from './citizen.repository';
import { RpcErrorInterceptor } from '../interceptors/rpc-error.interceptor';

@Module({
  controllers: [CitizenController],
  providers: [
    CitizenService,
    CitizenRepository,
    {
      provide: APP_INTERCEPTOR,
      useClass: RpcErrorInterceptor,
    },
  ],
})
export class CitizenModule {}
