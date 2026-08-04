import Phaser from 'phaser';
import type { PhaserPuzzleCallbacks, PhaserPuzzleConfigFactory } from '../../../../engine/phaser/types';
import type { WateringCanPuzzleState } from '../../types';

const pieces = [
  { id: 'piece-1', x: 250, y: 230, startX: 140, startY: 415, color: 0xd7b46a },
  { id: 'piece-2', x: 360, y: 225, startX: 340, startY: 415, color: 0x93b58f },
  { id: 'piece-3', x: 470, y: 250, startX: 540, startY: 415, color: 0xd88f5a },
];

export const createWateringCanPuzzleConfig: PhaserPuzzleConfigFactory<WateringCanPuzzleState> = (callbacks) => ({
  scene: new WateringCanScene(callbacks),
});

class WateringCanScene extends Phaser.Scene {
  private placed = new Set<string>();
  private callbacks: PhaserPuzzleCallbacks<WateringCanPuzzleState>;

  constructor(callbacks: PhaserPuzzleCallbacks<WateringCanPuzzleState>) {
    super('WateringCanPuzzle');
    this.callbacks = callbacks;
    this.placed = new Set(callbacks.initialState.placedPieceIds);
  }

  create() {
    this.add.text(360, 24, '輪郭へ破片を重ねる', { color: '#fff8e9', fontSize: '24px' }).setOrigin(0.5);
    this.add.ellipse(360, 235, 285, 160).setStrokeStyle(4, 0xd7b46a, 0.72);
    this.add.rectangle(510, 205, 90, 46).setStrokeStyle(4, 0xd7b46a, 0.72);
    this.add.arc(258, 224, 60, 70, 290).setStrokeStyle(4, 0xd7b46a, 0.72);

    pieces.forEach((piece) => {
      const isPlaced = this.placed.has(piece.id);
      const shape = this.add.rectangle(isPlaced ? piece.x : piece.startX, isPlaced ? piece.y : piece.startY, 100, 72, piece.color, 0.95);
      shape.setStrokeStyle(3, 0xfff8e9, 0.9).setInteractive({ draggable: !isPlaced, useHandCursor: true });
      this.add.text(shape.x, shape.y, piece.id.replace('piece-', '破片'), { color: '#18251f', fontSize: '18px', fontStyle: 'bold' }).setOrigin(0.5);
      if (isPlaced) return;
      this.input.setDraggable(shape);
      shape.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        shape.setPosition(dragX, dragY);
      });
      shape.on('dragend', () => {
        const distance = Phaser.Math.Distance.Between(shape.x, shape.y, piece.x, piece.y);
        if (distance < 92) {
          shape.setPosition(piece.x, piece.y).disableInteractive();
          this.placed.add(piece.id);
          this.emitState();
          if (this.placed.size === pieces.length) this.complete();
          return;
        }
        this.tweens.add({ targets: shape, x: piece.startX, y: piece.startY, duration: this.callbacks.reducedMotion ? 0 : 180 });
      });
      shape.on('pointerdown', () => {
        const target = pieces.find((entry) => entry.id === piece.id);
        if (!target) return;
      });
    });
  }

  private emitState() {
    this.callbacks.onStateChange({ placedPieceIds: [...this.placed] });
  }

  private complete() {
    this.add.circle(360, 240, 16, 0xfff3b0, 0.95);
    this.tweens.add({
      targets: this.add.circle(360, 240, 40, 0xfff3b0, 0.26),
      scale: 5,
      alpha: 0,
      duration: this.callbacks.reducedMotion ? 0 : 650,
      onComplete: () => this.callbacks.onComplete({ placedPieceIds: [...this.placed] }),
    });
  }
}
