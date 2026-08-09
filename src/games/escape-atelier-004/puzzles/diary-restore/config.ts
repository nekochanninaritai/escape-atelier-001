import Phaser from 'phaser';
import { diaryPageOrder, isCorrectDiaryOrder } from '../../data/puzzles';
import type { PhaserPuzzleConfigFactory } from '../../../../engine/phaser/types';
import type { DiaryRestoreState } from '../../types';

const labelMap: Record<string, string> = {
  spring: '春',
  summer: '夏',
  autumn: '秋',
  winter: '冬',
};

export const createDiaryRestorePuzzleConfig: PhaserPuzzleConfigFactory<DiaryRestoreState> = ({ initialState, onComplete, onStateChange }) => {
  class DiaryRestoreScene extends Phaser.Scene {
    private pageOrder = [...initialState.pageOrder];
    private selectedIndex: number | null = null;

    create() {
      this.renderPages();
    }

    private renderPages() {
      this.children.removeAll();
      this.add.text(360, 62, '日記を季節の順番へ戻す', { color: '#f7ead2', fontSize: '26px' }).setOrigin(0.5);
      this.pageOrder.forEach((pageId, index) => {
        const x = 132 + index * 152;
        const isSelected = this.selectedIndex === index;
        const rect = this.add.rectangle(x, 240, 118, 168, isSelected ? 0x7a1f24 : 0xead9b8, 0.92).setStrokeStyle(3, 0xb8924a);
        rect.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.selectPage(index));
        this.add.text(x, 236, labelMap[pageId] ?? pageId, { color: isSelected ? '#fff8e9' : '#3a221c', fontSize: '30px' }).setOrigin(0.5);
      });
      this.add.text(360, 448, '2枚選ぶと入れ替わります', { color: '#d8c090', fontSize: '20px' }).setOrigin(0.5);
      this.add.rectangle(360, 496, 190, 44, 0x3b261f, 1).setStrokeStyle(2, 0xb8924a).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.check());
      this.add.text(360, 496, '復元する', { color: '#fff8e9', fontSize: '22px' }).setOrigin(0.5);
    }

    private selectPage(index: number) {
      if (this.selectedIndex === null) {
        this.selectedIndex = index;
      } else {
        [this.pageOrder[this.selectedIndex], this.pageOrder[index]] = [this.pageOrder[index], this.pageOrder[this.selectedIndex]];
        this.selectedIndex = null;
        onStateChange({ ...initialState, pageOrder: [...this.pageOrder] });
      }
      this.renderPages();
    }

    private check() {
      const state = { ...initialState, pageOrder: [...this.pageOrder] };
      onStateChange(state);
      if (isCorrectDiaryOrder(this.pageOrder)) onComplete(state);
    }
  }

  return { scene: DiaryRestoreScene };
};

export const validDiaryPageIds = diaryPageOrder;
