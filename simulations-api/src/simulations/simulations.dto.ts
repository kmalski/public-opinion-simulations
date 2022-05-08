export class SimulationsDto {
  iterations: number;
  model: any;
  dotGraph: string;
}

export class SimulationId {
  id: any;
}

export class SimulationStep {
  resultStatus?: string;
  step?: string;
  message?: string;
  dotGraph?: string;
  status: string;
}
