import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { RequestsRepository } from './requests.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RequestsController],
  providers: [RequestsService, RequestsRepository],
})
export class RequestsModule {}
