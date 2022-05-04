import { ConflictException, Injectable, Logger, MessageEvent, NotFoundException } from '@nestjs/common';
import { ChildProcess, execFile } from 'child_process';
import { resolve } from 'path';
import { v4 as uuid } from 'uuid';
import { SimulationDto } from './simulation.dto';
import { Observable } from 'rxjs';

interface Simulation {
  id: string;
  runner: ChildProcess;
  inputDotGraph: string;
}

@Injectable()
export class SimulationsService {
  private static readonly MAX_PROCESS_COUNT = 3;
  private static readonly EXE_NAME = process.platform === 'win32' ? 'main.exe' : 'main';
  private static readonly STEP_REGEX = /\[STEP] (?<step>\d*)/;

  private readonly idToSimulationMap: Map<string, Simulation> = new Map();
  private readonly logger = new Logger(SimulationsService.name);

  startSimulation(simulation: SimulationDto) {
    if (this.idToSimulationMap.size === SimulationsService.MAX_PROCESS_COUNT)
      throw new ConflictException('The maximum limit of parallel simulations has been reached');

    const runner = execFile(resolve(__dirname, `../../runner/${SimulationsService.EXE_NAME}`));
    const id = uuid();
    this.idToSimulationMap.set(id, { id, runner, inputDotGraph: simulation.dotGraph });

    this.logger.log(`Starting simulation ${id}`);

    runner.addListener('error', (err) => {
      this.logger.error(`Error in simulation ${id}: ${err.message}`, err.stack);
    });

    runner.addListener('exit', (code, signal) => {
      this.logger.log(`Simulation ${id} exited with code: ${code} and signal: ${signal}`);
      this.idToSimulationMap.delete(id);
    });

    return { id: id };
  }

  subscribe(id: string): Observable<MessageEvent> {
    const simulation = this.getIfExists(id);
    const runner = simulation.runner;

    this.logger.log(`Subscribing to ${id}`);

    return new Observable<MessageEvent>((subscriber) => {
      runner.prependListener('error', (err) => {
        subscriber.next({
          data: {
            status: 'ERROR',
            message: err.message
          }
        });
      });

      runner.stdout.prependListener('data', (chunk) => {
        if (typeof chunk === 'string' && chunk.startsWith('[STEP] ')) {
          const step = chunk.match(SimulationsService.STEP_REGEX).groups.step;
          subscriber.next({
            data: {
              status: 'OK',
              step: step
            }
          });
        }
      });

      runner.prependListener('exit', (code) => {
        subscriber.next({
          data: {
            status: 'CLOSED',
            resultStatus: code ? 'FAILURE' : 'SUCCESS',
            dotGraph: simulation.inputDotGraph
          }
        });
        subscriber.complete();
      });
    });
  }

  getAllSimulations() {
    return [...this.idToSimulationMap.keys()];
  }

  getSimulation(id: string) {
    const simulation = this.getIfExists(id);
    return simulation.id;
  }

  private getIfExists(id: string) {
    const simulation = this.idToSimulationMap.get(id);
    if (!simulation) throw new NotFoundException(`Simulation with id ${id} does not exist`);
    return simulation;
  }
}
