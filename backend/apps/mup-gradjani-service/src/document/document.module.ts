import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { DocumentRepository } from './document.repository';
import { MinioModule } from '../minio/minio.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [MinioModule, PrismaModule],
  controllers: [DocumentController],
  providers: [DocumentService, DocumentRepository],
  exports: [DocumentService],
})
export class DocumentModule {}
