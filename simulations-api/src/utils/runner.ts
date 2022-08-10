import { unlink, writeFile, readFile } from 'fs/promises';
import { resolve } from 'path';
import { ChildProcess } from 'child_process';

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

export async function createInputGraphFile(id: string, data: any) {
  return writeFile(`${runnerPath}/graphs/input-${id}.dot`, data);
}

export async function readOutputGraphFile(id: string): Promise<string> {
  return readFile(`${runnerPath}/graphs/output-${id}.dot`, 'utf8');
}

export async function readOutputInfoFile(id: string): Promise<string> {
  return readFile(`${runnerPath}/graphs/output-${id}.json`, 'utf8');
}

export async function deleteInputGraphFile(id: string) {
  try {
    return await unlink(`${runnerPath}/graphs/input-${id}.dot`);
  } catch (err) {
    return await Promise.resolve(); // assume no file to delete
  }
}

export async function deleteOutputGraphFiles(id: string) {
  try {
    return await Promise.all([
      unlink(`${runnerPath}/graphs/output-${id}.json`),
      unlink(`${runnerPath}/graphs/output-${id}.dot`)
    ]);
  } catch (err) {
    return await Promise.resolve(); // assume no files to delete
  }
}
