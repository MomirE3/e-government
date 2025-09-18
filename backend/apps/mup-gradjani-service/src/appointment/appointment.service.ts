import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentRepository } from './appointment.repository';
import { Appointment } from './entities/appointment.entity';

@Injectable()
export class AppointmentService {
  constructor(private readonly appointmentRepository: AppointmentRepository) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    // Провери да ли за захтев већ постоји термин
    const existingAppointment =
      await this.appointmentRepository.existsByRequestId(
        createAppointmentDto.requestId,
      );
    if (existingAppointment) {
      throw new ConflictException(
        'Appointment for this request already exists',
      );
    }

    return this.appointmentRepository.create(createAppointmentDto);
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.findAll();
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  async findByRequestId(requestId: string): Promise<Appointment> {
    const appointment =
      await this.appointmentRepository.findByRequestId(requestId);
    if (!appointment) {
      throw new NotFoundException(
        `Appointment for request ${requestId} not found`,
      );
    }
    return appointment;
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    // Провери да ли термин постоји
    const exists = await this.appointmentRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return this.appointmentRepository.update(id, updateAppointmentDto);
  }

  async remove(id: string): Promise<Appointment> {
    const exists = await this.appointmentRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return this.appointmentRepository.remove(id);
  }
}
