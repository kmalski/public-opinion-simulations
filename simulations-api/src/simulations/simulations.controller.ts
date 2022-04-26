import { Body, Controller, Get, HttpCode, Param, Post, Sse, MessageEvent } from '@nestjs/common';
import { SimulationsService } from './simulations.service';
import { SimulationDto } from './simulation.dto';
import { Observable } from 'rxjs';

@Controller('simulation')
export class SimulationsController {
  constructor(private simulationsService: SimulationsService) {}

  @Get()
  findAll() {
    return this.simulationsService.getAllSimulations();
  }

  @Get(':id')
  find(@Param('id') id: string) {
    return this.simulationsService.getSimulation(id);
  }

  @HttpCode(200)
  @Post()
  start(@Body() simulation: SimulationDto) {
    return this.simulationsService.startSimulation(simulation);
  }

  @Sse(':id/subscribe')
  subscribe(@Param('id') id: string): Observable<MessageEvent> {
    return this.simulationsService.subscribe(id);
  }
}
