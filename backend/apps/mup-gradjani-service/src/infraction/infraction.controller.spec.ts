import { Test, TestingModule } from '@nestjs/testing';
import { InfractionController } from './infraction.controller';
import { InfractionService } from './infraction.service';

describe('InfractionController', () => {
  let controller: InfractionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfractionController],
      providers: [InfractionService],
    }).compile();

    controller = module.get<InfractionController>(InfractionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
