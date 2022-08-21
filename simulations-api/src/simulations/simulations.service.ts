import { Injectable, Logger } from '@nestjs/common';
import { ChildProcess, execFile } from 'child_process';
import { WsException, WsResponse } from '@nestjs/websockets';
import { v4 as uuid } from 'uuid';
import { Observable, Subscriber } from 'rxjs';
import { SimulationDto } from './simulations.dto';
import {
  createConfigFile,
  createInputGraphFile,
  deleteInputFiles,
  deleteOutputFiles,
  inputConfigFilename,
  killRunner,
  outputGraphFilename,
  outputInfoFilename,
  readOutputGraphFile,
  readOutputInfoFile,
  runnerExeName,
  runnerPath
} from '../utils/runner';
import { Queue } from '../utils/queue';
import { FILE_TAG, MAX_PROCESS_COUNT, STEP_REGEX } from '../config';
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
  frameDurationMiliSec: number;
  sendMessage?: () => void;
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
    await createInputGraphFile(id, simulationDto);
    await createConfigFile(id, simulationDto);
    const args = [inputConfigFilename(id), outputGraphFilename(id), outputInfoFilename(id)];
    const runner = execFile(`${runnerPath}/${runnerExeName}`, args, { cwd: runnerPath });

    const simulation = {
      id,
      runner,
      messageQueue: new Queue<Message>(),
      isIdle: true,
      frameDurationMiliSec: simulationDto.frameDurationSec * 1000
    };
    this.idToSimulationMap.set(id, simulation);

    this.logger.log(`Starting simulation ${id}`);

    this.bindSystemEvents(runner, simulation);
    return this.subscribe(runner, simulation);
  }

  stop(id: string) {
    const simulation = this.getIfExists(id);
    if (!simulation.exitMessage) killRunner(simulation.runner);
    this.cleanupSimulation(simulation);
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

      runner.addListener('exit', (code, signal) => {
        const message = { event: Outgoing.EXIT, data: { code, signal } };
        if (signal) {
          simulation.exitMessage = message;
          this.cleanupSimulation(simulation);
        } else {
          simulation.exitMessage = message;
        }
      });

      simulation.sendMessage = this.createSendMessageFunc(simulation, subscriber);
      if (simulation.frameDurationMiliSec === 0) {
        this.bindResult(runner, simulation);
      } else {
        this.bindSteps(runner, simulation);
      }
    });
  }

  private bindSteps(runner: ChildProcess, simulation: Simulation) {
    this.refreshMessageInterval(simulation);

    runner.stdout.addListener('data', (chunk) => {
      if (typeof chunk === 'string') {
        let matched;
        while ((matched = STEP_REGEX.exec(chunk))) {
          const step = matched[1];
          const message = { event: Outgoing.STEP, data: JSON.parse(step) };
          simulation.messageQueue.enqueue(message);

          if (simulation.isIdle) {
            this.sendMessageImmediately(simulation);
            this.refreshMessageInterval(simulation);
          }
        }
      }
    });
  }

  private bindResult(runner: ChildProcess, simulation: Simulation) {
    runner.stdout.addListener('data', async (chunk) => {
      if (typeof chunk === 'string') {
        if (chunk.includes(FILE_TAG)) {
          const resultGraph = await readOutputGraphFile(simulation.id);
          const resultInfo = await readOutputInfoFile(simulation.id);
          const data = JSON.parse(resultInfo);
          data.graph = resultGraph;

          const message = { event: Outgoing.RESULT, data };
          simulation.messageQueue.enqueue(message);
          this.sendMessageImmediately(simulation);

          simulation.frameDurationMiliSec = 500;
          this.refreshMessageInterval(simulation);
        }
      }
    });
  }

  private bindSystemEvents(runner: ChildProcess, simulation: Simulation) {
    const id = simulation.id;

    runner.addListener('error', (err) => {
      this.logger.error(`Error in simulation ${id}: ${err.message}`, err.stack);
    });

    runner.addListener('exit', (code, signal) => {
      this.logger.log(`Simulation ${id} exited with code: ${code} and signal: ${signal}`);
    });
  }

  private getIfExists(id: string) {
    const simulation = this.idToSimulationMap.get(id);
    if (!simulation) throw new WsException(`Simulation with id ${id} does not exist`);
    return simulation;
  }

  private sendMessageImmediately(simulation: Simulation) {
    clearInterval(simulation.updatesTimer);
    simulation.sendMessage();
  }

  private refreshMessageInterval(simulation: Simulation) {
    simulation.updatesTimer = setInterval(simulation.sendMessage, simulation.frameDurationMiliSec);
  }

  private cleanupSimulation(simulation: Simulation) {
    if (simulation.updatesTimer) clearInterval(simulation.updatesTimer);
    simulation.messageQueue.clear();
    if (simulation.sendMessage) simulation.sendMessage();
    Promise.allSettled([deleteInputFiles(simulation.id), deleteOutputFiles(simulation.id)]).then(
      ([inputResult, outputResult]) => {
        if (inputResult?.status === 'fulfilled' && inputResult.value) {
          this.logger.log(`Removed ${simulation.id} simulation input graph files`);
        }
        if (outputResult?.status === 'fulfilled' && outputResult.value) {
          this.logger.log(`Removed ${simulation.id} simulation output graph files`);
        }
      }
    );
    this.idToSimulationMap.delete(simulation.id);
  }

  private createSendMessageFunc(simulation: Simulation, subscriber: Subscriber<WsResponse>) {
    return () => {
      if (simulation.messageQueue.size() > 0) {
        subscriber.next(simulation.messageQueue.dequeue());
        simulation.isIdle = false;
      } else if (simulation.exitMessage) {
        subscriber.next(simulation.exitMessage);
        simulation.exitMessage = undefined;
        this.cleanupSimulation(simulation);
      } else {
        simulation.isIdle = true;
      }
    };
  }
}
