import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Prisma } from '@prisma/client';
import { Payment } from '../payment/entities/payment.entity';
import { Document } from '../document/entities/document.entity';
import { Appointment } from './entities/appointment.entity';
import { RequestType } from '../requests/entities/request.entity';
import { RequestStatus } from '../requests/entities/request.entity';

type PrismaAppointmentWithRelations = Prisma.AppointmentGetPayload<{
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
export class AppointmentRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.prisma.appointment.create({
      data: {
        dateTime: new Date(createAppointmentDto.dateTime),
        location: createAppointmentDto.location,
        requestId: createAppointmentDto.requestId,
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
    return this.toEntity(appointment);
  }

  async findAll(): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
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
    return appointments.map((appointment) => this.toEntity(appointment));
  }

  async findOne(id: string): Promise<Appointment | null> {
    const appointment = await this.prisma.appointment.findUnique({
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
    return appointment ? this.toEntity(appointment) : null;
  }

  async findByRequestId(requestId: string): Promise<Appointment | null> {
    const appointment = await this.prisma.appointment.findUnique({
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
    return appointment ? this.toEntity(appointment) : null;
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const updateData: Prisma.AppointmentUpdateInput = {};

    if (updateAppointmentDto.dateTime) {
      updateData.dateTime = new Date(updateAppointmentDto.dateTime);
    }
    if (updateAppointmentDto.location) {
      updateData.location = updateAppointmentDto.location;
    }

    const appointment = await this.prisma.appointment.update({
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
    return this.toEntity(appointment);
  }

  async remove(id: string): Promise<Appointment> {
    const appointment = await this.prisma.appointment.delete({
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
    return this.toEntity(appointment);
  }

  async exists(id: string): Promise<boolean> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!appointment;
  }

  async existsByRequestId(requestId: string): Promise<boolean> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { requestId },
      select: { id: true },
    });
    return !!appointment;
  }

  private toEntity(appointment: PrismaAppointmentWithRelations): Appointment {
    return {
      id: appointment.id,
      dateTime: appointment.dateTime.toISOString(),
      location: appointment.location,
      requestId: appointment.requestId,
      request: appointment.request
        ? {
            id: appointment.request.id,
            caseNumber: appointment.request.caseNumber,
            type: appointment.request.type as RequestType,
            status: appointment.request.status as RequestStatus,
            submissionDate: appointment.request.submissionDate.toISOString(),
            citizenId: appointment.request.citizenId,
            appointment: appointment.request
              .appointment as unknown as Appointment,
            payment: appointment.request.payment as unknown as Payment,
            document: appointment.request.document as unknown as Document,
          }
        : undefined,
    };
  }
}
