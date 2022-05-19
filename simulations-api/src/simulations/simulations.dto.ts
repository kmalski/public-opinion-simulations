export class SimulationDto {
  iterations: number;
  frameDurationSec: number;
  mode: 'sync' | 'async';
  model: any;
  dotGraph: string;
}

export class SimulationId {
  id: any;
}
