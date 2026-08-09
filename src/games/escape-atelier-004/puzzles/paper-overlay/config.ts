import Phaser from 'phaser';
import { isPaperAligned } from '../../data/puzzles';
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
      this.add.text(360, 54, '半透明の紙を手紙へ重ねる', { color: '#f7ead2', fontSize: '25px' }).setOrigin(0.5);
      this.add.rectangle(360, 252, 330, 210, 0xead9b8, 0.95).setStrokeStyle(3, 0x7a1f24);
      this.add.text(360, 210, 'Dear A.', { color: '#3a221c', fontSize: '26px' }).setOrigin(0.5);
      this.add.text(360, 286, 'R _ M _ M B _ R', { color: '#3a221c', fontSize: '30px' }).setOrigin(0.5);
      const paper = this.add.rectangle(360 + this.state.paperOffsetX, 252 + this.state.paperOffsetY, 330, 110, 0xf6efe0, 0.42).setStrokeStyle(3, 0xc54b4f);
      paper.setRotation(Phaser.Math.DegToRad(this.state.rotation));
      this.add.text(360 + this.state.paperOffsetX, 252 + this.state.paperOffsetY, '  E   E   E ', { color: '#7a1f24', fontSize: '28px' }).setOrigin(0.5).setRotation(Phaser.Math.DegToRad(this.state.rotation));
      this.addControls();
    }

    private addControls() {
      const controls = [
        ['左', -12, 0, 0, 194],
        ['右', 12, 0, 0, 526],
        ['上', 0, -12, 0, 360],
        ['下', 0, 12, 0, 360],
        ['回転', 0, 0, 6, 526],
      ] as const;
      controls.forEach(([label, dx, dy, dr, x], index) => {
        const y = index === 2 ? 408 : index === 3 ? 496 : 452;
        this.add.rectangle(x, y, 96, 42, 0x3b261f, 1).setStrokeStyle(2, 0xb8924a).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.move(dx, dy, dr));
        this.add.text(x, y, label, { color: '#fff8e9', fontSize: '20px' }).setOrigin(0.5);
      });
      this.add.rectangle(194, 496, 116, 42, 0x5f3d2b, 1).setStrokeStyle(2, 0xb8924a).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.check());
      this.add.text(194, 496, '読む', { color: '#fff8e9', fontSize: '20px' }).setOrigin(0.5);
    }

    private move(dx: number, dy: number, dr: number) {
      this.state = {
        paperOffsetX: Phaser.Math.Clamp(this.state.paperOffsetX + dx, -144, 144),
        paperOffsetY: Phaser.Math.Clamp(this.state.paperOffsetY + dy, -144, 144),
        rotation: Phaser.Math.Clamp(this.state.rotation + dr, -42, 42),
      };
      onStateChange(this.state);
      this.renderOverlay();
    }

    private check() {
      onStateChange(this.state);
      if (isPaperAligned(this.state.paperOffsetX, this.state.paperOffsetY, this.state.rotation)) onComplete(this.state);
    }
  }

  return { scene: PaperOverlayScene };
};
