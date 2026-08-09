import Phaser from 'phaser';
import { GLOBE_DIRECTION_SEQUENCE, globeDirectionAnswer, isGlobeSequenceCorrect } from '../../data/puzzles';
import type { PhaserPuzzleConfigFactory } from '../../../../engine/phaser/types';
import type { MemoryGlobeState } from '../../types';

const directionLabels: Record<string, string> = {
  north: 'N',
  east: 'E',
  south: 'S',
  west: 'W',
};

const directionPositions: Record<string, { x: number; y: number }> = {
  north: { x: 360, y: 124 },
  east: { x: 520, y: 250 },
  south: { x: 360, y: 376 },
  west: { x: 200, y: 250 },
};

export const createMemoryGlobePuzzleConfig: PhaserPuzzleConfigFactory<MemoryGlobeState> = ({ initialState, onComplete, onStateChange }) => {
  class MemoryGlobeScene extends Phaser.Scene {
    private state: MemoryGlobeState = { ...initialState, selectedRouteIds: [...initialState.selectedRouteIds] };

    create() {
      this.render();
    }

    private render() {
      this.children.removeAll();
      this.add.text(360, 42, '地球儀の航路', { color: '#f7ead2', fontSize: '26px' }).setOrigin(0.5);
      this.add.text(360, 72, '手紙の方角を、回数ぶん順番に入力してください。', { color: '#d8c090', fontSize: '18px' }).setOrigin(0.5);

      this.add.circle(360, 250, 116, 0x5f3d2b, 1).setStrokeStyle(5, 0xc6a15a);
      this.add.circle(318, 220, 8, 0xf6e7c8);
      this.add.circle(388, 196, 7, 0xf6e7c8);
      this.add.circle(430, 270, 7, 0xf6e7c8);
      this.add.circle(344, 304, 8, 0xf6e7c8);
      this.add.text(360, 250, this.state.selectedRouteIds.map((id) => directionLabels[id]).join(' ') || '...', { color: '#fff8e9', fontSize: '24px' }).setOrigin(0.5);

      Object.entries(directionPositions).forEach(([direction, position]) => {
        this.add.rectangle(position.x, position.y, 78, 48, 0x3b261f, 1).setStrokeStyle(2, 0xb8924a).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.pick(direction));
        this.add.text(position.x, position.y, directionLabels[direction], { color: '#fff8e9', fontSize: '24px' }).setOrigin(0.5);
      });

      const clue = GLOBE_DIRECTION_SEQUENCE.map((entry) => `${directionLabels[entry.direction]} ${entry.count}`).join(' / ');
      this.add.text(360, 428, clue, { color: '#ead9b8', fontSize: '18px' }).setOrigin(0.5);
      this.add.rectangle(264, 486, 112, 42, 0x3b261f, 1).setStrokeStyle(2, 0xb8924a).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.reset());
      this.add.text(264, 486, 'リセット', { color: '#fff8e9', fontSize: '20px' }).setOrigin(0.5);
      this.add.rectangle(456, 486, 112, 42, 0x5f3d2b, 1).setStrokeStyle(2, 0xb8924a).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.check());
      this.add.text(456, 486, '確かめる', { color: '#fff8e9', fontSize: '20px' }).setOrigin(0.5);
    }

    private pick(direction: string) {
      const selectedRouteIds = [...this.state.selectedRouteIds, direction].slice(-globeDirectionAnswer.length);
      this.state = { ...this.state, positionId: direction, selectedRouteIds };
      this.emitState();
      if (isGlobeSequenceCorrect(selectedRouteIds)) onComplete(this.state);
      else this.render();
    }

    private reset() {
      this.state = { ...this.state, positionId: 'closed', selectedRouteIds: [] };
      this.emitState();
      this.render();
    }

    private check() {
      this.emitState();
      if (isGlobeSequenceCorrect(this.state.selectedRouteIds)) onComplete(this.state);
    }

    private emitState() {
      onStateChange({ ...this.state, selectedRouteIds: [...this.state.selectedRouteIds] });
    }
  }

  return { scene: MemoryGlobeScene };
};
