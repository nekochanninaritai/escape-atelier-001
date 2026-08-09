import Phaser from 'phaser';
import type { QuarterRotation } from '../core/types';
import { normalizeQuarterRotation } from '../utils/rotation';

export function rotateQuarter(currentRotation: number, delta = 90): QuarterRotation {
  return normalizeQuarterRotation(currentRotation + delta);
}

export function setGameObjectRotation(gameObject: Phaser.GameObjects.Components.Transform, degrees: number): void {
  gameObject.rotation = Phaser.Math.DegToRad(degrees);
}
