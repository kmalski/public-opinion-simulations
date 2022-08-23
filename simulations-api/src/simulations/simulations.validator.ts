import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { isAnimation, SimulationDto } from './simulations.dto';

@Injectable()
export class SimulationsValidator {
  validate(simulationDto: SimulationDto): void {
    if (simulationDto.iterations < 1) {
      throw new WsException('The number of iterations can not be smaller than 1');
    }

    if (isAnimation(simulationDto) && simulationDto.iterations > 5000) {
      throw new WsException('The number of iterations during the animation must not exceed 5000');
    }
  }
}
