import { Test, TestingModule } from '@nestjs/testing';
import { SimulationsGateway } from './simulations.gateway';
import { SimulationsService } from './simulations.service';
import { first, of } from 'rxjs';
import { Outgoing } from './simulations.events';
import { WsResponse } from '@nestjs/websockets';
import { SimulationsValidator } from './simulations.validator';

describe('SimulationsGateway', () => {
  let gateway: SimulationsGateway;

  const simulationsService = {} as SimulationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimulationsGateway, SimulationsService, SimulationsValidator]
    })
      .overrideProvider(SimulationsService)
      .useValue(simulationsService)
      .compile();

    gateway = module.get(SimulationsGateway);
  });

  it('should start new simulation', (done) => {
    const simulationDto = {
      iterations: 100,
      frameDurationSec: 1,
      mode: 'sync' as const,
      model: 'VoterModel' as const,
      modelParams: {},
      dotGraph: 'graph {}'
    };

    simulationsService.start = async () => of({ event: Outgoing.ID, data: { id: 'abc' } } as WsResponse);

    const response = gateway.start(simulationDto);

    response.then((observable) => {
      observable.pipe(first()).subscribe((value) => {
        expect(value.event).toBe(Outgoing.ID);
        expect(value.data.id).toBe('abc');
        done();
      });
    });
  });

  it('should stop simulation', (done) => {
    const simulationId = { id: 'abc' };
    const observable = of({
      event: Outgoing.EXIT,
      data: { code: null, signal: null }
    } as WsResponse);

    simulationsService.start = async () => observable;
    simulationsService.stop = async () => observable.pipe(first());

    gateway.stop(simulationId);

    observable.subscribe((value) => {
      expect(value.event).toBe(Outgoing.EXIT);
      expect(value.data.code).toBeNull();
      expect(value.data.signal).toBeNull();
      done();
    });
  });
});
