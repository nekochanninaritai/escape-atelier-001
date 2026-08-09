export type {
  PhaserPuzzleCallbacks,
  PhaserPuzzleCloseResult,
  PhaserPuzzleCompleteResult,
  PhaserPuzzleConfigFactory,
  PhaserPuzzleLifecycleResult,
  PuzzleId,
  PuzzlePoint,
  PuzzleSceneContext,
  PuzzleSceneFactory,
  PuzzleStatus,
  PuzzleViewport,
  QuarterRotation,
} from './core/types';

export type PhaserPuzzleResult<TState> =
  | { status: 'completed'; state: TState }
  | { status: 'cancelled'; state: TState };
