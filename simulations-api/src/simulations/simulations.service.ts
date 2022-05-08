import { Injectable, Logger } from '@nestjs/common';
import { ChildProcess, execFile } from 'child_process';
import { WsException, WsResponse } from '@nestjs/websockets';
import { v4 as uuid } from 'uuid';
import { Observable } from 'rxjs';
import { SimulationsDto } from './simulations.dto';
import { createGraphFile, deleteGraphFile, killRunner, runnerExeName, runnerPath } from '../utils/runner';

interface Simulation {
  id: string;
  runner: ChildProcess;
}

interface GraphChange {
  node: any;
  opinion: number;
}

interface SimulationUpdate {
  step: number;
  changes: GraphChange[];
}

@Injectable()
export class SimulationsService {
  private static readonly MAX_PROCESS_COUNT = 3;
  private static readonly STEP_REGEX = /\[STEP] (?<step>.*)/;

  private readonly idToSimulationMap: Map<string, Simulation> = new Map();
  private readonly logger = new Logger(SimulationsService.name);

  async start(simulation: SimulationsDto): Promise<Observable<WsResponse>> {
    if (this.idToSimulationMap.size === SimulationsService.MAX_PROCESS_COUNT)
      throw new WsException('The maximum limit of parallel simulations has been reached');

    const id = uuid() as string;
    await createGraphFile(id, simulation.dotGraph);
    const runner = execFile(`${runnerPath}/${runnerExeName}`, [
      '-i',
      `${simulation.iterations}`,
      '-g',
      `graphs/${id}.dot`
    ]);
    this.idToSimulationMap.set(id, { id, runner });

    this.logger.log(`Starting simulation ${id}`);

    this.bindSystemEvents(runner, id);

    return this.subscribe(runner, id);
  }

  stop(id: string) {
    const simulation = this.getIfExists(id);
    killRunner(simulation.runner);
  }

  private subscribe(runner: ChildProcess, id: string): Observable<WsResponse> {
    this.logger.log(`Subscribing to ${id}`);

    return new Observable<WsResponse>((subscriber) => {
      subscriber.next({
        event: 'id',
        data: { id }
      });

      runner.prependListener('error', (err) => {
        throw new WsException(err.message);
      });

      runner.stdout.prependListener('data', (chunk) => {
        if (typeof chunk === 'string' && chunk.startsWith('[STEP] ')) {
          const step = chunk.match(SimulationsService.STEP_REGEX).groups.step;
          subscriber.next({
            event: 'step',
            data: step
          });
        }
      });

      runner.prependListener('exit', (code, signal) => {
        subscriber.next({
          event: 'exit',
          data: { code, signal }
        });
        subscriber.complete();
      });
    });
  }

  private bindSystemEvents(runner: ChildProcess, id: string) {
    runner.addListener('error', (err) => {
      this.logger.error(`Error in simulation ${id}: ${err.message}`, err.stack);
    });

    runner.addListener('exit', (code, signal) => {
      this.logger.log(`Simulation ${id} exited with code: ${code} and signal: ${signal}`);
      this.idToSimulationMap.delete(id);
      deleteGraphFile(id).then(() => {
        this.logger.log(`Removed ${id} simulation graph file`);
      });
    });
  }

  private getIfExists(id: string) {
    const simulation = this.idToSimulationMap.get(id);
    if (!simulation) throw new WsException(`Simulation with id ${id} does not exist`);
    return simulation;
  }
}
