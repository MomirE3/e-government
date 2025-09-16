import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Address } from './entities/address.entity';
import { Address as PrismaAddress } from '@prisma/client';

@Injectable()
export class AddressRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Address[]> {
    const addresses = await this.prisma.address.findMany({
      include: {
        citizen: true,
      },
    });

    return addresses.map((address) => this.toEntity(address));
  }

  async findOne(id: string): Promise<Address | null> {
    const address = await this.prisma.address.findUnique({
      where: { id },
      include: {
        citizen: true,
      },
    });

    return address ? this.toEntity(address) : null;
  }

  async findByCitizenId(citizenId: string): Promise<Address | null> {
    const address = await this.prisma.address.findUnique({
      where: { citizenId },
      include: {
        citizen: true,
      },
    });

    return address ? this.toEntity(address) : null;
  }

  async remove(id: string): Promise<Address> {
    const address = await this.prisma.address.delete({
      where: { id },
      include: {
        citizen: true,
      },
    });

    return this.toEntity(address);
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.address.count({
      where: { id },
    });
    return count > 0;
  }

  async citizenHasAddress(citizenId: string): Promise<boolean> {
    const count = await this.prisma.address.count({
      where: { citizenId },
    });
    return count > 0;
  }

  private toEntity(address: PrismaAddress): Address {
    return {
      id: address.id,
      street: address.street,
      number: address.number,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      validFrom: address.validFrom,
    };
  }
}
