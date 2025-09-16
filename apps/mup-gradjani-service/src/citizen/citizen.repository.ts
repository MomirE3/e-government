import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCitizenDto } from './dto/create-citizen.dto';
import { UpdateCitizenDto } from './dto/update-citizen.dto';
import { Citizen } from './entities/citizen.entity';
import { Prisma } from '@prisma/client';

type PrismaCitizenWithRelations = Prisma.CitizenGetPayload<{
  include: { address: true; requests: true; infractions: true };
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
        requests: true,
        infractions: true,
      },
    });

    return this.toEntity(citizen);
  }

  async findAll(): Promise<Citizen[]> {
    const citizens = await this.prisma.citizen.findMany({
      include: {
        address: true,
        requests: true,
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
        requests: true,
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
        requests: true,
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
        requests: true,
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
        requests: true,
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
      requests: citizen.requests || [],
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
}
