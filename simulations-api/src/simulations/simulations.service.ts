import { Injectable, Logger } from '@nestjs/common';
import { ChildProcess, execFile } from 'child_process';
import { WsException, WsResponse } from '@nestjs/websockets';
import { v4 as uuid } from 'uuid';
import { Observable } from 'rxjs';
import { SimulationDto } from './simulations.dto';
import { createGraphFile, deleteGraphFile, killRunner, runnerExeName, runnerPath } from '../utils/runner';
import { Queue } from '../utils/queue';
import { MAX_PROCESS_COUNT, STEP_REGEX } from '../config';
import { Outgoing } from './simulations.events';

interface Message {
  event: Outgoing;
  data: any;
}

interface Simulation {
  id: string;
  runner: ChildProcess;
  messageQueue: Queue<Message>;
  isIdle: boolean;
  exitMessage?: Message;
  updatesTimer?: ReturnType<typeof setInterval>;
}

@Injectable()
export class SimulationsService {
  private readonly idToSimulationMap: Map<string, Simulation> = new Map();
  private readonly logger = new Logger(SimulationsService.name);

  async start(simulationDto: SimulationDto): Promise<Observable<WsResponse>> {
    if (this.idToSimulationMap.size === MAX_PROCESS_COUNT)
      throw new WsException('The maximum limit of parallel simulations has been reached');

    if (simulationDto.iterations < 1) throw new WsException('Iterations number can not be smaller than 1');

    const id = uuid() as string;
    await createGraphFile(id, simulationDto.dotGraph);
    const runner = execFile(`${runnerPath}/${runnerExeName}`, [
      '-i',
      `${simulationDto.iterations}`,
      '-g',
      `graphs/${id}.dot`
    ]);
    const simulation = { id, runner, messageQueue: new Queue<Message>(), isIdle: true };
    this.idToSimulationMap.set(id, simulation);

    this.logger.log(`Starting simulation ${id}`);

    this.bindSystemEvents(runner, simulation);
    return this.subscribe(runner, simulation);
  }

  stop(id: string) {
    const simulation = this.getIfExists(id);
    if (!simulation.exitMessage) killRunner(simulation.runner);
    simulation.messageQueue.clear();
  }

  private subscribe(runner: ChildProcess, simulation: Simulation): Observable<WsResponse> {
    this.logger.log(`Subscribing to ${simulation.id}`);

    return new Observable<WsResponse>((subscriber) => {
      subscriber.next({
        event: Outgoing.ID,
        data: { id: simulation.id }
      });

      runner.addListener('error', (err) => {
        throw new WsException(err.message);
      });

      const sendMessage = () => {
        if (simulation.messageQueue.size() > 0) {
          subscriber.next(simulation.messageQueue.dequeue());
          simulation.isIdle = false;
        } else if (simulation.exitMessage) {
          subscriber.next(simulation.exitMessage);
          this.cleanupSimulation(simulation);
        } else {
          simulation.isIdle = true;
        }
      };
      simulation.updatesTimer = setInterval(sendMessage, 1000);

      runner.stdout.addListener('data', (chunk) => {
        if (typeof chunk === 'string') {
          let matched;
          while ((matched = STEP_REGEX.exec(chunk))) {
            const step = matched[1];
            const message = { event: Outgoing.STEP, data: step };
            simulation.messageQueue.enqueue(message);

            if (simulation.isIdle) {
              sendMessage();
              clearInterval(simulation.updatesTimer);
              simulation.updatesTimer = setInterval(sendMessage, 1000);
            }
          }
        }
      });

      runner.addListener('exit', (code, signal) => {
        const message = { event: Outgoing.EXIT, data: { code, signal } };
        if (signal) {
          subscriber.next(message);
          this.cleanupSimulation(simulation);
        } else {
          simulation.exitMessage = message;
        }
      });
    });
  }

  private bindSystemEvents(runner: ChildProcess, simulation: Simulation) {
    const id = simulation.id;

    runner.addListener('error', (err) => {
      this.logger.error(`Error in simulation ${id}: ${err.message}`, err.stack);
    });

    runner.addListener('exit', (code, signal) => {
      this.logger.log(`Simulation ${id} exited with code: ${code} and signal: ${signal}`);
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

  private cleanupSimulation(simulation: Simulation) {
    clearInterval(simulation.updatesTimer);
    simulation.messageQueue.clear();
    this.idToSimulationMap.delete(simulation.id);
  }
}
