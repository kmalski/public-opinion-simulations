import { unlink, writeFile, readFile } from 'fs/promises';
import { resolve } from 'path';
import { ChildProcess } from 'child_process';
import { isAnimation, SimulationDto } from '../simulations/simulations.dto';

export const runnerPath = resolve(__dirname, '../../runner/build');
export const runnerExeName = process.platform === 'win32' ? 'Runner.exe' : 'Runner';

export function killRunner(runner: ChildProcess) {
  if (process.platform === 'win32') runner.kill();
  else {
    let killed = runner.kill('SIGABRT');
    if (!killed) killed = runner.kill('SIGTERM');
    if (!killed) runner.kill('SIGKILL');
  }
}

export async function createConfigFile(id: string, simulationDto: SimulationDto) {
  const config = {
    model: simulationDto.model,
    pathToGraph: `graphs/input-${id}.dot`,
    maxIterations: simulationDto.iterations,
    averageOpinion: true,
    verbose: isAnimation(simulationDto),
    modelParams: simulationDto.modelParams
  };
  return writeFile(`${runnerPath}/${inputConfigFilename(id)}`, JSON.stringify(config));
}

export async function createInputGraphFile(id: string, simulationDto: SimulationDto) {
  return writeFile(`${runnerPath}/${inputGraphFilename(id)}`, simulationDto.dotGraph);
}

export async function readOutputGraphFile(id: string): Promise<string> {
  return readFile(`${runnerPath}/${outputGraphFilename(id)}`, 'utf8');
}

export async function readOutputInfoFile(id: string): Promise<string> {
  return readFile(`${runnerPath}/${outputInfoFilename(id)}`, 'utf8');
}

export async function deleteInputFiles(id: string): Promise<boolean> {
  try {
    await Promise.all([
      unlink(`${runnerPath}/${inputGraphFilename(id)}`),
      unlink(`${runnerPath}/${inputConfigFilename(id)}`)
    ]);
    return true;
  } catch (err) {
    return false;
  }
}

export async function deleteOutputFiles(id: string): Promise<boolean> {
  try {
    await Promise.all([
      unlink(`${runnerPath}/${outputGraphFilename(id)}`),
      unlink(`${runnerPath}/${outputInfoFilename(id)}`)
    ]);
    return true;
  } catch (err) {
    return false;
  }
}

export function inputGraphFilename(id: string) {
  return `graphs/input-${id}.dot`;
}

export function outputGraphFilename(id: string) {
  return `graphs/output-${id}.dot`;
}

export function inputConfigFilename(id: string) {
  return `graphs/config-${id}.dot`;
}

export function outputInfoFilename(id: string) {
  return `graphs/info-${id}.dot`;
}
