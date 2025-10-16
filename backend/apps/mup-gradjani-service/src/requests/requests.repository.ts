import { Injectable } from '@nestjs/common';
import type { CreateRequestDto } from './dto/create-request.dto';
import type { UpdateRequestDto } from './dto/update-request.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Request, RequestType, RequestStatus } from './entities/request.entity';
import { Prisma } from '@prisma/client';
import { Payment } from '../payment/entities/payment.entity';
import { Appointment } from '../appointment/entities/appointment.entity';
import { Document } from '../document/entities/document.entity';
import { FilterRequestDto } from './dto/filter-request.dto';

type PrismaRequestWithRelations = Prisma.RequestGetPayload<{
  include: { appointment: true; payment: true; document: true };
}>;

@Injectable()
export class RequestsRepository {
  constructor(private prisma: PrismaService) {}
  async create(createRequestDto: CreateRequestDto) {
    return await this.prisma.$transaction(async (prisma) => {
      const request = await prisma.request.create({
        data: {
          caseNumber: createRequestDto.caseNumber,
          type: createRequestDto.type,
          status: createRequestDto.status,
          submissionDate: createRequestDto.submissionDate,
          citizenId: createRequestDto.citizenId,
          ...(createRequestDto.appointment && {
            appointment: {
              create: createRequestDto.appointment,
            },
          }),
          ...(createRequestDto.payment && {
            payment: {
              create: createRequestDto.payment,
            },
          }),
          ...(createRequestDto.document && {
            document: {
              create: createRequestDto.document,
            },
          }),
        },
        include: { appointment: true, payment: true, document: true },
      });
      return this.toEntity(request);
    });
  }

  async findAllRequests(params: FilterRequestDto) {
    const { citizenId, requestStatus, requestType } = params;

    // Build where clause only with provided filters
    const whereClause: any = {};
    if (citizenId) {
      whereClause.citizenId = citizenId;
    }
    if (requestStatus) {
      whereClause.status = requestStatus;
    }
    if (requestType) {
      whereClause.type = requestType;
    }

    const requests = await this.prisma.request.findMany({
      where: whereClause,
      include: { appointment: true, payment: true, document: true },
      orderBy: { submissionDate: 'desc' },
    });
    return requests.map((request) => this.toEntity(request));
  }

  async findAll(citizenId?: string) {
    const whereClause = citizenId ? { citizenId } : {};
    const requests = await this.prisma.request.findMany({
      where: whereClause,
      include: { appointment: true, payment: true, document: true },
      orderBy: { submissionDate: 'desc' }, // Sort by newest first
    });
    return requests.map((request) => this.toEntity(request));
  }

  async findByCitizenId(citizenId: string) {
    const requests = await this.prisma.request.findMany({
      where: { citizenId },
      include: { appointment: true, payment: true, document: true },
      orderBy: { submissionDate: 'desc' }, // Sort by newest first
    });
    return requests.map((request) => this.toEntity(request));
  }

  async findOne(id: string) {
    const request = await this.prisma.request.findUnique({
      where: { id },
      include: { appointment: true, payment: true, document: true },
    });
    return request ? this.toEntity(request) : null;
  }

  async update(id: string, updateRequestDto: UpdateRequestDto) {
    const request = await this.prisma.request.update({
      where: { id },
      data: updateRequestDto,
      include: { appointment: true, payment: true, document: true },
    });
    return this.toEntity(request);
  }

  async remove(id: string) {
    const request = await this.prisma.request.delete({
      where: { id },
      include: { appointment: true, payment: true, document: true },
    });
    return this.toEntity(request);
  }

  async updateStatus(
    id: string,
    status: RequestStatus,
    adminMessage?: string,
    processedBy?: string,
  ) {
    const request = await this.prisma.request.update({
      where: { id },
      data: {
        status,
        adminMessage,
        processedBy,
        processedAt: new Date(),
      },
      include: { appointment: true, payment: true, document: true },
    });
    return this.toEntity(request);
  }

  private toEntity(request: PrismaRequestWithRelations): Request {
    return {
      id: request.id,
      caseNumber: request.caseNumber,
      type: request.type as RequestType,
      status: request.status as RequestStatus,
      submissionDate: request.submissionDate.toISOString(),
      citizenId: request.citizenId,
      adminMessage: request.adminMessage || undefined,
      processedAt: request.processedAt?.toISOString() || undefined,
      processedBy: request.processedBy || undefined,
      appointment: request.appointment as unknown as Appointment,
      payment: request.payment as unknown as Payment,
      document: request.document as unknown as Document,
    };
  }
}
