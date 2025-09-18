import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @MessagePattern('createAppointment')
  async create(@Payload() dto: CreateAppointmentDto) {
    return this.appointmentService.create(dto);
  }

  @MessagePattern('findAllAppointments')
  findAll() {
    return this.appointmentService.findAll();
  }

  @MessagePattern('findOneAppointment')
  async findOne(@Payload() id: string) {
    return this.appointmentService.findOne(id);
  }

  @MessagePattern('findAppointmentByRequestId')
  async findByRequestId(@Payload() requestId: string) {
    return this.appointmentService.findByRequestId(requestId);
  }

  @MessagePattern('updateAppointment')
  async update(
    @Payload() data: { id: string; updateAppointmentDto: UpdateAppointmentDto },
  ) {
    return this.appointmentService.update(data.id, data.updateAppointmentDto);
  }

  @MessagePattern('removeAppointment')
  async remove(@Payload() id: string) {
    return this.appointmentService.remove(id);
  }
}
