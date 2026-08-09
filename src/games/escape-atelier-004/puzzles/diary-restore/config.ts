import Phaser from 'phaser';
import { DIARY_PIECES, diaryPageOrder, isDiaryComplete, isDiaryPieceCorrect } from '../../data/puzzles';
import { makeDraggable } from '../../../../engine/phaser/interactions/drag';
import { rotateQuarter } from '../../../../engine/phaser/interactions/rotate';
import type { PhaserPuzzleConfigFactory, QuarterRotation } from '../../../../engine/phaser/types';
import type { DiaryRestoreState } from '../../types';

const pieceLabels: Record<string, string> = {
  spring: '春',
  summer: '夏',
  autumn: '秋',
};

export const createDiaryRestorePuzzleConfig: PhaserPuzzleConfigFactory<DiaryRestoreState> = ({ initialState, onComplete, onStateChange }) => {
  class DiaryRestoreScene extends Phaser.Scene {
    private state: DiaryRestoreState = {
      ...initialState,
      pieces: Object.fromEntries(
        DIARY_PIECES.map((piece, index) => {
          const saved = initialState.pieces[piece.id];
          return [
            piece.id,
            saved ?? {
              x: 130 + index * 210,
              y: 126,
              rotation: 0 as QuarterRotation,
              placed: false,
            },
          ];
        }),
      ),
    };

    create() {
      this.render();
    }

    private render() {
      this.children.removeAll();
      this.add.text(360, 38, '日記の紙片を戻す', { color: '#f7ead2', fontSize: '25px' }).setOrigin(0.5);
      this.add.text(360, 70, 'ドラッグで移動、タップで90度回転。正しい場所で吸着します。', { color: '#d8c090', fontSize: '17px' }).setOrigin(0.5);

      this.add.rectangle(360, 348, 478, 188, 0xead9b8, 0.28).setStrokeStyle(2, 0xb8924a);
      DIARY_PIECES.forEach((target) => {
        this.add.rectangle(target.targetX, target.targetY, 138, 158, 0x21140f, 0.34).setStrokeStyle(1, 0x8c6a36);
      });

      DIARY_PIECES.forEach((target) => {
        const pieceState = this.state.pieces[target.id];
        const isPlaced = pieceState.placed;
        const piece = this.add.container(pieceState.x, pieceState.y);
        const rect = this.add.rectangle(0, 0, 126, 146, isPlaced ? 0xf2dfb9 : 0xd3b27c, 0.96).setStrokeStyle(3, isPlaced ? 0xf0ce7a : 0x7a1f24);
        const label = this.add.text(0, -14, pieceLabels[target.id], { color: '#3a221c', fontSize: '28px' }).setOrigin(0.5);
        const copy = this.add.text(0, 34, target.id === 'spring' ? '赤い封を' : target.id === 'summer' ? '焦らず' : 'あたためる', { color: '#5c3328', fontSize: '17px' }).setOrigin(0.5);
        piece.add([rect, label, copy]);
        piece.setSize(126, 146);
        piece.setRotation(Phaser.Math.DegToRad(pieceState.rotation));
        piece.setInteractive({ useHandCursor: true, draggable: true });
        piece.on('pointerup', () => this.rotatePiece(target.id));
        makeDraggable(this, piece, {
          bounds: new Phaser.Geom.Rectangle(64, 96, 592, 330),
          depthWhileDragging: 20,
          onDrag: (position) => {
            this.state.pieces[target.id] = { ...this.state.pieces[target.id], ...position, placed: false };
            this.emitState();
          },
          onDragEnd: () => this.snapPiece(target.id),
        });
      });

      this.add.rectangle(360, 488, 172, 42, 0x3b261f, 1).setStrokeStyle(2, 0xb8924a).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.check());
      this.add.text(360, 488, '復元する', { color: '#fff8e9', fontSize: '21px' }).setOrigin(0.5);
    }

    private rotatePiece(pieceId: string) {
      const piece = this.state.pieces[pieceId];
      if (!piece || piece.placed) return;
      this.state.pieces[pieceId] = { ...piece, rotation: rotateQuarter(piece.rotation), placed: false };
      this.emitState();
      this.render();
    }

    private snapPiece(pieceId: string) {
      const target = DIARY_PIECES.find((piece) => piece.id === pieceId);
      const piece = this.state.pieces[pieceId];
      if (!target || !piece) return;
      const placed = isDiaryPieceCorrect(piece, target);
      this.state.pieces[pieceId] = placed
        ? { x: target.targetX, y: target.targetY, rotation: target.targetRotation as QuarterRotation, placed: true }
        : { ...piece, placed: false };
      this.emitState();
      this.render();
    }

    private check() {
      this.emitState();
      if (isDiaryComplete(this.state.pieces)) onComplete(this.state);
    }

    private emitState() {
      onStateChange({ ...this.state, pieces: { ...this.state.pieces } });
    }
  }

  return { scene: DiaryRestoreScene };
};

export const validDiaryPageIds = diaryPageOrder;
