import { describe, expect, it } from 'vitest';
import { isOverlayAligned } from './interactions/overlay';
import { isCorrectOrder, moveArrayItem } from './interactions/reorder';
import { getSnapPosition, canSnapPiece } from './interactions/snap';
import { addSelection, clearSelection, removeSelection, toggleSelection } from './interactions/selection';
import { normalizeDegrees, normalizeQuarterRotation, rotationDistance, isRotationAligned } from './utils/rotation';

describe('phaser puzzle logic', () => {
  it('normalizes degrees and quarter rotations', () => {
    expect(normalizeDegrees(-90)).toBe(270);
    expect(normalizeQuarterRotation(88)).toBe(90);
    expect(normalizeQuarterRotation(359)).toBe(0);
    expect(rotationDistance(350, 10)).toBe(20);
    expect(isRotationAligned(358, 0, 3)).toBe(true);
  });

  it('checks snap position and rotation without image dependent state', () => {
    const currentPosition = { x: 102, y: 96 };
    const targetPosition = { x: 100, y: 100 };
    expect(canSnapPiece({ currentPosition, targetPosition, positionTolerance: 5, currentRotation: 89, targetRotation: 90, rotationTolerance: 2 })).toBe(true);
    expect(getSnapPosition(currentPosition, targetPosition, 5)).toEqual(targetPosition);
    expect(getSnapPosition({ x: 120, y: 100 }, targetPosition, 5)).toEqual({ x: 120, y: 100 });
  });

  it('checks overlay alignment with opacity gates', () => {
    expect(
      isOverlayAligned({
        currentPosition: { x: 0, y: 0 },
        targetPosition: { x: 1, y: 1 },
        positionTolerance: 2,
        currentRotation: 0,
        targetRotation: 360,
        rotationTolerance: 1,
        opacity: 0.75,
        minOpacity: 0.5,
      }),
    ).toBe(true);
    expect(
      isOverlayAligned({
        currentPosition: { x: 0, y: 0 },
        targetPosition: { x: 1, y: 1 },
        positionTolerance: 2,
        opacity: 0.25,
        minOpacity: 0.5,
      }),
    ).toBe(false);
  });

  it('reorders immutable arrays and compares answers', () => {
    const order = ['a', 'b', 'c'];
    expect(moveArrayItem(order, 0, 2)).toEqual(['b', 'c', 'a']);
    expect(order).toEqual(['a', 'b', 'c']);
    expect(isCorrectOrder(['b', 'c', 'a'], ['b', 'c', 'a'])).toBe(true);
    expect(isCorrectOrder(['b', 'a', 'c'], ['b', 'c', 'a'])).toBe(false);
  });

  it('updates selection state predictably', () => {
    const selected = addSelection([], 'star-a');
    expect(addSelection(selected, 'star-a')).toEqual(['star-a']);
    expect(toggleSelection(selected, 'star-b', 2)).toEqual(['star-a', 'star-b']);
    expect(toggleSelection(['star-a', 'star-b'], 'star-c', 2)).toEqual(['star-a', 'star-b']);
    expect(removeSelection(['star-a', 'star-b'], 'star-a')).toEqual(['star-b']);
    expect(clearSelection<string>()).toEqual([]);
  });
});
