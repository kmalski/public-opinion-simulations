import { Test, TestingModule } from '@nestjs/testing';
import { SimulationsValidator } from './simulations.validator';
import { SimulationDto } from './simulations.dto';
import { WsException } from '@nestjs/websockets';

const graph = `graph G {

  a [label="1",  pos="-5,5!"]
  b [label="-1", pos="0,0!"]
  c [label="-1", pos="0,10!"]
  d [label="1",  pos="5,5!"]

  a -- {b, c} -- d;
  a -- d
}`;

describe('SimulationsValidator', () => {
  let validator: SimulationsValidator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SimulationsValidator]
    }).compile();

    validator = module.get(SimulationsValidator);
  });

  it('should not throw for valid dto', () => {
    const dto = {
      model: 'MajorityModel',
      modelParams: {
        groupSize: 5
      },
      iterations: 100,
      mode: 'sync',
      dotGraph: graph,
      frameDurationSec: 1
    } as SimulationDto;

    expect(() => validator.validate(dto)).not.toThrow();
  });

  it('should not throw for big iterations during when simulation does not run as animation', () => {
    const dto = {
      model: 'MajorityModel',
      modelParams: {
        groupSize: 5
      },
      iterations: 5001,
      mode: 'sync',
      dotGraph: graph,
      frameDurationSec: 0
    } as SimulationDto;

    expect(() => validator.validate(dto)).not.toThrow(WsException);
  });

  it('should throw for too small iterations', () => {
    const dto = {
      model: 'MajorityModel',
      modelParams: {
        groupSize: 5
      },
      iterations: 0,
      mode: 'sync',
      dotGraph: graph,
      frameDurationSec: 1
    } as SimulationDto;

    expect(() => validator.validate(dto)).toThrow(WsException);
  });

  it('should throw for too big iterations during when simulation runs as animation', () => {
    const dto = {
      model: 'MajorityModel',
      modelParams: {
        groupSize: 5
      },
      iterations: 5001,
      mode: 'sync',
      dotGraph: graph,
      frameDurationSec: 0.1
    } as SimulationDto;

    expect(() => validator.validate(dto)).toThrow(WsException);
  });
});
