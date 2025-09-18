import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentRepository } from './payment.repository';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    // Провери да ли за захтев већ постоји плаћање
    const existingPayment = await this.paymentRepository.existsByRequestId(
      createPaymentDto.requestId,
    );
    if (existingPayment) {
      throw new ConflictException('Payment for this request already exists');
    }

    return this.paymentRepository.create(createPaymentDto);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.findAll();
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne(id);
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async findByRequestId(requestId: string): Promise<Payment> {
    const payment = await this.paymentRepository.findByRequestId(requestId);
    if (!payment) {
      throw new NotFoundException(`Payment for request ${requestId} not found`);
    }
    return payment;
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    // Провери да ли плаћање постоји
    const exists = await this.paymentRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return this.paymentRepository.update(id, updatePaymentDto);
  }

  async remove(id: string): Promise<Payment> {
    const exists = await this.paymentRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return this.paymentRepository.remove(id);
  }
}
