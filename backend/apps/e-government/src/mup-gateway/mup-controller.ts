import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Inject,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCitizenDto } from 'apps/mup-gradjani-service/src/citizen/dto/create-citizen.dto';
import { UpdateCitizenDto } from 'apps/mup-gradjani-service/src/citizen/dto/update-citizen.dto';
import type { CreateInfractionDto } from 'apps/mup-gradjani-service/src/infraction/dto/create-infraction.dto';
import type { UpdateInfractionDto } from 'apps/mup-gradjani-service/src/infraction/dto/update-infraction.dto';

@Controller('mup')
export class MupController {
  constructor(
    @Inject('MUP-SERVICE') private readonly mupService: ClientProxy,
  ) {}

  @Post('citizens')
  createCitizen(@Body() body: CreateCitizenDto) {
    return this.mupService.send('createCitizen', body);
  }

  @Get('citizens')
  findAllCitizens(@Query() query?: any) {
    return this.mupService.send('findAllCitizens', query);
  }

  @Get('citizens/jmbg/:jmbg')
  findCitizenByJmbg(@Param('jmbg') jmbg: string) {
    return this.mupService.send('findCitizenByJmbg', jmbg);
  }

  @Get('citizens/:id')
  findOneCitizen(@Param('id') id: string) {
    return this.mupService.send('findOneCitizen', id);
  }

  @Put('citizens/:id')
  updateCitizen(
    @Param('id') id: string,
    @Body() updateCitizenDto: UpdateCitizenDto,
  ) {
    return this.mupService.send('updateCitizen', { id, updateCitizenDto });
  }

  @Delete('citizens/:id')
  removeCitizen(@Param('id') id: string) {
    return this.mupService.send('removeCitizen', id);
  }

  @Get('address')
  findAllAddress() {
    return this.mupService.send('findAllAddress', {});
  }

  @Get('address/:id')
  findOneAddress(@Param('id') id: string) {
    return this.mupService.send('findOneAddress', id);
  }

  @Delete('address/:id')
  removeAddress(@Param('id') id: string) {
    return this.mupService.send('removeAddress', id);
  }

  @Get('address/citizen/:citizenId')
  findByCitizenId(@Param('citizenId') citizenId: string) {
    return this.mupService.send('findByCitizenId', citizenId);
  }

  @Post('infraction')
  createInfraction(@Body() body: CreateInfractionDto) {
    return this.mupService.send('createInfraction', body);
  }

  @Put('infraction/:id')
  updateInfraction(@Param('id') id: string, @Body() body: UpdateInfractionDto) {
    return this.mupService.send('updateInfraction', { id, body });
  }

  @Get('infraction')
  findAllInfraction() {
    return this.mupService.send('findAllInfraction', {});
  }

  @Get('infraction/:id')
  findOneInfraction(@Param('id') id: string) {
    return this.mupService.send('findOneInfraction', id);
  }

  @Delete('infraction/:id')
  removeInfraction(@Param('id') id: string) {
    return this.mupService.send('removeInfraction', id);
  }
}
