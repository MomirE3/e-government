import { Controller, Get, Param, Delete } from '@nestjs/common';
import { AddressService } from './address.service';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  @Get('citizen/:citizenId')
  findByCitizenId(@Param('citizenId') citizenId: string) {
    return this.addressService.findByCitizenId(citizenId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(id);
  }
}
