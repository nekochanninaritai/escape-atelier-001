import type Phaser from 'phaser';

export type PuzzleId = string;

export type PuzzleStatus = 'idle' | 'playing' | 'completed' | 'cancelled' | 'error';

export type PuzzleViewport = {
  width: number;
  height: number;
};

export type PuzzlePoint = {
  x: number;
  y: number;
};

export type QuarterRotation = 0 | 90 | 180 | 270;

export type PhaserPuzzleCompleteResult<TState, TResult = undefined> = {
  status: 'completed';
  puzzleId: PuzzleId;
  state: TState;
  result?: TResult;
};

export type PhaserPuzzleCloseResult<TState> = {
  status: 'cancelled';
  puzzleId: PuzzleId;
  state: TState;
};

export type PhaserPuzzleLifecycleResult<TState, TResult = undefined> =
  | PhaserPuzzleCompleteResult<TState, TResult>
  | PhaserPuzzleCloseResult<TState>;

export type PhaserPuzzleCallbacks<TState, TResult = undefined> = {
  puzzleId?: PuzzleId;
  initialState: TState;
  reducedMotion: boolean;
  viewport?: PuzzleViewport;
  onComplete: (state: TState, result?: TResult) => void;
  onStateChange: (state: TState) => void;
  onError?: (error: Error) => void;
};

export type PhaserPuzzleConfigFactory<TState, TResult = undefined> = (
  callbacks: PhaserPuzzleCallbacks<TState, TResult>,
) => Phaser.Types.Core.GameConfig;

export type PuzzleSceneContext<TState, TResult = undefined> = {
  puzzleId: PuzzleId;
  initialState: TState;
  reducedMotion: boolean;
  viewport: PuzzleViewport;
  emitStateChange: (state: TState) => void;
  emitComplete: (state: TState, result?: TResult) => void;
  emitError: (error: Error) => void;
  playSE: (soundId: string) => void;
};

export type PuzzleSceneFactory<TState, TResult = undefined> = (
  context: PuzzleSceneContext<TState, TResult>,
) => Phaser.Scene;
