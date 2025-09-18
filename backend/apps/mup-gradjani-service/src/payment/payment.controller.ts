import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentService } from './payment.service';
import type { CreatePaymentDto } from './dto/create-payment.dto';
import type { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern('createPayment')
  async create(@Payload() dto: CreatePaymentDto) {
    return this.paymentService.create(dto);
  }

  @MessagePattern('findAllPayments')
  findAll() {
    return this.paymentService.findAll();
  }

  @MessagePattern('findOnePayment')
  async findOne(@Payload() id: string) {
    return this.paymentService.findOne(id);
  }

  @MessagePattern('findPaymentByRequestId')
  async findByRequestId(@Payload() requestId: string) {
    return this.paymentService.findByRequestId(requestId);
  }

  @MessagePattern('updatePayment')
  async update(
    @Payload() data: { id: string; updatePaymentDto: UpdatePaymentDto },
  ) {
    return this.paymentService.update(data.id, data.updatePaymentDto);
  }

  @MessagePattern('removePayment')
  async remove(@Payload() id: string) {
    return this.paymentService.remove(id);
  }
}
