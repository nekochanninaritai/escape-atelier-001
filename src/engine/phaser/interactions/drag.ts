import Phaser from 'phaser';
import type { PuzzlePoint } from '../core/types';

type DraggableObject = Phaser.GameObjects.GameObject &
  Phaser.GameObjects.Components.Transform &
  Phaser.GameObjects.Components.Depth & {
    setInteractive: (shape?: Phaser.Types.Input.InputConfiguration) => DraggableObject;
  };

export type DragOptions = {
  bounds?: Phaser.Geom.Rectangle;
  depthWhileDragging?: number;
  onDrag?: (position: PuzzlePoint) => void;
  onDragEnd?: (position: PuzzlePoint) => void;
};

export function makeDraggable(scene: Phaser.Scene, gameObject: DraggableObject, options: DragOptions = {}): void {
  const initialDepth = gameObject.depth;
  gameObject.setInteractive({ draggable: true });
  scene.input.setDraggable(gameObject);

  gameObject.on('dragstart', () => {
    if (options.depthWhileDragging !== undefined) gameObject.setDepth(options.depthWhileDragging);
  });

  gameObject.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
    const next = clampToBounds({ x: dragX, y: dragY }, options.bounds);
    gameObject.setPosition(next.x, next.y);
    options.onDrag?.(next);
  });

  gameObject.on('dragend', () => {
    gameObject.setDepth(initialDepth);
    options.onDragEnd?.({ x: gameObject.x, y: gameObject.y });
  });
}

function clampToBounds(point: PuzzlePoint, bounds?: Phaser.Geom.Rectangle): PuzzlePoint {
  if (!bounds) return point;
  return {
    x: Phaser.Math.Clamp(point.x, bounds.left, bounds.right),
    y: Phaser.Math.Clamp(point.y, bounds.top, bounds.bottom),
  };
}
