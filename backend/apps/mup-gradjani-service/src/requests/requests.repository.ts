import { Injectable } from '@nestjs/common';
import type { CreateRequestDto } from './dto/create-request.dto';
import type { UpdateRequestDto } from './dto/update-request.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from './entities/request.entity';
import { Prisma } from '@prisma/client';

type PrismaRequestWithRelations = Prisma.RequestGetPayload<{
  include: { appointment: true; payment: true; document: true };
}>;

@Injectable()
export class RequestsRepository {
  constructor(private prisma: PrismaService) {}
  create(createRequestDto: CreateRequestDto) {
    return this.prisma.request.create({
      data: createRequestDto,
    });
  }

  findAll() {
    return this.prisma.request.findMany();
  }

  findOne(id: string) {
    return this.prisma.request.findUnique({
      where: { id },
    });
  }

  update(id: string, updateRequestDto: UpdateRequestDto) {
    return this.prisma.request.update({
      where: { id },
      data: updateRequestDto,
    });
  }

  remove(id: string) {
    return this.prisma.request.delete({
      where: { id },
    });
  }

  private toEntity(request: PrismaRequestWithRelations): Request {
    return {
      id: request.id,
      caseNumber: request.caseNumber,
      type: request.type,
      status: request.status,
      submissionDate: request.submissionDate.toISOString(),
      citizenId: request.citizenId,
      appointment: request.appointment as any,
      payment: request.payment as any,
      document: request.document as any,
    };
  }
}
