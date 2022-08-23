import { Module } from '@nestjs/common';
import { SimulationsService } from './simulations.service';
import { SimulationsGateway } from './simulations.gateway';
import { SimulationsValidator } from './simulations.validator';

@Module({
  providers: [SimulationsService, SimulationsGateway, SimulationsValidator]
})
export class SimulationsModule {}
