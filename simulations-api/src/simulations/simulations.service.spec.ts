import { Test, TestingModule } from '@nestjs/testing';
import { SimulationsService } from './simulations.service';
import { SimulationsValidator } from './simulations.validator';

describe('SimulationsService', () => {
  let service: SimulationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimulationsService, SimulationsValidator]
    }).compile();

    service = module.get(SimulationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
