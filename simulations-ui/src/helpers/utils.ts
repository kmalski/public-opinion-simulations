export function noop(): void {
  // empty immutable function
}

export function valid(): boolean {
  return true;
}

export function range(start: number, end: number) {
  const length = end - start;
  return Array.from({ length }, (_, i) => start + i);
}
