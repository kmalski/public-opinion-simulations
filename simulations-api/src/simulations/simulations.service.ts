import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { execFile } from 'child_process';
import { resolve } from 'path';

@Injectable()
export class SimulationsService {
  private readonly simulations: Map<string, string> = new Map();
  private readonly logger = new Logger(SimulationsService.name);

  constructor() {
    this.simulations.set('1', '1 sim');
    this.simulations.set('2', '2 sim');
    this.simulations.set('3', '3 sim');
  }

  startSimulation() {
    const runner = execFile(resolve(__dirname, '../../runner/main.exe'));
    runner.stdout.on('data', (chunk) => this.logger.log(chunk));
    runner.on('exit', (code) => this.logger.log(`Simulation ended with code ${code}`));
    runner.on('close', (code) => this.logger.log(`Simulation closed all stdio with code ${code}`));
  }

  getSimulations() {
    return [...this.simulations.values()];
  }

  getSimulation(id: string) {
    const simulation = this.simulations.get(id);
    if (!simulation) throw new NotFoundException(`Simulation with id ${id} does not exist`);
    return this.simulations.get(id);
  }
}
