/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Infraction } from './entities/infraction.entity';
import {
  Infraction as PrismaInfraction,
  InfractionType as PrismaInfractionType,
} from '@prisma/client';
import type { CreateInfractionDto } from './dto/create-infraction.dto';
import type { UpdateInfractionDto } from './dto/update-infraction.dto';

@Injectable()
export class InfractionRepository {
  constructor(private prisma: PrismaService) {}

  async create(createInfractionDto: CreateInfractionDto): Promise<Infraction> {
    const infraction = await this.prisma.infraction.create({
      data: {
        ...createInfractionDto,
        type: createInfractionDto.type as PrismaInfractionType,
        dateTime: new Date(createInfractionDto.dateTime),
      },
    });
    return this.toEntity(infraction);
  }

  async update(
    id: string,
    updateInfractionDto: UpdateInfractionDto,
  ): Promise<Infraction> {
    const { ...updateData } = updateInfractionDto;
    const infraction = await this.prisma.infraction.update({
      where: { id },
      data: {
        ...updateData,
        type: updateData.type as PrismaInfractionType,
        dateTime: new Date(updateData.dateTime),
      },
    });
    return this.toEntity(infraction);
  }

  async findAll(): Promise<Infraction[]> {
    const infractions = await this.prisma.infraction.findMany();
    return infractions.map((infraction) => this.toEntity(infraction));
  }

  async findOne(id: string): Promise<Infraction | null> {
    const infraction = await this.prisma.infraction.findUnique({
      where: { id },
    });
    return infraction ? this.toEntity(infraction) : null;
  }

  async findByCitizenId(citizenId: string): Promise<Infraction[]> {
    const infractions = await this.prisma.infraction.findMany({
      where: { citizenId },
    });
    return infractions.map((infraction) => this.toEntity(infraction));
  }

  async remove(id: string): Promise<Infraction> {
    const infraction = await this.prisma.infraction.delete({
      where: { id },
    });
    return this.toEntity(infraction);
  }

  async exists(id: string): Promise<boolean> {
    const infraction = await this.prisma.infraction.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!infraction;
  }

  private toEntity(infraction: PrismaInfraction): Infraction {
    return {
      id: infraction.id,
      dateTime: infraction.dateTime,
      municipality: infraction.municipality,
      description: infraction.description,
      penaltyPoints: infraction.penaltyPoints,
      fine: infraction.fine.toNumber(),
      type: infraction.type,
    };
  }

  async findByYearAndType(year: number, type: PrismaInfractionType) {
    return this.prisma.infraction.findMany({
      where: {
        type,
        dateTime: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${year + 1}-01-01`),
        },
      },
    });
  }
}
