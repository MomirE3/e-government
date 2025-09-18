import { Injectable } from '@nestjs/common';
import type { CreateRequestDto } from './dto/create-request.dto';
import type { UpdateRequestDto } from './dto/update-request.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from './entities/request.entity';
import { Prisma } from '@prisma/client';
import { Payment } from '../payment/entities/payment.entity';
import { Appointment } from '../appointment/entities/appointment.entity';

type PrismaRequestWithRelations = Prisma.RequestGetPayload<{
  include: { appointment: true; payment: true; document: true };
}>;

@Injectable()
export class RequestsRepository {
  constructor(private prisma: PrismaService) {}
  async create(createRequestDto: CreateRequestDto) {
    const request = await this.prisma.request.create({
      data: createRequestDto,
      include: { appointment: true, payment: true, document: true },
    });
    return this.toEntity(request);
  }

  async findAll() {
    const requests = await this.prisma.request.findMany({
      include: { appointment: true, payment: true, document: true },
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

  private toEntity(request: PrismaRequestWithRelations): Request {
    return {
      id: request.id,
      caseNumber: request.caseNumber,
      type: request.type,
      status: request.status,
      submissionDate: request.submissionDate.toISOString(),
      citizenId: request.citizenId,
      appointment: request.appointment as unknown as Appointment,
      payment: request.payment as unknown as Payment,
      document: request.document as any,
    };
  }
}
