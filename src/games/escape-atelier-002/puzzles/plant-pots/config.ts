import Phaser from 'phaser';
import type { PhaserPuzzleCallbacks, PhaserPuzzleConfigFactory } from '../../../../engine/phaser/types';
import { correctPotOrder, isCorrectPotOrder } from '../../data/puzzles';
import type { PlantPotsPuzzleState } from '../../types';

const potLabels: Record<string, string> = {
  'pot-short': '低い葉',
  'pot-round': '丸い葉',
  'pot-long': '細長い葉',
  'pot-flower': '花の鉢',
};

export const createPlantPotsPuzzleConfig: PhaserPuzzleConfigFactory<PlantPotsPuzzleState> = (callbacks) => ({
  scene: new PlantPotsScene(callbacks),
});

class PlantPotsScene extends Phaser.Scene {
  private order: string[];
  private callbacks: PhaserPuzzleCallbacks<PlantPotsPuzzleState>;
  private nodes: Phaser.GameObjects.Container[] = [];

  constructor(callbacks: PhaserPuzzleCallbacks<PlantPotsPuzzleState>) {
    super('PlantPotsPuzzle');
    this.callbacks = callbacks;
    this.order = [...callbacks.initialState.order];
  }

  create() {
    this.add.text(360, 24, '鉢を左右に入れ替える', { color: '#fff8e9', fontSize: '24px' }).setOrigin(0.5);
    this.renderPots();
    this.add
      .text(250, 470, '確認', { color: '#17231d', backgroundColor: '#d7b46a', padding: { x: 24, y: 12 }, fontSize: '22px' })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        if (isCorrectPotOrder(this.order, correctPotOrder)) this.callbacks.onComplete({ order: this.order });
        else this.add.text(360, 420, 'まだ並びが違うようだ。', { color: '#fff8e9', fontSize: '20px' }).setOrigin(0.5).setDepth(5);
      });
    this.add
      .text(405, 470, 'リセット', { color: '#fff8e9', backgroundColor: '#4b3427', padding: { x: 18, y: 12 }, fontSize: '22px' })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.order = ['pot-round', 'pot-long', 'pot-short', 'pot-flower'];
        this.callbacks.onStateChange({ order: this.order });
        this.renderPots();
      });
  }

  private renderPots() {
    this.nodes.forEach((node) => node.destroy());
    this.nodes = [];
    this.order.forEach((id, index) => {
      const x = 135 + index * 150;
      const node = this.add.container(x, 230).setSize(118, 170).setInteractive({ draggable: true, useHandCursor: true });
      const color = id === 'pot-flower' ? 0xb56b64 : id === 'pot-long' ? 0x6f97a8 : id === 'pot-round' ? 0x8fb889 : 0xd7b46a;
      node.add([this.add.rectangle(0, 62, 92, 74, 0x7a4e36), this.add.ellipse(0, 20, 82, id === 'pot-short' ? 50 : 95, color), this.add.text(0, 120, potLabels[id], { color: '#fff8e9', fontSize: '18px' }).setOrigin(0.5)]);
      this.input.setDraggable(node);
      node.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number) => node.setX(Phaser.Math.Clamp(dragX, 80, 640)));
      node.on('dragend', () => {
        const from = this.order.indexOf(id);
        const to = Phaser.Math.Clamp(Math.round((node.x - 135) / 150), 0, this.order.length - 1);
        this.order.splice(from, 1);
        this.order.splice(to, 0, id);
        this.callbacks.onStateChange({ order: this.order });
        this.renderPots();
      });
      this.nodes.push(node);
    });
  }
}
