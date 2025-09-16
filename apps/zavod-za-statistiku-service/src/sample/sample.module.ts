import { Module } from '@nestjs/common';
import { SampleService } from './sample.service';
import { SampleRepository } from './sample.repository';

@Module({
  providers: [SampleService, SampleRepository],
  exports: [SampleService],
})
export class SampleModule {}
