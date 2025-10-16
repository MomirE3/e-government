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
  UploadedFile,
  UseInterceptors,
  StreamableFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientProxy } from '@nestjs/microservices';
import type { Response } from 'express';
import { lastValueFrom } from 'rxjs';
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
import type { CreateAppointmentDto } from 'apps/mup-gradjani-service/src/appointment/dto/create-appointment.dto';
import type { UpdateAppointmentDto } from 'apps/mup-gradjani-service/src/appointment/dto/update-appointment.dto';
import type { CreatePaymentDto } from 'apps/mup-gradjani-service/src/payment/dto/create-payment.dto';
import type { UpdatePaymentDto } from 'apps/mup-gradjani-service/src/payment/dto/update-payment.dto';
import type { CreateDocumentDto } from 'apps/mup-gradjani-service/src/document/dto/create-document.dto';
import type { UpdateDocumentDto } from 'apps/mup-gradjani-service/src/document/dto/update-document.dto';
import type { FilterRequestDto } from 'apps/mup-gradjani-service/src/requests/dto/filter-request.dto';

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
  @Roles(Role.ADMIN, Role.CITIZEN)
  createRequest(@Body() body: CreateRequestDto) {
    return this.mupService.send('createRequest', body);
  }

  @Get('request')
  @Roles(Role.ADMIN, Role.CITIZEN)
  findAllRequest() {
    return this.mupService.send('findAllRequests', {});
  }

  @Get('request/filter')
  @Roles(Role.ADMIN, Role.CITIZEN)
  findAllRequests(@Query() query?: FilterRequestDto) {
    return this.mupService.send('findAllRequestsWithFilter', query);
  }

  @Get('request/citizen/:citizenId')
  @Roles(Role.ADMIN, Role.CITIZEN)
  findRequestsByCitizenId(@Param('citizenId') citizenId: string) {
    return this.mupService.send('findRequestsByCitizenId', citizenId);
  }

  @Get('request/:id')
  @Roles(Role.ADMIN, Role.CITIZEN)
  findOneRequest(@Param('id') id: string) {
    return this.mupService.send('findOneRequest', id);
  }

  @Put('request/:id')
  @Roles(Role.ADMIN, Role.CITIZEN)
  updateRequest(@Param('id') id: string, @Body() body: UpdateRequestDto) {
    return this.mupService.send('updateRequest', { id, body });
  }

  @Delete('request/:id')
  @Roles(Role.ADMIN, Role.CITIZEN)
  removeRequest(@Param('id') id: string) {
    return this.mupService.send('removeRequest', id);
  }

  // Appointments

  @Post('appointments')
  @Roles(Role.ADMIN)
  createAppointment(@Body() body: CreateAppointmentDto) {
    return this.mupService.send('createAppointment', body);
  }

  @Get('appointments')
  @Roles(Role.ADMIN)
  findAllAppointments() {
    return this.mupService.send('findAllAppointments', {});
  }

  @Get('appointments/:id')
  @Roles(Role.ADMIN, Role.CITIZEN)
  findOneAppointment(@Param('id') id: string) {
    return this.mupService.send('findOneAppointment', id);
  }

  @Get('appointments/request/:requestId')
  @Roles(Role.ADMIN, Role.CITIZEN)
  findAppointmentByRequestId(@Param('requestId') requestId: string) {
    return this.mupService.send('findAppointmentByRequestId', requestId);
  }

  @Put('appointments/:id')
  @Roles(Role.ADMIN)
  updateAppointment(
    @Param('id') id: string,
    @Body() body: UpdateAppointmentDto,
  ) {
    return this.mupService.send('updateAppointment', {
      id,
      updateAppointmentDto: body,
    });
  }

  @Delete('appointments/:id')
  @Roles(Role.ADMIN)
  removeAppointment(@Param('id') id: string) {
    return this.mupService.send('removeAppointment', id);
  }

  // Payments

  @Post('payments')
  @Roles(Role.ADMIN)
  createPayment(@Body() body: CreatePaymentDto) {
    return this.mupService.send('createPayment', body);
  }

  @Get('payments')
  @Roles(Role.ADMIN)
  findAllPayments() {
    return this.mupService.send('findAllPayments', {});
  }

  @Get('payments/:id')
  @Roles(Role.ADMIN, Role.CITIZEN)
  findOnePayment(@Param('id') id: string) {
    return this.mupService.send('findOnePayment', id);
  }

  @Get('payments/request/:requestId')
  @Roles(Role.ADMIN, Role.CITIZEN)
  findPaymentByRequestId(@Param('requestId') requestId: string) {
    return this.mupService.send('findPaymentByRequestId', requestId);
  }

  @Put('payments/:id')
  @Roles(Role.ADMIN)
  updatePayment(@Param('id') id: string, @Body() body: UpdatePaymentDto) {
    return this.mupService.send('updatePayment', {
      id,
      updatePaymentDto: body,
    });
  }

  @Delete('payments/:id')
  @Roles(Role.ADMIN)
  removePayment(@Param('id') id: string) {
    return this.mupService.send('removePayment', id);
  }

  // Documents

  @Post('documents')
  @Roles(Role.ADMIN)
  createDocument(@Body() body: CreateDocumentDto) {
    return this.mupService.send('createDocument', body);
  }

  @Get('documents')
  @Roles(Role.ADMIN)
  findAllDocuments() {
    return this.mupService.send('findAllDocuments', {});
  }

  @Get('documents/:id')
  @Roles(Role.ADMIN, Role.CITIZEN)
  findOneDocument(@Param('id') id: string) {
    return this.mupService.send('findOneDocument', id);
  }

  @Get('documents/request/:requestId')
  @Roles(Role.ADMIN, Role.CITIZEN)
  findDocumentByRequestId(@Param('requestId') requestId: string) {
    return this.mupService.send('findDocumentByRequestId', requestId);
  }

  @Put('documents/:id')
  @Roles(Role.ADMIN)
  updateDocument(@Param('id') id: string, @Body() body: UpdateDocumentDto) {
    return this.mupService.send('updateDocument', {
      id,
      updateDocumentDto: body,
    });
  }

  @Delete('documents/:id')
  @Roles(Role.ADMIN)
  removeDocument(@Param('id') id: string) {
    return this.mupService.send('removeDocument', id);
  }

  // Document Upload
  @Post('documents/upload')
  @Roles(Role.ADMIN, Role.CITIZEN)
  @UseInterceptors(FileInterceptor('file'))
  uploadDocument(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new ForbiddenException('No file uploaded');
    }

    return this.mupService.send('uploadDocument', {
      file: file.buffer,
      fileName: file.originalname,
      mimeType: file.mimetype,
    });
  }

  @Get('documents/stream/:fileUrl')
  @Roles(Role.ADMIN, Role.CITIZEN)
  async streamDocument(
    @Param('fileUrl') fileUrl: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const result = await lastValueFrom(
        this.mupService.send('getDocumentFile', fileUrl),
      );

      // Set appropriate headers
      res.set({
        'Content-Type': result.mimeType || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${result.fileName}"`,
        'Content-Length': result.buffer.length,
      });

      return new StreamableFile(Buffer.from(result.buffer));
    } catch {
      throw new ForbiddenException('Unable to retrieve document');
    }
  }

  @Delete('documents/file/:fileUrl')
  @Roles(Role.ADMIN, Role.CITIZEN)
  deleteDocumentFile(@Param('fileUrl') fileUrl: string) {
    return this.mupService.send('deleteDocument', fileUrl);
  }
}
