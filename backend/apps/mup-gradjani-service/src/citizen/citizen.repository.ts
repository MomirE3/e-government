import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCitizenDto } from './dto/create-citizen.dto';
import { UpdateCitizenDto } from './dto/update-citizen.dto';
import { Citizen } from './entities/citizen.entity';
import { Prisma } from '@prisma/client';
import { Appointment } from '../appointment/entities/appointment.entity';

type PrismaCitizenWithRelations = Prisma.CitizenGetPayload<{
  include: {
    address: true;
    requests: {
      include: {
        appointment: true;
        payment: true;
        document: true;
      };
    };
    infractions: true;
  };
}>;

@Injectable()
export class CitizenRepository {
  constructor(private prisma: PrismaService) {}

  async create(createCitizenDto: CreateCitizenDto): Promise<Citizen> {
    const { address, ...citizenData } = createCitizenDto;

    const citizen = await this.prisma.citizen.create({
      data: {
        ...citizenData,
        address: {
          create: address,
        },
      },
      include: {
        address: true,
        requests: {
          include: {
            appointment: true,
            payment: true,
            document: true,
          },
        },
        infractions: true,
      },
    });
    return this.toEntity(citizen);
  }

  async findAll(): Promise<Citizen[]> {
    const citizens = await this.prisma.citizen.findMany({
      include: {
        address: true,
        requests: {
          include: {
            appointment: true,
            payment: true,
            document: true,
          },
        },
        infractions: true,
      },
    });
    return citizens.map((citizen) => this.toEntity(citizen));
  }

  async findOne(id: string): Promise<Citizen | null> {
    const citizen = await this.prisma.citizen.findUnique({
      where: { id },
      include: {
        address: true,
        requests: {
          include: {
            appointment: true,
            payment: true,
            document: true,
          },
        },
        infractions: true,
      },
    });
    return citizen ? this.toEntity(citizen) : null;
  }

  async findByJmbg(jmbg: string): Promise<Citizen | null> {
    const citizen = await this.prisma.citizen.findUnique({
      where: { jmbg },
      include: {
        address: true,
        requests: {
          include: {
            appointment: true,
            payment: true,
            document: true,
          },
        },
        infractions: true,
      },
    });
    return citizen ? this.toEntity(citizen) : null;
  }

  async update(
    id: string,
    updateCitizenDto: UpdateCitizenDto,
  ): Promise<Citizen> {
    const { address, ...citizenData } = updateCitizenDto;

    const updateData: Prisma.CitizenUpdateInput = { ...citizenData };

    if (address) {
      updateData.address = {
        upsert: {
          update: address,
          create: address,
        },
      };
    }

    const citizen = await this.prisma.citizen.update({
      where: { id },
      data: updateData,
      include: {
        address: true,
        requests: {
          include: {
            appointment: true,
            payment: true,
            document: true,
          },
        },
        infractions: true,
      },
    });
    return this.toEntity(citizen);
  }

  async remove(id: string): Promise<Citizen> {
    const citizen = await this.prisma.citizen.delete({
      where: { id },
      include: {
        address: true,
        requests: {
          include: {
            appointment: true,
            payment: true,
            document: true,
          },
        },
        infractions: true,
      },
    });
    return this.toEntity(citizen);
  }

  async exists(id: string): Promise<boolean> {
    const citizen = await this.prisma.citizen.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!citizen;
  }

  async jmbgExists(jmbg: string): Promise<boolean> {
    const citizen = await this.prisma.citizen.findUnique({
      where: { jmbg },
      select: { jmbg: true },
    });
    return !!citizen;
  }

  private toEntity(citizen: PrismaCitizenWithRelations): Citizen {
    return {
      id: citizen.id,
      jmbg: citizen.jmbg,
      firstName: citizen.firstName,
      lastName: citizen.lastName,
      email: citizen.email,
      phone: citizen.phone,
      password: citizen.password || undefined,
      role: citizen.role,
      requests:
        citizen.requests?.map((request) => ({
          id: request.id,
          caseNumber: request.caseNumber,
          type: request.type,
          status: request.status,
          submissionDate: request.submissionDate.toISOString(),
          citizenId: request.citizenId,
          appointment: request.appointment as unknown as Appointment,
          payment: request.payment || null,
          document: request.document || null,
        })) || [],
      infractions:
        citizen.infractions?.map((infraction) => ({
          id: infraction.id,
          dateTime: infraction.dateTime,
          municipality: infraction.municipality,
          description: infraction.description,
          penaltyPoints: infraction.penaltyPoints,
          fine: infraction.fine.toNumber(),
          type: infraction.type,
        })) || [],
      address: citizen.address || null,
    };
  }

  async findByEmail(email: string): Promise<Citizen | null> {
    const citizen = await this.prisma.citizen.findUnique({
      where: { email },
      include: {
        address: true,
        requests: {
          include: {
            appointment: true,
            payment: true,
            document: true,
          },
        },
        infractions: true,
      },
    });

    if (!citizen) {
      return null;
    }

    return this.toEntity(citizen);
  }

  async createWithAuth(
    citizenData: CreateCitizenDto & { password: string; role: string },
  ): Promise<Citizen> {
    const newCitizen = await this.prisma.citizen.create({
      data: {
        jmbg: citizenData.jmbg,
        firstName: citizenData.firstName,
        lastName: citizenData.lastName,
        email: citizenData.email,
        phone: citizenData.phone,
        password: citizenData.password,
        role: citizenData.role as any,
        address: citizenData.address
          ? {
              create: {
                street: citizenData.address.street,
                number: citizenData.address.number,
                city: citizenData.address.city,
                postalCode: citizenData.address.postalCode,
                country: citizenData.address.country,
                validFrom: citizenData.address.validFrom,
              },
            }
          : undefined,
      },
      include: {
        address: true,
        requests: {
          include: {
            appointment: true,
            payment: true,
            document: true,
          },
        },
        infractions: true,
      },
    });

    return this.toEntity(newCitizen);
  }
}
