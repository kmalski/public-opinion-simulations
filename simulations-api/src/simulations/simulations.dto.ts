export class SimulationDto {
  iterations: number;
  mode: 'sync' | 'async';
  model: any;
  dotGraph: string;
}

export class SimulationId {
  id: any;
}
