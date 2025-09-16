import {
  Controller,
  Get,
  Param,
  Delete,
  Body,
  Put,
  Post,
} from '@nestjs/common';
import { InfractionService } from './infraction.service';
import type { CreateInfractionDto } from './dto/create-infraction.dto';
import type { UpdateInfractionDto } from './dto/update-infraction.dto';

@Controller('infraction')
export class InfractionController {
  constructor(private readonly infractionService: InfractionService) {}

  @Post()
  create(@Body() createInfractionDto: CreateInfractionDto) {
    return this.infractionService.create(createInfractionDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateInfractionDto: UpdateInfractionDto,
  ) {
    return this.infractionService.update(id, updateInfractionDto);
  }

  @Get()
  findAll() {
    return this.infractionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.infractionService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.infractionService.remove(id);
  }
}
