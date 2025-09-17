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
import { firstValueFrom } from 'rxjs';

@Controller('mup')
export class MupController {
  constructor(
    @Inject('MUP-SERVICE') private readonly mupService: ClientProxy,
  ) {}

  @Post('citizens')
  async createCitizen(@Body() body: CreateCitizenDto) {
    try {
      return await firstValueFrom(this.mupService.send('createCitizen', body));
    } catch (err: any) {
      console.error('createCitizen failed:', err); // videćeš npr. ECONNREFUSED
      throw err; // ili new BadGatewayException(err?.message ?? 'Upstream error');
    }
  }

  @Get('citizens')
  async findAllCitizens(@Query() query?: any) {
    return firstValueFrom(this.mupService.send('findAllCitizens', query));
  }

  @Get('citizens/jmbg/:jmbg')
  async findCitizenByJmbg(@Param('jmbg') jmbg: string) {
    return firstValueFrom(this.mupService.send('findCitizenByJmbg', jmbg));
  }

  @Get('citizens/:id')
  async findOneCitizen(@Param('id') id: string) {
    return firstValueFrom(this.mupService.send('findOneCitizen', id));
  }

  @Put('citizens/:id')
  async updateCitizen(
    @Param('id') id: string,
    @Body() updateCitizenDto: UpdateCitizenDto,
  ) {
    return firstValueFrom(
      this.mupService.send('updateCitizen', { id, updateCitizenDto }),
    );
  }

  @Delete('citizens/:id')
  async removeCitizen(@Param('id') id: string) {
    return firstValueFrom(this.mupService.send('removeCitizen', id));
  }
}
