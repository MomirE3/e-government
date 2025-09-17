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
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateCitizenDto } from 'apps/mup-gradjani-service/src/citizen/dto/create-citizen.dto';
import { UpdateCitizenDto } from 'apps/mup-gradjani-service/src/citizen/dto/update-citizen.dto';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Controller('mup')
export class MupController {
  constructor(
    @Inject('MUP-SERVICE') private readonly mupService: ClientProxy,
  ) {}

  @Post('citizens')
  async createCitizen(@Body() body: CreateCitizenDto) {
    return firstValueFrom(
      this.mupService.send('createCitizen', body).pipe(
        catchError((error) => {
          console.error('createCitizen failed:');
          console.error('Error type:', typeof error);
          console.error('Error object:', error);
          console.error('Error stringified:', JSON.stringify(error, null, 2));
          throw new RpcException(error);
        }),
      ),
    );
  }

  @Get('citizens')
  async findAllCitizens(@Query() query?: any) {
    return firstValueFrom(
      this.mupService.send('findAllCitizens', query).pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      ),
    );
  }

  @Get('citizens/jmbg/:jmbg')
  async findCitizenByJmbg(@Param('jmbg') jmbg: string) {
    return firstValueFrom(
      this.mupService.send('findCitizenByJmbg', jmbg).pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      ),
    );
  }

  @Get('citizens/:id')
  async findOneCitizen(@Param('id') id: string) {
    return firstValueFrom(
      this.mupService.send('findOneCitizen', id).pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      ),
    );
  }

  @Put('citizens/:id')
  async updateCitizen(
    @Param('id') id: string,
    @Body() updateCitizenDto: UpdateCitizenDto,
  ) {
    return firstValueFrom(
      this.mupService.send('updateCitizen', { id, updateCitizenDto }).pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      ),
    );
  }

  @Delete('citizens/:id')
  async removeCitizen(@Param('id') id: string) {
    return firstValueFrom(
      this.mupService.send('removeCitizen', id).pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      ),
    );
  }
}
