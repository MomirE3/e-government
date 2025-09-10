import { Controller, Get } from '@nestjs/common';
import { ZavodZaStatistikuServiceService } from './zavod-za-statistiku-service.service';

@Controller()
export class ZavodZaStatistikuServiceController {
  constructor(private readonly zavodZaStatistikuServiceService: ZavodZaStatistikuServiceService) {}

  @Get()
  getHello(): string {
    return this.zavodZaStatistikuServiceService.getHello();
  }
}
