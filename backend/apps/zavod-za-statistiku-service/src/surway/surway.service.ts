import { Injectable } from '@nestjs/common';
import { CreateSurwayDto } from './dto/create-surway.dto';
import { UpdateSurwayDto } from './dto/update-surway.dto';
import { SurveyRepository } from './survay.repository';

@Injectable()
export class SurwayService {
  constructor(private surwayRepository: SurveyRepository) {}
  create(createSurwayDto: CreateSurwayDto) {
    return this.surwayRepository.create(createSurwayDto);
  }

  findAll() {
    return this.surwayRepository.findAll();
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} surway`;
  // }

  update(id: number, updateSurwayDto: UpdateSurwayDto) {
    return this.surwayRepository.update(id, updateSurwayDto);
  }

  updateStatus(id: number, status: string) {
    return this.surwayRepository.updateStatus(id, status);
  }

  remove(id: number) {
    return this.surwayRepository.remove(id);
  }
}
