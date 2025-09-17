import { Controller, Param, Body } from '@nestjs/common';
import { InfractionService } from './infraction.service';
import type { CreateInfractionDto } from './dto/create-infraction.dto';
import type { UpdateInfractionDto } from './dto/update-infraction.dto';
import { MessagePattern } from '@nestjs/microservices';
@Controller('infraction')
export class InfractionController {
  constructor(private readonly infractionService: InfractionService) {}

  @MessagePattern('createInfraction')
  create(@Body() createInfractionDto: CreateInfractionDto) {
    return this.infractionService.create(createInfractionDto);
  }

  @MessagePattern('updateInfraction')
  update(
    @Param('id') id: string,
    @Body() updateInfractionDto: UpdateInfractionDto,
  ) {
    return this.infractionService.update(id, updateInfractionDto);
  }

  @MessagePattern('findAllInfraction')
  findAll() {
    return this.infractionService.findAll();
  }

  @MessagePattern('findOneInfraction')
  findOne(@Param('id') id: string) {
    return this.infractionService.findOne(id);
  }

  @MessagePattern('removeInfraction')
  remove(@Param('id') id: string) {
    return this.infractionService.remove(id);
  }
}
