import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestsRepository } from './requests.repository';

@Injectable()
export class RequestsService {
  constructor(private requestsRepository: RequestsRepository) {}
  create(createRequestDto: CreateRequestDto) {
    return this.requestsRepository.create(createRequestDto);
  }

  findAll() {
    return this.requestsRepository.findAll();
  }

  findOne(id: string) {
    return this.requestsRepository.findOne(id);
  }

  update(id: string, updateRequestDto: UpdateRequestDto) {
    return this.requestsRepository.update(id, updateRequestDto);
  }

  remove(id: string) {
    return this.requestsRepository.remove(id);
  }
}
