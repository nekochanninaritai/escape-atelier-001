import Phaser from 'phaser';
import { isCorrectMemoryRoute, memoryRouteAnswer } from '../../data/puzzles';
import type { PhaserPuzzleConfigFactory } from '../../../../engine/phaser/types';
import type { MemoryGlobeState } from '../../types';

const routeLabels: Record<string, string> = {
  library: '音楽室',
  garden: '温室',
  observatory: '天文台',
  study: '書斎',
};

export const createMemoryGlobePuzzleConfig: PhaserPuzzleConfigFactory<MemoryGlobeState> = ({ initialState, onComplete, onStateChange }) => {
  class MemoryGlobeScene extends Phaser.Scene {
    private selectedRouteIds = [...initialState.selectedRouteIds];

    create() {
      this.renderGlobe();
    }

    private renderGlobe() {
      this.children.removeAll();
      this.add.circle(360, 236, 132, 0x5f3d2b, 1).setStrokeStyle(5, 0xc6a15a);
      this.add.circle(320, 204, 7, 0xf6e7c8);
      this.add.circle(392, 188, 7, 0xf6e7c8);
      this.add.circle(430, 258, 7, 0xf6e7c8);
      this.add.circle(352, 294, 7, 0xf6e7c8);
      this.add.text(360, 62, '記憶の航路を順番に選ぶ', { color: '#f7ead2', fontSize: '26px' }).setOrigin(0.5);
      this.add.text(360, 398, this.selectedRouteIds.map((id) => routeLabels[id]).join(' -> ') || '未選択', { color: '#fff8e9', fontSize: '20px' }).setOrigin(0.5);
      memoryRouteAnswer.forEach((routeId, index) => {
        const x = 112 + index * 164;
        this.add.rectangle(x, 468, 132, 46, 0x3b261f, 1).setStrokeStyle(2, 0xb8924a).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.pick(routeId));
        this.add.text(x, 468, routeLabels[routeId], { color: '#fff8e9', fontSize: '20px' }).setOrigin(0.5);
      });
    }

    private pick(routeId: string) {
      const next = [...this.selectedRouteIds, routeId].slice(-memoryRouteAnswer.length);
      this.selectedRouteIds = next;
      const state = { ...initialState, selectedRouteIds: next };
      onStateChange(state);
      if (isCorrectMemoryRoute(next)) onComplete(state);
      else this.renderGlobe();
    }
  }

  return { scene: MemoryGlobeScene };
};
