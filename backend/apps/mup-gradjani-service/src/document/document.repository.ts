import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Prisma } from '@prisma/client';
import { Appointment } from '../appointment/entities/appointment.entity';
import { Payment } from '../payment/entities/payment.entity';
import { Document } from './entities/document.entity';

type PrismaDocumentWithRelations = Prisma.DocumentGetPayload<{
  include: {
    request: {
      include: {
        citizen: true;
        appointment: true;
        payment: true;
        document: true;
      };
    };
  };
}>;

@Injectable()
export class DocumentRepository {
  constructor(private prisma: PrismaService) {}

  async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
    const document = await this.prisma.document.create({
      data: {
        name: createDocumentDto.name,
        type: createDocumentDto.type,
        issuedDate: new Date(createDocumentDto.issuedDate),
        requestId: createDocumentDto.requestId,
      },
      include: {
        request: {
          include: {
            citizen: true,
            appointment: true,
            payment: true,
            document: true,
          },
        },
      },
    });
    return this.toEntity(document);
  }

  async findAll(): Promise<Document[]> {
    const documents = await this.prisma.document.findMany({
      include: {
        request: {
          include: {
            citizen: true,
            appointment: true,
            payment: true,
            document: true,
          },
        },
      },
    });
    return documents.map((document) => this.toEntity(document));
  }

  async findOne(id: string): Promise<Document | null> {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        request: {
          include: {
            citizen: true,
            appointment: true,
            payment: true,
            document: true,
          },
        },
      },
    });
    return document ? this.toEntity(document) : null;
  }

  async findByRequestId(requestId: string): Promise<Document | null> {
    const document = await this.prisma.document.findUnique({
      where: { requestId },
      include: {
        request: {
          include: {
            citizen: true,
            appointment: true,
            payment: true,
            document: true,
          },
        },
      },
    });
    return document ? this.toEntity(document) : null;
  }

  async update(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document> {
    const updateData: Prisma.DocumentUpdateInput = {};

    if (updateDocumentDto.name) {
      updateData.name = updateDocumentDto.name;
    }
    if (updateDocumentDto.type) {
      updateData.type = updateDocumentDto.type;
    }
    if (updateDocumentDto.issuedDate) {
      updateData.issuedDate = new Date(updateDocumentDto.issuedDate);
    }

    const document = await this.prisma.document.update({
      where: { id },
      data: updateData,
      include: {
        request: {
          include: {
            citizen: true,
            appointment: true,
            payment: true,
            document: true,
          },
        },
      },
    });
    return this.toEntity(document);
  }

  async remove(id: string): Promise<Document> {
    const document = await this.prisma.document.delete({
      where: { id },
      include: {
        request: {
          include: {
            citizen: true,
            appointment: true,
            payment: true,
            document: true,
          },
        },
      },
    });
    return this.toEntity(document);
  }

  async exists(id: string): Promise<boolean> {
    const document = await this.prisma.document.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!document;
  }

  async existsByRequestId(requestId: string): Promise<boolean> {
    const document = await this.prisma.document.findUnique({
      where: { requestId },
      select: { id: true },
    });
    return !!document;
  }

  private toEntity(document: PrismaDocumentWithRelations): Document {
    return {
      id: document.id,
      name: document.name,
      type: document.type,
      issuedDate: document.issuedDate.toISOString(),
      requestId: document.requestId,
      request: document.request
        ? {
            id: document.request.id,
            caseNumber: document.request.caseNumber,
            type: document.request.type,
            status: document.request.status,
            submissionDate: document.request.submissionDate.toISOString(),
            citizenId: document.request.citizenId,
            appointment: document.request.appointment as unknown as Appointment,
            payment: document.request.payment as unknown as Payment,
            document: document.request.document as unknown as Document,
          }
        : undefined,
    };
  }
}
