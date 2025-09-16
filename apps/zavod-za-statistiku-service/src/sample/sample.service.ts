import { Injectable } from '@nestjs/common';
import { SampleRepository } from './sample.repository';
import { Sample } from './entities/sample.entity';
import { CreateSampleDto } from './dto/sample.dto';

@Injectable()
export class SampleService {
  constructor(private repo: SampleRepository) {}

  upsert(surveyId: number, dto: CreateSampleDto): Promise<Sample> {
    return this.repo.upsert(surveyId, dto);
  }

  findBySurveyId(surveyId: number): Promise<Sample | null> {
    return this.repo.findBySurveyId(surveyId);
  }
}
