import { Injectable, NotFoundException } from '@nestjs/common';
import { AddressRepository } from './address.repository';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(private readonly addressRepository: AddressRepository) {}

  async findAll(): Promise<Address[]> {
    return this.addressRepository.findAll();
  }

  async findOne(id: string): Promise<Address> {
    const address = await this.addressRepository.findOne(id);
    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
    return address;
  }

  async findByCitizenId(citizenId: string): Promise<Address | null> {
    return this.addressRepository.findByCitizenId(citizenId);
  }

  async remove(id: string): Promise<Address> {
    const exists = await this.addressRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return this.addressRepository.remove(id);
  }
}
