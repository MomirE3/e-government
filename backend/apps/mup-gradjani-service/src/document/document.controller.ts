import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DocumentService } from './document.service';
import type { CreateDocumentDto } from './dto/create-document.dto';
import type { UpdateDocumentDto } from './dto/update-document.dto';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @MessagePattern('createDocument')
  async create(@Payload() dto: CreateDocumentDto) {
    return this.documentService.create(dto);
  }

  @MessagePattern('findAllDocuments')
  findAll() {
    return this.documentService.findAll();
  }

  @MessagePattern('findOneDocument')
  async findOne(@Payload() id: string) {
    return this.documentService.findOne(id);
  }

  @MessagePattern('findDocumentByRequestId')
  async findByRequestId(@Payload() requestId: string) {
    return this.documentService.findByRequestId(requestId);
  }

  @MessagePattern('updateDocument')
  async update(
    @Payload() data: { id: string; updateDocumentDto: UpdateDocumentDto },
  ) {
    return this.documentService.update(data.id, data.updateDocumentDto);
  }

  @MessagePattern('removeDocument')
  async remove(@Payload() id: string) {
    return this.documentService.remove(id);
  }

  @MessagePattern('getDocsIssued')
  getDocsIssued(dto: { periodFrom: string; periodTo: string }) {
    return this.documentService.getDocsIssued(dto);
  }
}
