import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ChildProcess, execFile } from 'child_process';
import { resolve } from 'path';
import { v4 as uuid } from 'uuid';

interface Simulation {
  id: string;
  runner: ChildProcess;
}

@Injectable()
export class SimulationsService {
  private static readonly MAX_PROCESS_COUNT = 3;
  private static readonly EXE_NAME = process.platform === 'win32' ? 'main.exe' : 'main';
  private static readonly STEP_REGEX = /\[STEP] (?<step>[0-9]*)/;

  private readonly idToSimulationMap: Map<string, Simulation> = new Map();
  private readonly logger = new Logger(SimulationsService.name);

  startSimulation() {
    if (this.idToSimulationMap.size === SimulationsService.MAX_PROCESS_COUNT)
      throw new ConflictException('The maximum limit of parallel simulations has been reached');

    const runner = execFile(resolve(__dirname, `../../runner/${SimulationsService.EXE_NAME}`));
    const id = uuid();
    this.logger.log(`Simulation ${id}`);

    runner.on('spawn', () => {
      const simulation = { id, runner };
      this.idToSimulationMap.set(id, simulation);
    });

    runner.on('error', (err) => {
      this.logger.error(`Error in simulation ${id}: ${err.message}`, err.stack);

      // TODO: send information do client
    });

    runner.on('exit', (code, signal) => {
      this.logger.log(`Simulation ${id} exited with code: ${code} and signal: ${signal}`);
      this.idToSimulationMap.delete(id);
      const isError = code || signal;
      if (isError) {
        // TODO: close connection
      } else {
        // TODO: return result
      }
    });

    runner.stdout.on('data', (chunk) => {
      if (typeof chunk === 'string' && chunk.startsWith('[STEP] ')) {
        const step = chunk.match(SimulationsService.STEP_REGEX).groups.step;
        this.logger.log(`${id} ${step}`);
      }
      // TODO: return step number to client
    });

    return id;
  }

  getSimulations() {
    return [...this.idToSimulationMap.keys()];
  }

  getSimulation(id: string) {
    const simulation = this.idToSimulationMap.get(id);
    if (!simulation) throw new NotFoundException(`Simulation with id ${id} does not exist`);
    return id;
  }
}
