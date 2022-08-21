import { Test, TestingModule } from '@nestjs/testing';
import { SimulationsGateway } from './simulations.gateway';
import { SimulationsService } from './simulations.service';
import { Observable, of, take } from 'rxjs';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { Incoming, Outgoing } from './simulations.events';
import { WsResponse } from '@nestjs/websockets';

describe('SimulationsGateway', () => {
  let service: SimulationsService;
  let app: INestApplication;
  let ws: Socket;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimulationsGateway, SimulationsService]
    }).compile();

    service = module.get<SimulationsService>(SimulationsService);
    app = module.createNestApplication();
    ws = io('http://localhost:3000/simulation');
    await app.listen(3000);
  });

  it('should start new simulation', async () => {
    const simulationDto = {
      iterations: 100,
      frameDurationSec: 1,
      mode: 'sync' as const,
      model: {},
      dotGraph: 'graph {}'
    };

    jest.spyOn(service, 'start').mockImplementation(
      async () =>
        new Observable<WsResponse>((subscriber) => {
          subscriber.next({
            event: Outgoing.ID,
            data: { id: 'abc' }
          });
        })
    );

    ws.emit(Incoming.START, simulationDto);
    await new Promise<void>((resolve) =>
      ws.on(Outgoing.ID, (data) => {
        expect(data.id).toBe('abc');
        expect(service.start).toBeCalledWith(simulationDto);
        resolve();
      })
    );
  });

  it('should stop simulation', async () => {
    const simulationId = { id: 'abc' };
    const observable = of({
      event: Outgoing.EXIT,
      data: { code: null, signal: null }
    });

    jest.spyOn(service, 'start').mockImplementation(async () => observable);

    jest.spyOn(service, 'stop').mockImplementation(async () => observable.pipe(take(1)));

    ws.emit(Incoming.START, {});

    await new Promise<void>((resolve) => {
      ws.emit(Incoming.STOP, simulationId);

      ws.on(Outgoing.EXIT, (data) => {
        expect(data.code).toBeNull();
        expect(data.signal).toBeNull();
        resolve();
      });
    });
  });

  afterEach(() => {
    app.close();
    ws.close();
  });
});
