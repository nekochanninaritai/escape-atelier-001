import type { QuarterRotation } from '../core/types';

const QUARTER_TURN = 90;
const FULL_TURN = 360;

export function normalizeDegrees(degrees: number): number {
  return ((degrees % FULL_TURN) + FULL_TURN) % FULL_TURN;
}

export function normalizeQuarterRotation(degrees: number): QuarterRotation {
  const normalized = normalizeDegrees(degrees);
  const rounded = Math.round(normalized / QUARTER_TURN) * QUARTER_TURN;
  return (rounded % FULL_TURN) as QuarterRotation;
}

export function rotationDistance(a: number, b: number): number {
  const diff = Math.abs(normalizeDegrees(a) - normalizeDegrees(b));
  return Math.min(diff, FULL_TURN - diff);
}

export function isRotationAligned(current: number, target: number, tolerance = 0): boolean {
  return rotationDistance(current, target) <= tolerance;
}
