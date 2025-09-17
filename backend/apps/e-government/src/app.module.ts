import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MupController } from './mup-gateway/mup-controller';
import { RpcExceptionFilter } from './filters/rpc-exception.filter';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MUP-SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'mup-service',
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [AppController, MupController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: RpcExceptionFilter,
    },
  ],
})
export class AppModule {}
