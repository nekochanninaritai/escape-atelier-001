import type { PuzzlePoint } from '../core/types';

export function distanceBetween(a: PuzzlePoint, b: PuzzlePoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function isWithinDistance(a: PuzzlePoint, b: PuzzlePoint, tolerance: number): boolean {
  return distanceBetween(a, b) <= tolerance;
}
