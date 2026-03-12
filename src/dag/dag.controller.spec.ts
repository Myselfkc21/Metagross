import { Test, TestingModule } from '@nestjs/testing';
import { DagController } from './dag.controller';
import { DagService } from './dag.service';

describe('DagController', () => {
  let controller: DagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DagController],
      providers: [DagService],
    }).compile();

    controller = module.get<DagController>(DagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
