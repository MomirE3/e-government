import { Controller, Body, Param } from '@nestjs/common';
import { RequestsService } from './requests.service';
import type { CreateRequestDto } from './dto/create-request.dto';
import type { UpdateRequestDto } from './dto/update-request.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @MessagePattern('createRequest')
  create(@Body() createRequestDto: CreateRequestDto) {
    return this.requestsService.create(createRequestDto);
  }

  @MessagePattern('findAllRequests')
  findAll() {
    return this.requestsService.findAll();
  }

  @MessagePattern('findOneRequest')
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(id);
  }

  @MessagePattern('updateRequest')
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestsService.update(id, updateRequestDto);
  }

  @MessagePattern('removeRequest')
  remove(@Param('id') id: string) {
    return this.requestsService.remove(id);
  }
}
