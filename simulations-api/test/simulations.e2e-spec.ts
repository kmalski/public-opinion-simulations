import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { SimulationsModule } from '../src/simulations/simulations.module';
import { SimulationsService } from '../src/simulations/simulations.service';
import { of, first } from 'rxjs';
import { WsResponse } from '@nestjs/websockets';
import { Incoming, Outgoing } from '../src/simulations/simulations.events';
import { io, Socket } from 'socket.io-client';

const simulationDto = {
  iterations: 100,
  frameDurationSec: 1,
  mode: 'sync' as const,
  model: {},
  dotGraph: 'graph {}'
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let ws: Socket;

  const simulationsService = {} as SimulationsService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SimulationsModule]
    })
      .overrideProvider(SimulationsService)
      .useValue(simulationsService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should start new simulation', (done) => {
    const address = app.getHttpServer().listen().address();
    ws = io(`http://[${address.address}]:${address.port}/simulation`);

    simulationsService.start = async () => of({ event: Outgoing.ID, data: { id: 'abc' } } as WsResponse);

    ws.emit(Incoming.START, simulationDto);

    ws.on(Outgoing.ID, (data) => {
      expect(data.id).toBe('abc');
      done();
    });
  });

  it('should stop simulation', (done) => {
    const address = app.getHttpServer().listen().address();
    ws = io(`http://[${address.address}]:${address.port}/simulation`);

    const simulationId = { id: 'abc' };
    const observable = of({
      event: Outgoing.EXIT,
      data: { code: null, signal: null }
    } as WsResponse);

    simulationsService.start = async () => observable;
    simulationsService.stop = async () => observable.pipe(first());

    ws.emit(Incoming.START, simulationDto);
    ws.emit(Incoming.STOP, simulationId);

    ws.on(Outgoing.EXIT, (data) => {
      expect(data.code).toBeNull();
      expect(data.signal).toBeNull();
      done();
    });
  });

  afterEach(() => {
    app.close();
    ws.close();
  });
});
