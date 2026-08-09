import type { PuzzlePoint } from '../core/types';
import { isWithinDistance } from '../utils/geometry';
import { isRotationAligned } from '../utils/rotation';

export type SnapCheck = {
  currentPosition: PuzzlePoint;
  targetPosition: PuzzlePoint;
  positionTolerance: number;
  currentRotation?: number;
  targetRotation?: number;
  rotationTolerance?: number;
};

export function canSnapPiece({
  currentPosition,
  targetPosition,
  positionTolerance,
  currentRotation,
  targetRotation,
  rotationTolerance = 0,
}: SnapCheck): boolean {
  const positionAligned = isWithinDistance(currentPosition, targetPosition, positionTolerance);
  const needsRotationCheck = currentRotation !== undefined && targetRotation !== undefined;
  return positionAligned && (!needsRotationCheck || isRotationAligned(currentRotation, targetRotation, rotationTolerance));
}

export function getSnapPosition(currentPosition: PuzzlePoint, targetPosition: PuzzlePoint, positionTolerance: number): PuzzlePoint {
  return isWithinDistance(currentPosition, targetPosition, positionTolerance) ? targetPosition : currentPosition;
}
