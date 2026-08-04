import type { GlobePosition } from '../types';

export const moonPhaseOrder = ['moon-new', 'moon-crescent', 'moon-half', 'moon-full'] as const;

export const moonPhaseLabels: Record<(typeof moonPhaseOrder)[number], string> = {
  'moon-new': '新月',
  'moon-crescent': '三日月',
  'moon-half': '半月',
  'moon-full': '満月',
};

export const initialMoonPhaseOrder = ['moon-half', 'moon-new', 'moon-full', 'moon-crescent'];

export const globePositions: GlobePosition[] = ['north', 'east', 'south', 'west', 'target'];
export const correctGlobePosition: GlobePosition = 'target';
export const dawnTimeAnswer = '05:20';

export const plateTargets = {
  piece1: { slotId: 'left', rotation: 90 },
  piece2: { slotId: 'top', rotation: 180 },
  piece3: { slotId: 'right', rotation: 270 },
} as const;

export function normalizePlateRotation(rotation: number): 0 | 90 | 180 | 270 {
  const normalized = ((Math.round(rotation / 90) * 90) % 360 + 360) % 360;
  return (normalized === 0 || normalized === 90 || normalized === 180 ? normalized : 270) as 0 | 90 | 180 | 270;
}

export function isCorrectPlatePiece(currentSlotId: string | null, currentRotation: number, targetSlotId: string, targetRotation: number): boolean {
  return currentSlotId === targetSlotId && normalizePlateRotation(currentRotation) === normalizePlateRotation(targetRotation);
}

export function isCorrectMoonPhaseOrder(order: string[]): boolean {
  return order.length === moonPhaseOrder.length && order.every((id, index) => id === moonPhaseOrder[index]);
}

export function isCorrectGlobePosition(positionId: GlobePosition): boolean {
  return positionId === correctGlobePosition;
}

export function isCorrectDawnTime(input: string): boolean {
  return input === dawnTimeAnswer;
}
