import { unlink, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { ChildProcess } from 'child_process';

export const runnerPath = resolve(__dirname, '../../runner');
export const runnerExeName = process.platform === 'win32' ? 'main.exe' : 'main';

export function killRunner(runner: ChildProcess) {
  if (process.platform === 'win32') runner.kill();
  else {
    let killed = runner.kill('SIGABRT');
    if (!killed) killed = runner.kill('SIGTERM');
    if (!killed) runner.kill('SIGKILL');
  }
}

export async function createGraphFile(id: string, data: any) {
  return writeFile(`${runnerPath}/graphs/${id}.dot`, data);
}

export async function deleteGraphFile(id: string) {
  return unlink(`${runnerPath}/graphs/${id}.dot`);
}