import { Module } from '@nestjs/common';
import { SimulationsService } from './simulations.service';
import { SimulationsGateway } from './simulations.gateway';

@Module({
  providers: [SimulationsService, SimulationsGateway]
})
export class SimulationsModule {}
