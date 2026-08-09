import type { PuzzleId, PuzzleSceneContext, PuzzleViewport } from './types';

export const DEFAULT_PUZZLE_ID: PuzzleId = 'phaser-puzzle';

export const DEFAULT_PUZZLE_VIEWPORT: PuzzleViewport = {
  width: 720,
  height: 520,
};

export function createPuzzleContext<TState, TResult = undefined>({
  puzzleId = DEFAULT_PUZZLE_ID,
  initialState,
  reducedMotion,
  viewport = DEFAULT_PUZZLE_VIEWPORT,
  onStateChange,
  onComplete,
  onError,
}: {
  puzzleId?: PuzzleId;
  initialState: TState;
  reducedMotion: boolean;
  viewport?: PuzzleViewport;
  onStateChange: (state: TState) => void;
  onComplete: (state: TState, result?: TResult) => void;
  onError?: (error: Error) => void;
}): PuzzleSceneContext<TState, TResult> {
  return {
    puzzleId,
    initialState,
    reducedMotion,
    viewport,
    emitStateChange: onStateChange,
    emitComplete: onComplete,
    emitError: (error) => onError?.(error),
    playSE: () => undefined,
  };
}
