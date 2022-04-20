import { Controller, Get, Param, Post } from '@nestjs/common';
import { SimulationsService } from './simulations.service';

@Controller('simulation')
export class SimulationsController {
  constructor(private simulationsService: SimulationsService) {}

  @Get()
  findAll() {
    return this.simulationsService.getSimulations();
  }

  @Get(':id')
  find(@Param('id') id: string) {
    return this.simulationsService.getSimulation(id);
  }

  @Post()
  start() {
    return this.simulationsService.startSimulation();
  }
}
