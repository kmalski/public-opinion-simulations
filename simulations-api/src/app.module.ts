import { Module } from '@nestjs/common';
import { SimulationsModule } from './simulations/simulations.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [SimulationsModule, StoreModule]
})
export class AppModule {}
