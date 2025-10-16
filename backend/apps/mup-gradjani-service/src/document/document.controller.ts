import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DocumentService } from './document.service';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @MessagePattern('uploadDocument')
  async uploadDocument(
    @Payload() data: { file: Buffer; fileName: string; mimeType: string },
  ) {
    return this.documentService.uploadDocument(
      data.file,
      data.fileName,
      data.mimeType,
    );
  }

  @MessagePattern('getDocumentUrl')
  async getDocumentUrl(@Payload() fileUrl: string) {
    return this.documentService.getDocumentUrl(fileUrl);
  }

  @MessagePattern('getDocumentFile')
  async getDocumentFile(@Payload() fileUrl: string) {
    return this.documentService.getDocumentFile(fileUrl);
  }

  @MessagePattern('deleteDocument')
  async deleteDocument(@Payload() fileUrl: string) {
    return this.documentService.deleteDocument(fileUrl);
  }

  @MessagePattern('getDocsIssued')
  async getDocsIssued(
    @Payload() data: { periodFrom: string; periodTo: string },
  ) {
    return this.documentService.getDocsIssued(data);
  }
}
