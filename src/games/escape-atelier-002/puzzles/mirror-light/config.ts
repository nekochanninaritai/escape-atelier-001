import Phaser from 'phaser';
import type { PhaserPuzzleCallbacks, PhaserPuzzleConfigFactory } from '../../../../engine/phaser/types';
import { areMirrorAnglesSolved, mirrorDefinitions } from '../../data/puzzles';
import type { MirrorLightPuzzleState } from '../../types';

const angleSteps = [0, 45, 90, 135];

export const createMirrorLightPuzzleConfig: PhaserPuzzleConfigFactory<MirrorLightPuzzleState> = (callbacks) => ({
  scene: new MirrorLightScene(callbacks),
});

class MirrorLightScene extends Phaser.Scene {
  private angles: Record<string, number>;
  private callbacks: PhaserPuzzleCallbacks<MirrorLightPuzzleState>;
  private light?: Phaser.GameObjects.Graphics;

  constructor(callbacks: PhaserPuzzleCallbacks<MirrorLightPuzzleState>) {
    super('MirrorLightPuzzle');
    this.callbacks = callbacks;
    this.angles = { ...callbacks.initialState.angles };
  }

  create() {
    this.add.text(360, 24, '鏡をタップして光を大樹へ導く', { color: '#fff8e9', fontSize: '22px' }).setOrigin(0.5);
    this.add.circle(72, 78, 24, 0xf2b366).setStrokeStyle(3, 0xfff8e9);
    this.add.text(72, 116, '夕日', { color: '#fff8e9', fontSize: '16px' }).setOrigin(0.5);
    this.add.circle(645, 350, 30, 0x93b58f).setStrokeStyle(3, 0xd7b46a);
    this.add.text(645, 394, '大樹', { color: '#fff8e9', fontSize: '16px' }).setOrigin(0.5);
    mirrorDefinitions.forEach((mirror, index) => this.createMirror(mirror.id, 210 + index * 150, index === 1 ? 270 : 180, mirror.label));
    this.drawLight();
  }

  private createMirror(id: string, x: number, y: number, label: string) {
    const group = this.add.container(x, y).setSize(92, 92).setInteractive({ useHandCursor: true });
    const plate = this.add.rectangle(0, 0, 86, 14, 0xdfe9e6).setStrokeStyle(3, 0xd7b46a);
    const text = this.add.text(0, 38, `${label}\n${this.angles[id]}度`, { color: '#fff8e9', fontSize: '15px', align: 'center' }).setOrigin(0.5);
    plate.setAngle(this.angles[id]);
    group.add([plate, text]);
    group.on('pointerdown', () => {
      const current = this.angles[id] ?? 0;
      this.angles[id] = angleSteps[(angleSteps.indexOf(current) + 1) % angleSteps.length];
      plate.setAngle(this.angles[id]);
      text.setText(`${label}\n${this.angles[id]}度`);
      this.callbacks.onStateChange({ angles: this.angles });
      this.drawLight();
      if (areMirrorAnglesSolved(this.angles)) {
        this.add.text(360, 455, '光が大樹へ届いた。', { color: '#fff8e9', backgroundColor: '#355343', padding: { x: 16, y: 10 }, fontSize: '22px' }).setOrigin(0.5);
        this.time.delayedCall(this.callbacks.reducedMotion ? 0 : 450, () => this.callbacks.onComplete({ angles: this.angles }));
      }
    });
  }

  private drawLight() {
    this.light?.destroy();
    this.light = this.add.graphics();
    this.light.lineStyle(8, 0xffdc83, 0.45);
    this.light.beginPath();
    this.light.moveTo(72, 78);
    if (this.angles['mirror-a'] === 45) this.light.lineTo(210, 180);
    if (this.angles['mirror-a'] === 45 && this.angles['mirror-b'] === 135) this.light.lineTo(360, 270);
    if (areMirrorAnglesSolved(this.angles)) this.light.lineTo(510, 180).lineTo(645, 350);
    this.light.strokePath();
  }
}
