import { Controller, Param } from '@nestjs/common';
import { AddressService } from './address.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @MessagePattern('findAllAddress')
  findAll() {
    return this.addressService.findAll();
  }

  @MessagePattern('findByCitizenId')
  findByCitizenId(@Param('citizenId') citizenId: string) {
    return this.addressService.findByCitizenId(citizenId);
  }

  @MessagePattern('findOneAddress')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @MessagePattern('removeAddress')
  remove(@Param('id') id: string) {
    return this.addressService.remove(id);
  }
}
