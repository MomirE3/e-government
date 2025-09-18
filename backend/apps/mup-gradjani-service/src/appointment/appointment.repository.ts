import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { Prisma } from '@prisma/client';

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
        status: createAppointmentDto.status,
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
    if (updateAppointmentDto.status) {
      updateData.status = updateAppointmentDto.status;
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
      status: appointment.status,
      requestId: appointment.requestId,
      request: appointment.request
        ? {
            id: appointment.request.id,
            caseNumber: appointment.request.caseNumber,
            type: appointment.request.type,
            status: appointment.request.status,
            submissionDate: appointment.request.submissionDate.toISOString(),
            citizenId: appointment.request.citizenId,
            appointment: appointment.request
              .appointment as unknown as Appointment,
            payment: appointment.request.payment,
            document: appointment.request.document,
          }
        : undefined,
    };
  }
}
