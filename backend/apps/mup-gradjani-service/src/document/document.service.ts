import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentRepository } from './document.repository';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentService {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
    // Провери да ли за захтев већ постоји документ
    const existingDocument = await this.documentRepository.existsByRequestId(
      createDocumentDto.requestId,
    );
    if (existingDocument) {
      throw new ConflictException('Document for this request already exists');
    }

    return this.documentRepository.create(createDocumentDto);
  }

  async findAll(): Promise<Document[]> {
    return this.documentRepository.findAll();
  }

  async findOne(id: string): Promise<Document> {
    const document = await this.documentRepository.findOne(id);
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return document;
  }

  async findByRequestId(requestId: string): Promise<Document> {
    const document = await this.documentRepository.findByRequestId(requestId);
    if (!document) {
      throw new NotFoundException(
        `Document for request ${requestId} not found`,
      );
    }
    return document;
  }

  async update(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document> {
    // Провери да ли документ постоји
    const exists = await this.documentRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return this.documentRepository.update(id, updateDocumentDto);
  }

  async remove(id: string): Promise<Document> {
    const exists = await this.documentRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return this.documentRepository.remove(id);
  }

  async getDocsIssued(dto: { periodFrom: string; periodTo: string }) {
    return this.documentRepository.countByTypeAndPeriod(
      new Date(dto.periodFrom),
      new Date(dto.periodTo),
    );
  }
}
