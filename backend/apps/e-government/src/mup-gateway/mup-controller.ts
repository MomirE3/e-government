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
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCitizenDto } from 'apps/mup-gradjani-service/src/citizen/dto/create-citizen.dto';
import { UpdateCitizenDto } from 'apps/mup-gradjani-service/src/citizen/dto/update-citizen.dto';
import type { CreateInfractionDto } from 'apps/mup-gradjani-service/src/infraction/dto/create-infraction.dto';
import type { UpdateInfractionDto } from 'apps/mup-gradjani-service/src/infraction/dto/update-infraction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../auth/enums/role.enum';
import type { AuthUser } from '../auth/interfaces/auth-user.interface';
import type { CreateRequestDto } from 'apps/mup-gradjani-service/src/requests/dto/create-request.dto';
import type { UpdateRequestDto } from 'apps/mup-gradjani-service/src/requests/dto/update-request.dto';

@Controller('mup')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MupController {
  constructor(
    @Inject('MUP-SERVICE') private readonly mupService: ClientProxy,
  ) {}

  // Citizens

  @Post('citizens')
  @Roles(Role.ADMIN)
  createCitizen(@Body() body: CreateCitizenDto) {
    return this.mupService.send('createCitizen', body);
  }

  @Get('citizens')
  @Roles(Role.ADMIN)
  findAllCitizens(@Query() query?: any) {
    return this.mupService.send('findAllCitizens', query);
  }

  @Get('citizens/jmbg/:jmbg')
  @Roles(Role.ADMIN, Role.CITIZEN)
  findCitizenByJmbg(
    @Param('jmbg') jmbg: string,
    @CurrentUser() user: AuthUser,
  ) {
    // Građani mogu da vide samo svoje podatke
    if (user.role === Role.CITIZEN && user.jmbg !== jmbg) {
      throw new ForbiddenException('Nemate dozvolu za pristup ovim podacima');
    }
    return this.mupService.send('findCitizenByJmbg', jmbg);
  }

  @Get('citizens/:id')
  @Roles(Role.ADMIN, Role.CITIZEN)
  findOneCitizen(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    // Građani mogu da vide samo svoje podatke
    if (user.role === Role.CITIZEN && user.id !== id) {
      throw new ForbiddenException('Nemate dozvolu za pristup ovim podacima');
    }
    return this.mupService.send('findOneCitizen', id);
  }

  // Citizens

  @Put('citizens/:id')
  @Roles(Role.ADMIN, Role.CITIZEN)
  updateCitizen(
    @Param('id') id: string,
    @Body() updateCitizenDto: UpdateCitizenDto,
    @CurrentUser() user: AuthUser,
  ) {
    // Građani mogu da ažuriraju samo svoje podatke
    if (user.role === Role.CITIZEN && user.id !== id) {
      throw new ForbiddenException(
        'Nemate dozvolu za ažuriranje ovih podataka',
      );
    }
    return this.mupService.send('updateCitizen', { id, updateCitizenDto });
  }

  @Delete('citizens/:id')
  @Roles(Role.ADMIN)
  removeCitizen(@Param('id') id: string) {
    return this.mupService.send('removeCitizen', id);
  }

  // Addresses

  @Get('address')
  @Roles(Role.ADMIN)
  findAllAddress() {
    return this.mupService.send('findAllAddress', {});
  }

  @Get('address/:id')
  @Roles(Role.ADMIN, Role.CITIZEN)
  findOneAddress(@Param('id') id: string) {
    return this.mupService.send('findOneAddress', id);
  }

  @Delete('address/:id')
  @Roles(Role.ADMIN)
  removeAddress(@Param('id') id: string) {
    return this.mupService.send('removeAddress', id);
  }

  @Get('address/citizen/:citizenId')
  @Roles(Role.ADMIN, Role.CITIZEN)
  findByCitizenId(
    @Param('citizenId') citizenId: string,
    @CurrentUser() user: AuthUser,
  ) {
    // Građani mogu da vide samo svoju adresu
    if (user.role === Role.CITIZEN && user.id !== citizenId) {
      throw new ForbiddenException('Nemate dozvolu za pristup ovim podacima');
    }
    return this.mupService.send('findByCitizenId', citizenId);
  }

  // Infractions

  @Post('infraction')
  @Roles(Role.ADMIN)
  createInfraction(@Body() body: CreateInfractionDto) {
    return this.mupService.send('createInfraction', body);
  }

  @Put('infraction/:id')
  @Roles(Role.ADMIN)
  updateInfraction(@Param('id') id: string, @Body() body: UpdateInfractionDto) {
    return this.mupService.send('updateInfraction', { id, body });
  }

  @Get('infraction')
  @Roles(Role.ADMIN)
  findAllInfraction() {
    return this.mupService.send('findAllInfraction', {});
  }

  @Get('infraction/:id')
  @Roles(Role.ADMIN, Role.CITIZEN)
  findOneInfraction(@Param('id') id: string) {
    return this.mupService.send('findOneInfraction', id);
  }

  @Delete('infraction/:id')
  @Roles(Role.ADMIN)
  removeInfraction(@Param('id') id: string) {
    return this.mupService.send('removeInfraction', id);
  }

  // Requests

  @Post('request')
  @Roles(Role.ADMIN)
  createRequest(@Body() body: CreateRequestDto) {
    return this.mupService.send('createRequest', body);
  }

  @Get('request')
  @Roles(Role.ADMIN)
  findAllRequest() {
    return this.mupService.send('findAllRequests', {});
  }

  @Get('request/:id')
  @Roles(Role.ADMIN, Role.CITIZEN)
  findOneRequest(@Param('id') id: string) {
    return this.mupService.send('findOneRequest', id);
  }

  @Put('request/:id')
  @Roles(Role.ADMIN)
  updateRequest(@Param('id') id: string, @Body() body: UpdateRequestDto) {
    return this.mupService.send('updateRequest', { id, body });
  }

  @Delete('request/:id')
  @Roles(Role.ADMIN)
  removeRequest(@Param('id') id: string) {
    return this.mupService.send('removeRequest', id);
  }
}
