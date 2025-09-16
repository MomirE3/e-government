import { Controller, Get } from '@nestjs/common';
import { MupGradjaniServiceService } from './mup-gradjani-service.service';

@Controller()
export class MupGradjaniServiceController {
  constructor(
    private readonly mupGradjaniServiceService: MupGradjaniServiceService,
  ) {}

  @Get()
  getHello(): string {
    return this.mupGradjaniServiceService.getHello();
  }
}
