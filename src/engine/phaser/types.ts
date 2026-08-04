import type Phaser from 'phaser';

export type PhaserPuzzleResult<TState> =
  | { status: 'completed'; state: TState }
  | { status: 'cancelled'; state: TState };

export type PhaserPuzzleCallbacks<TState> = {
  initialState: TState;
  reducedMotion: boolean;
  onComplete: (state: TState) => void;
  onStateChange: (state: TState) => void;
};

export type PhaserPuzzleConfigFactory<TState> = (callbacks: PhaserPuzzleCallbacks<TState>) => Phaser.Types.Core.GameConfig;
