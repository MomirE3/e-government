import { Test, TestingModule } from '@nestjs/testing';
import { ZavodZaStatistikuServiceController } from './zavod-za-statistiku-service.controller';
import { ZavodZaStatistikuServiceService } from './zavod-za-statistiku-service.service';

describe('ZavodZaStatistikuServiceController', () => {
  let zavodZaStatistikuServiceController: ZavodZaStatistikuServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ZavodZaStatistikuServiceController],
      providers: [ZavodZaStatistikuServiceService],
    }).compile();

    zavodZaStatistikuServiceController = app.get<ZavodZaStatistikuServiceController>(ZavodZaStatistikuServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(zavodZaStatistikuServiceController.getHello()).toBe('Hello World!');
    });
  });
});
