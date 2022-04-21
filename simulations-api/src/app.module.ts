import { Module } from '@nestjs/common';
import { SimulationsModule } from './simulations/simulations.module';

@Module({
  imports: [SimulationsModule]
})
export class AppModule {}
