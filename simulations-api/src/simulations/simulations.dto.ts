export class SimulationDto {
  model: 'MajorityModel' | 'VoterModel' | 'SznajdModel' | 'QVoterModel';
  modelParams: object;
  iterations: number;
  mode: 'sync' | 'async';
  dotGraph: string;
  frameDurationSec: number;
}

export class SimulationId {
  id: any;
}
