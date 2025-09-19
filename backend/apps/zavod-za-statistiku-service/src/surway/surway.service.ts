import { Injectable } from '@nestjs/common';
import { CreateSurwayDto } from './dto/create-surway.dto';
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

  // update(id: number, updateSurwayDto: UpdateSurwayDto) {
  //   return `This action updates a #${id} surway`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} surway`;
  // }
}
