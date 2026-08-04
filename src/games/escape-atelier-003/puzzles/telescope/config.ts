import Phaser from 'phaser';
import type { PhaserPuzzleCallbacks, PhaserPuzzleConfigFactory } from '../../../../engine/phaser/types';
import { addObservedStar, isRequiredStar, requiredObservedStarIds, telescopeStars } from '../../data/stars';
import type { TelescopePuzzleState } from '../../types';

export const createTelescopePuzzleConfig: PhaserPuzzleConfigFactory<TelescopePuzzleState> = (callbacks) => ({
  scene: new TelescopeScene(callbacks),
  backgroundColor: '#060b1f',
});

class TelescopeScene extends Phaser.Scene {
  private callbacks: PhaserPuzzleCallbacks<TelescopePuzzleState>;
  private state: TelescopePuzzleState;
  private sky?: Phaser.GameObjects.Container;
  private status?: Phaser.GameObjects.Text;

  constructor(callbacks: PhaserPuzzleCallbacks<TelescopePuzzleState>) {
    super('TelescopePuzzle');
    this.callbacks = callbacks;
    this.state = callbacks.initialState;
  }

  create() {
    this.add.text(360, 28, '照準に星を合わせて観測する', { color: '#fff6dc', fontSize: '22px' }).setOrigin(0.5);
    this.sky = this.add.container(0, 0);
    telescopeStars.forEach((star) => {
      const circle = this.add.circle(star.x + this.state.viewportX, star.y + this.state.viewportY, star.required ? 6 : 4, star.required ? 0xfff1a8 : 0xdfe8ff, star.glowStrength);
      this.sky?.add(circle);
      if (star.required && !this.callbacks.reducedMotion) {
        this.tweens.add({ targets: circle, alpha: 0.55, yoyo: true, repeat: -1, duration: 1200 + star.x });
      }
    });
    this.add.circle(360, 250, 172).setStrokeStyle(8, 0x10182f, 1);
    this.add.line(360, 250, -22, 0, 22, 0, 0xfff6dc, 0.8);
    this.add.line(360, 250, 0, -22, 0, 22, 0xfff6dc, 0.8);
    this.status = this.add.text(360, 430, this.statusText(), { color: '#dfe8ff', fontSize: '18px' }).setOrigin(0.5);
    this.addButton(250, 480, '観測', () => this.observe());
    this.addButton(470, 480, 'リセット', () => this.moveTo(0, 0));
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!pointer.isDown) return;
      this.moveTo(this.state.viewportX + pointer.velocity.x * 0.03, this.state.viewportY + pointer.velocity.y * 0.03);
    });
    this.cursorButton(85, 250, '←', -35, 0);
    this.cursorButton(635, 250, '→', 35, 0);
    this.cursorButton(360, 78, '↑', 0, -35);
    this.cursorButton(360, 395, '↓', 0, 35);
  }

  private addButton(x: number, y: number, text: string, callback: () => void) {
    const rect = this.add.rectangle(x, y, 150, 42, 0x24365f, 0.96).setStrokeStyle(2, 0xd6b66d, 0.9).setInteractive({ useHandCursor: true });
    this.add.text(x, y, text, { color: '#fff6dc', fontSize: '20px' }).setOrigin(0.5);
    rect.on('pointerdown', callback);
  }

  private cursorButton(x: number, y: number, text: string, dx: number, dy: number) {
    const rect = this.add.circle(x, y, 24, 0x24365f, 0.9).setStrokeStyle(2, 0xd6b66d, 0.9).setInteractive({ useHandCursor: true });
    this.add.text(x, y, text, { color: '#fff6dc', fontSize: '20px' }).setOrigin(0.5);
    rect.on('pointerdown', () => this.moveTo(this.state.viewportX + dx, this.state.viewportY + dy));
  }

  private moveTo(x: number, y: number) {
    const nextX = Phaser.Math.Clamp(x, -320, 320);
    const nextY = Phaser.Math.Clamp(y, -240, 240);
    const dx = nextX - this.state.viewportX;
    const dy = nextY - this.state.viewportY;
    this.state = { ...this.state, viewportX: nextX, viewportY: nextY };
    this.sky?.each((child: Phaser.GameObjects.GameObject) => {
      if (!('x' in child) || !('y' in child)) return;
      const gameObject = child as Phaser.GameObjects.Shape;
      gameObject.x += dx;
      gameObject.y += dy;
    });
    this.callbacks.onStateChange(this.state);
  }

  private observe() {
    const star = telescopeStars.find((entry) => Phaser.Math.Distance.Between(entry.x + this.state.viewportX, entry.y + this.state.viewportY, 360, 250) < 34);
    if (!star || !isRequiredStar(star.id)) {
      this.flash('この星ではないようだ。');
      return;
    }
    this.state = { ...this.state, observedStarIds: addObservedStar(this.state.observedStarIds, star.id) };
    this.status?.setText(this.statusText());
    this.callbacks.onStateChange(this.state);
    if (requiredObservedStarIds.every((id) => this.state.observedStarIds.includes(id))) this.callbacks.onComplete(this.state);
  }

  private statusText() {
    return `観測済み ${this.state.observedStarIds.length} / ${requiredObservedStarIds.length}`;
  }

  private flash(text: string) {
    const message = this.add.text(360, 388, text, { color: '#ffd6d6', fontSize: '20px' }).setOrigin(0.5);
    this.tweens.add({ targets: message, alpha: 0, duration: this.callbacks.reducedMotion ? 0 : 900, onComplete: () => message.destroy() });
  }
}
