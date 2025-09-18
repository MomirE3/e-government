import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MupController } from './mup-gateway/mup-controller';
import { RpcExceptionFilter } from './filters/rpc-exception.filter';
import { ZavodController } from './zavod-gateway/zavod-controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: 'MUP-SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'mup-service',
          port: 3001,
        },
      },
      {
        name: 'ZAVOD-SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'zavod-service',
          port: 3002,
        },
      },
    ]),
  ],
  controllers: [AppController, MupController, ZavodController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: RpcExceptionFilter,
    },
  ],
})
export class AppModule {}
