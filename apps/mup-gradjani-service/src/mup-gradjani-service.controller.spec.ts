import { Test, TestingModule } from '@nestjs/testing';
import { MupGradjaniServiceController } from './mup-gradjani-service.controller';
import { MupGradjaniServiceService } from './mup-gradjani-service.service';

describe('MupGradjaniServiceController', () => {
  let mupGradjaniServiceController: MupGradjaniServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MupGradjaniServiceController],
      providers: [MupGradjaniServiceService],
    }).compile();

    mupGradjaniServiceController = app.get<MupGradjaniServiceController>(MupGradjaniServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(mupGradjaniServiceController.getHello()).toBe('Hello World!');
    });
  });
});
