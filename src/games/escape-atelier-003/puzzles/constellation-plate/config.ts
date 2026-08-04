import Phaser from 'phaser';
import type { PhaserPuzzleCallbacks, PhaserPuzzleConfigFactory } from '../../../../engine/phaser/types';
import { isCorrectPlatePiece, normalizePlateRotation, plateTargets } from '../../data/puzzles';
import type { ConstellationPlatePuzzleState } from '../../types';

const pieces = [
  { id: 'piece1', label: 'I', slotId: 'left', x: 255, y: 270, startX: 150, startY: 420, color: 0xb89455 },
  { id: 'piece2', label: 'II', slotId: 'top', x: 360, y: 190, startX: 360, startY: 420, color: 0xc8ccd6 },
  { id: 'piece3', label: 'III', slotId: 'right', x: 465, y: 270, startX: 570, startY: 420, color: 0xd4a95f },
] as const;

export const createConstellationPlatePuzzleConfig: PhaserPuzzleConfigFactory<ConstellationPlatePuzzleState> = (callbacks) => ({
  scene: new ConstellationPlateScene(callbacks),
  backgroundColor: '#10172f',
});

class ConstellationPlateScene extends Phaser.Scene {
  private callbacks: PhaserPuzzleCallbacks<ConstellationPlatePuzzleState>;
  private state: ConstellationPlatePuzzleState;

  constructor(callbacks: PhaserPuzzleCallbacks<ConstellationPlatePuzzleState>) {
    super('ConstellationPlatePuzzle');
    this.callbacks = callbacks;
    this.state = callbacks.initialState;
  }

  create() {
    this.add.text(360, 28, '破片を置き、90度ずつ回転させる', { color: '#fff6dc', fontSize: '22px' }).setOrigin(0.5);
    this.add.circle(360, 250, 130).setStrokeStyle(4, 0xd6b66d, 0.85);
    this.add.line(360, 250, -100, 0, 100, 0, 0xc8ccd6, 0.5);
    this.add.line(360, 250, 0, -100, 0, 100, 0xc8ccd6, 0.5);

    pieces.forEach((piece) => {
      const current = this.state.pieces[piece.id];
      const target = plateTargets[piece.id];
      const isPlaced = current?.placed ?? false;
      const x = isPlaced ? piece.x : piece.startX;
      const y = isPlaced ? piece.y : piece.startY;
      const shape = this.add.rectangle(x, y, 94, 78, piece.color, 0.95).setStrokeStyle(3, 0xfff6dc, 0.9);
      shape.rotation = Phaser.Math.DegToRad(current?.rotation ?? 0);
      const label = this.add.text(x, y, piece.label, { color: '#11172b', fontSize: '22px', fontStyle: 'bold' }).setOrigin(0.5);
      label.rotation = shape.rotation;
      if (!isPlaced) {
        shape.setInteractive({ draggable: true, useHandCursor: true });
        this.input.setDraggable(shape);
      }
      shape.on('pointerdown', () => {
        if (this.state.pieces[piece.id].placed) return;
        const rotation = normalizePlateRotation(this.state.pieces[piece.id].rotation + 90);
        this.state = { pieces: { ...this.state.pieces, [piece.id]: { ...this.state.pieces[piece.id], rotation } } };
        shape.rotation = Phaser.Math.DegToRad(rotation);
        label.rotation = shape.rotation;
        this.emitState();
      });
      shape.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        shape.setPosition(dragX, dragY);
        label.setPosition(dragX, dragY);
      });
      shape.on('dragend', () => {
        const distance = Phaser.Math.Distance.Between(shape.x, shape.y, piece.x, piece.y);
        const slotId = distance < 90 ? piece.slotId : null;
        const rotation = this.state.pieces[piece.id].rotation;
        if (isCorrectPlatePiece(slotId, rotation, target.slotId, target.rotation)) {
          shape.setPosition(piece.x, piece.y).disableInteractive();
          label.setPosition(piece.x, piece.y);
          this.state = { pieces: { ...this.state.pieces, [piece.id]: { placed: true, rotation, slotId } } };
          this.emitState();
          if (Object.values(this.state.pieces).every((entry) => entry.placed)) this.complete();
          return;
        }
        this.state = { pieces: { ...this.state.pieces, [piece.id]: { ...this.state.pieces[piece.id], slotId: null } } };
        this.emitState();
        this.tweens.add({ targets: [shape, label], x: piece.startX, y: piece.startY, duration: this.callbacks.reducedMotion ? 0 : 180 });
      });
    });

    this.add.text(360, 492, 'タップで回転。正しい位置と角度で吸着します。', { color: '#dfe8ff', fontSize: '18px' }).setOrigin(0.5);
  }

  private emitState() {
    this.callbacks.onStateChange(this.state);
  }

  private complete() {
    const glow = this.add.circle(360, 250, 40, 0xffe6a3, 0.35);
    this.tweens.add({ targets: glow, scale: 5, alpha: 0, duration: this.callbacks.reducedMotion ? 0 : 650, onComplete: () => this.callbacks.onComplete(this.state) });
  }
}
