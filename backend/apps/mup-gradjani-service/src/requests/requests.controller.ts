import { Controller, Body } from '@nestjs/common';
import { RequestsService } from './requests.service';
import type { CreateRequestDto } from './dto/create-request.dto';
import type { UpdateRequestDto } from './dto/update-request.dto';
import type { UpdateRequestStatusDto } from './dto/update-request-status.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import type { FilterRequestDto } from './dto/filter-request.dto';

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

  @MessagePattern('findAllRequestsWithFilter')
  findAllRequests(@Payload() params: FilterRequestDto) {
    console.log('findAllRequestsWithFilter', params);
    return this.requestsService.findAllRequests(params);
  }

  @MessagePattern('findRequestsByCitizenId')
  findByCitizenId(citizenId: string) {
    console.log('findRequestsByCitizenId', citizenId);
    return this.requestsService.findByCitizenId(citizenId);
  }

  @MessagePattern('findOneRequest')
  findOne(id: string) {
    console.log('findOneRequest', id);
    return this.requestsService.findOne(id);
  }

  @MessagePattern('updateRequest')
  update(data: { id: string; body: UpdateRequestDto }) {
    return this.requestsService.update(data.id, data.body);
  }

  @MessagePattern('updateRequestStatus')
  updateStatus(data: { id: string; body: UpdateRequestStatusDto }) {
    return this.requestsService.updateStatus(data.id, data.body);
  }

  @MessagePattern('removeRequest')
  remove(id: string) {
    return this.requestsService.remove(id);
  }
}
