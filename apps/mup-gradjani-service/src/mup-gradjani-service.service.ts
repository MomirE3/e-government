import { Injectable } from '@nestjs/common';

@Injectable()
export class MupGradjaniServiceService {
  getHello(): string {
    return 'Hello World! MUP Gradjani Service';
  }
}
