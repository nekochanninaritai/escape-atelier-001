import Phaser from 'phaser';
import { DEFAULT_PUZZLE_VIEWPORT } from './puzzleContext';
import type { PhaserPuzzleConfigFactory, PuzzleViewport } from './types';

export type CreatePhaserGameOptions<TState, TResult = undefined> = {
  parent: HTMLElement;
  createConfig: PhaserPuzzleConfigFactory<TState, TResult>;
  callbacks: Parameters<PhaserPuzzleConfigFactory<TState, TResult>>[0];
  viewport?: PuzzleViewport;
  backgroundColor?: string;
};

export function createPhaserGame<TState, TResult = undefined>({
  parent,
  createConfig,
  callbacks,
  viewport = DEFAULT_PUZZLE_VIEWPORT,
  backgroundColor = '#1d2d24',
}: CreatePhaserGameOptions<TState, TResult>): Phaser.Game {
  const config = createConfig({
    ...callbacks,
    viewport,
  });

  return new Phaser.Game({
    ...config,
    type: Phaser.AUTO,
    parent,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: viewport.width,
      height: viewport.height,
    },
    backgroundColor,
  });
}
