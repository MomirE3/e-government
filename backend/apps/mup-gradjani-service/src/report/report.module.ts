import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { ReportRepository } from './report.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { InfractionModule } from '../infraction/infraction.module';
import { DocumentModule } from '../document/document.module';

@Module({
  imports: [PrismaModule, InfractionModule, DocumentModule],
  controllers: [ReportController],
  providers: [ReportService, ReportRepository],
  exports: [ReportService],
})
export class ReportModule {}
