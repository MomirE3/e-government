import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { Prisma } from '@prisma/client';

type PrismaPaymentWithRelations = Prisma.PaymentGetPayload<{
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
export class PaymentRepository {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = await this.prisma.payment.create({
      data: {
        amount: createPaymentDto.amount,
        currency: createPaymentDto.currency,
        referenceNumber: createPaymentDto.referenceNumber,
        status: createPaymentDto.status,
        requestId: createPaymentDto.requestId,
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
    return this.toEntity(payment);
  }

  async findAll(): Promise<Payment[]> {
    const payments = await this.prisma.payment.findMany({
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
    return payments.map((payment) => this.toEntity(payment));
  }

  async findOne(id: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({
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
    return payment ? this.toEntity(payment) : null;
  }

  async findByRequestId(requestId: string): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({
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
    return payment ? this.toEntity(payment) : null;
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const updateData: Prisma.PaymentUpdateInput = {};

    if (updatePaymentDto.amount !== undefined) {
      updateData.amount = updatePaymentDto.amount;
    }
    if (updatePaymentDto.currency) {
      updateData.currency = updatePaymentDto.currency;
    }
    if (updatePaymentDto.referenceNumber) {
      updateData.referenceNumber = updatePaymentDto.referenceNumber;
    }
    if (updatePaymentDto.status) {
      updateData.status = updatePaymentDto.status;
    }

    const payment = await this.prisma.payment.update({
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
    return this.toEntity(payment);
  }

  async remove(id: string): Promise<Payment> {
    const payment = await this.prisma.payment.delete({
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
    return this.toEntity(payment);
  }

  async exists(id: string): Promise<boolean> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!payment;
  }

  async existsByRequestId(requestId: string): Promise<boolean> {
    const payment = await this.prisma.payment.findUnique({
      where: { requestId },
      select: { id: true },
    });
    return !!payment;
  }

  private toEntity(payment: PrismaPaymentWithRelations): Payment {
    return {
      id: payment.id,
      amount: payment.amount.toNumber(),
      currency: payment.currency,
      referenceNumber: payment.referenceNumber,
      status: payment.status,
      timestamp: payment.timestamp.toISOString(),
      requestId: payment.requestId,
      request: payment.request
        ? {
            id: payment.request.id,
            caseNumber: payment.request.caseNumber,
            type: payment.request.type,
            status: payment.request.status,
            submissionDate: payment.request.submissionDate.toISOString(),
            citizenId: payment.request.citizenId,
            appointment: payment.request.appointment as unknown as any,
            payment: payment.request.payment as unknown as any,
            document: payment.request.document as unknown as any,
          }
        : undefined,
    };
  }
}
