import Phaser from 'phaser';
import type { PhaserPuzzleCallbacks, PhaserPuzzleConfigFactory } from '../../../../engine/phaser/types';
import { globePositions, isCorrectGlobePosition } from '../../data/puzzles';
import type { GlobePosition } from '../../types';

type GlobeState = { positionId: GlobePosition };

const globePositionLabels: Record<GlobePosition, string> = {
  north: '北',
  east: '東',
  south: '南',
  west: '西',
  target: '天頂',
};

export const createCelestialGlobePuzzleConfig: PhaserPuzzleConfigFactory<GlobeState> = (callbacks) => ({
  scene: new CelestialGlobeScene(callbacks),
  backgroundColor: '#10172f',
});

class CelestialGlobeScene extends Phaser.Scene {
  private callbacks: PhaserPuzzleCallbacks<GlobeState>;
  private positionId: GlobePosition;
  private label?: Phaser.GameObjects.Text;

  constructor(callbacks: PhaserPuzzleCallbacks<GlobeState>) {
    super('CelestialGlobePuzzle');
    this.callbacks = callbacks;
    this.positionId = callbacks.initialState.positionId;
  }

  create() {
    this.add.text(360, 30, '天球儀を固定位置へ合わせる', { color: '#fff6dc', fontSize: '22px' }).setOrigin(0.5);
    this.add.text(360, 64, '修復した星座盤の銀の印は「天頂」を指している', { color: '#dfe8ff', fontSize: '18px' }).setOrigin(0.5);
    this.add.circle(360, 235, 130, 0x1a2b54, 1).setStrokeStyle(5, 0xd6b66d, 0.9);
    for (let index = 0; index < 26; index += 1) {
      this.add.circle(250 + ((index * 53) % 230), 130 + ((index * 37) % 210), 2 + (index % 3), 0xf4f1d4, 0.65);
    }
    this.label = this.add.text(360, 235, globePositionLabels[this.positionId], { color: '#fff6dc', fontSize: '34px', fontStyle: 'bold' }).setOrigin(0.5);
    this.addButton(230, 445, '←', () => this.step(-1));
    this.addButton(490, 445, '→', () => this.step(1));
    this.addButton(360, 445, '確認', () => this.check());
    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (Math.abs(pointer.upX - pointer.downX) > 55) this.step(pointer.upX > pointer.downX ? 1 : -1);
    });
  }

  private addButton(x: number, y: number, text: string, callback: () => void) {
    const rect = this.add.rectangle(x, y, 118, 48, 0x24365f, 0.96).setStrokeStyle(2, 0xd6b66d, 0.9).setInteractive({ useHandCursor: true });
    this.add.text(x, y, text, { color: '#fff6dc', fontSize: '22px' }).setOrigin(0.5);
    rect.on('pointerdown', callback);
  }

  private step(delta: number) {
    const index = globePositions.indexOf(this.positionId);
    this.positionId = globePositions[(index + delta + globePositions.length) % globePositions.length];
    this.label?.setText(globePositionLabels[this.positionId]);
    this.callbacks.onStateChange({ positionId: this.positionId });
  }

  private check() {
    if (!isCorrectGlobePosition(this.positionId)) {
      this.add.text(360, 390, 'まだ星の位置が合わない。', { color: '#ffd6d6', fontSize: '20px' }).setOrigin(0.5).setAlpha(0.9);
      return;
    }
    const glow = this.add.circle(360, 235, 52, 0xffe6a3, 0.35);
    this.tweens.add({ targets: glow, scale: 4, alpha: 0, duration: this.callbacks.reducedMotion ? 0 : 600, onComplete: () => this.callbacks.onComplete({ positionId: this.positionId }) });
  }
}
