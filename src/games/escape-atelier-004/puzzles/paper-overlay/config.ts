import Phaser from 'phaser';
import { BOOK_CLUE, isPaperAligned } from '../../data/puzzles';
import type { PhaserPuzzleConfigFactory } from '../../../../engine/phaser/types';
import type { PaperOverlayState } from '../../types';

export const createPaperOverlayPuzzleConfig: PhaserPuzzleConfigFactory<PaperOverlayState> = ({ initialState, onComplete, onStateChange }) => {
  class PaperOverlayScene extends Phaser.Scene {
    private state = { ...initialState };

    create() {
      this.renderOverlay();
    }

    private renderOverlay() {
      this.children.removeAll();
      this.add.text(360, 42, '半透明紙の重ね合わせ', { color: '#f7ead2', fontSize: '25px' }).setOrigin(0.5);
      this.add.text(360, 72, '紙を動かし、赤い印を欠けた文字に重ねてください。', { color: '#d8c090', fontSize: '17px' }).setOrigin(0.5);
      this.add.rectangle(360, 250, 330, 210, 0xead9b8, 0.95).setStrokeStyle(3, 0x7a1f24);
      this.add.text(360, 196, 'BOOK _', { color: '#3a221c', fontSize: '28px' }).setOrigin(0.5);
      this.add.text(360, 292, 'PAGE _3', { color: '#3a221c', fontSize: '28px' }).setOrigin(0.5);

      const paperX = 360 + this.state.paperOffsetX;
      const paperY = 250 + this.state.paperOffsetY;
      const paper = this.add.rectangle(paperX, paperY, 330, 110, 0xf6efe0, 0.42).setStrokeStyle(3, 0xc54b4f);
      paper.setRotation(Phaser.Math.DegToRad(this.state.rotation));
      this.add.text(paperX, paperY - 22, `    ${BOOK_CLUE.bookNumber}`, { color: '#7a1f24', fontSize: '28px' }).setOrigin(0.5).setRotation(Phaser.Math.DegToRad(this.state.rotation));
      this.add.text(paperX, paperY + 28, '    2 ', { color: '#7a1f24', fontSize: '28px' }).setOrigin(0.5).setRotation(Phaser.Math.DegToRad(this.state.rotation));
      this.addControls();
    }

    private addControls() {
      const controls = [
        ['左', -12, 0, 0, 194, 452],
        ['右', 12, 0, 0, 526, 452],
        ['上', 0, -12, 0, 360, 408],
        ['下', 0, 12, 0, 360, 496],
        ['回転', 0, 0, 6, 526, 496],
      ] as const;
      controls.forEach(([label, dx, dy, dr, x, y]) => {
        this.add.rectangle(x, y, 96, 42, 0x3b261f, 1).setStrokeStyle(2, 0xb8924a).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.move(dx, dy, dr));
        this.add.text(x, y, label, { color: '#fff8e9', fontSize: '20px' }).setOrigin(0.5);
      });
      this.add.rectangle(194, 496, 116, 42, 0x5f3d2b, 1).setStrokeStyle(2, 0xb8924a).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.check());
      this.add.text(194, 496, '読む', { color: '#fff8e9', fontSize: '20px' }).setOrigin(0.5);
    }

    private move(dx: number, dy: number, dr: number) {
      const paperOffsetX = Phaser.Math.Clamp(this.state.paperOffsetX + dx, -144, 144);
      const paperOffsetY = Phaser.Math.Clamp(this.state.paperOffsetY + dy, -144, 144);
      const rotation = Phaser.Math.Clamp(this.state.rotation + dr, -42, 42);
      this.state = {
        ...this.state,
        paperOffsetX,
        paperOffsetY,
        x: paperOffsetX,
        y: paperOffsetY,
        rotation,
        aligned: isPaperAligned(paperOffsetX, paperOffsetY, rotation),
      };
      onStateChange(this.state);
      this.renderOverlay();
    }

    private check() {
      onStateChange(this.state);
      if (isPaperAligned(this.state.paperOffsetX, this.state.paperOffsetY, this.state.rotation)) onComplete({ ...this.state, aligned: true });
    }
  }

  return { scene: PaperOverlayScene };
};
