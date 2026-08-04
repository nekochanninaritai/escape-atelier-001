import Phaser from 'phaser';
import type { PhaserPuzzleCallbacks, PhaserPuzzleConfigFactory } from '../../../../engine/phaser/types';
import { correctConstellationOrder, isCorrectConstellationOrder, telescopeStars } from '../../data/stars';
import type { ConstellationLinesPuzzleState } from '../../types';

export const createConstellationLinesPuzzleConfig: PhaserPuzzleConfigFactory<ConstellationLinesPuzzleState> = (callbacks) => ({
  scene: new ConstellationLinesScene(callbacks),
  backgroundColor: '#10172f',
});

class ConstellationLinesScene extends Phaser.Scene {
  private callbacks: PhaserPuzzleCallbacks<ConstellationLinesPuzzleState>;
  private selectedStarIds: string[];
  private graphics?: Phaser.GameObjects.Graphics;
  private marks: Phaser.GameObjects.Text[] = [];

  constructor(callbacks: PhaserPuzzleCallbacks<ConstellationLinesPuzzleState>) {
    super('ConstellationLinesPuzzle');
    this.callbacks = callbacks;
    this.selectedStarIds = [...callbacks.initialState.selectedStarIds];
  }

  create() {
    this.add.text(360, 28, '観測した星を順番に結ぶ', { color: '#fff6dc', fontSize: '22px' }).setOrigin(0.5);
    this.graphics = this.add.graphics();
    telescopeStars.forEach((star) => {
      const x = star.x;
      const y = star.y + 24;
      const hit = this.add.circle(x, y, 22, 0xfff1a8, star.required ? 0.88 : 0.42).setInteractive({ useHandCursor: true });
      this.add.text(x, y + 30, star.name, { color: '#dfe8ff', fontSize: '14px' }).setOrigin(0.5);
      hit.on('pointerdown', () => this.select(star.id));
    });
    this.addButton(230, 480, '一つ戻す', () => {
      this.selectedStarIds = this.selectedStarIds.slice(0, -1);
      this.emit();
    });
    this.addButton(360, 480, '全消去', () => {
      this.selectedStarIds = [];
      this.emit();
    });
    this.addButton(510, 480, '確認', () => this.check());
    this.draw();
  }

  private addButton(x: number, y: number, text: string, callback: () => void) {
    const rect = this.add.rectangle(x, y, 116, 42, 0x24365f, 0.96).setStrokeStyle(2, 0xd6b66d, 0.9).setInteractive({ useHandCursor: true });
    this.add.text(x, y, text, { color: '#fff6dc', fontSize: '18px' }).setOrigin(0.5);
    rect.on('pointerdown', callback);
  }

  private select(starId: string) {
    if (this.selectedStarIds.includes(starId) || this.selectedStarIds.length >= correctConstellationOrder.length) return;
    this.selectedStarIds = [...this.selectedStarIds, starId];
    this.emit();
  }

  private emit() {
    this.callbacks.onStateChange({ selectedStarIds: this.selectedStarIds });
    this.draw();
  }

  private draw() {
    this.graphics?.clear();
    this.graphics?.lineStyle(4, 0xd6b66d, 0.9);
    const points = this.selectedStarIds.map((id) => telescopeStars.find((star) => star.id === id)).filter((star): star is NonNullable<typeof star> => Boolean(star));
    for (let index = 1; index < points.length; index += 1) {
      this.graphics?.lineBetween(points[index - 1].x, points[index - 1].y + 24, points[index].x, points[index].y + 24);
    }
    this.marks.forEach((mark) => mark.destroy());
    this.marks = points.map((star, index) => this.add.text(star.x, star.y - 8, `${index + 1}`, { color: '#10172f', backgroundColor: '#fff1a8', fontSize: '16px' }).setOrigin(0.5));
  }

  private check() {
    if (!isCorrectConstellationOrder(this.selectedStarIds)) {
      const message = this.add.text(360, 420, '結ぶ順番が違うようだ。', { color: '#ffd6d6', fontSize: '20px' }).setOrigin(0.5);
      this.tweens.add({ targets: message, alpha: 0, duration: this.callbacks.reducedMotion ? 0 : 900, onComplete: () => message.destroy() });
      return;
    }
    const glow = this.add.rectangle(360, 260, 560, 280, 0xffe6a3, 0.16);
    this.tweens.add({ targets: glow, alpha: 0, duration: this.callbacks.reducedMotion ? 0 : 650, onComplete: () => this.callbacks.onComplete({ selectedStarIds: this.selectedStarIds }) });
  }
}
