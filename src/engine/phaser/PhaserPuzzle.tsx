import { useEffect, useMemo, useRef, useState } from 'react';
import Phaser from 'phaser';
import { PuzzleShell } from './components/PuzzleShell';
import { createPhaserGame } from './core/createPhaserGame';
import { DEFAULT_PUZZLE_ID, DEFAULT_PUZZLE_VIEWPORT } from './core/puzzleContext';
import { destroyPhaserGame } from './utils/cleanup';
import type { PhaserPuzzleConfigFactory, PuzzleId, PuzzleViewport } from './types';
import './PhaserPuzzle.css';

type PhaserPuzzleProps<TState, TResult = undefined> = {
  puzzleId?: PuzzleId;
  title: string;
  instructions: string;
  initialState: TState;
  createConfig: PhaserPuzzleConfigFactory<TState, TResult>;
  viewport?: PuzzleViewport;
  onComplete: (state: TState, result?: TResult) => void;
  onCancel?: (state: TState) => void;
  onClose?: (state: TState) => void;
  onStateChange?: (state: TState) => void;
  onError?: (error: Error) => void;
};

const PHASER_BOOT_ERROR = 'パズルの読み込みに失敗しました。もう一度お試しください。';

export function PhaserPuzzle<TState, TResult = undefined>({
  puzzleId = DEFAULT_PUZZLE_ID,
  title,
  instructions,
  initialState,
  createConfig,
  viewport = DEFAULT_PUZZLE_VIEWPORT,
  onComplete,
  onCancel,
  onClose,
  onStateChange,
  onError,
}: PhaserPuzzleProps<TState, TResult>) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const latestState = useRef(initialState);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [bootKey, setBootKey] = useState(0);
  const reducedMotion = useMemo(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false, []);

  useEffect(() => {
    latestState.current = initialState;
  }, [initialState]);

  useEffect(() => {
    let cancelled = false;
    document.body.classList.add('phaserPuzzleActive');

    const boot = () => {
      try {
        if (!hostRef.current || gameRef.current || cancelled) return;
        gameRef.current = createPhaserGame({
          parent: hostRef.current,
          createConfig,
          viewport,
          callbacks: {
            puzzleId,
            viewport,
            initialState,
            reducedMotion,
            onStateChange: (state) => {
              latestState.current = state;
              onStateChange?.(state);
            },
            onComplete: (state, result) => {
              latestState.current = state;
              onComplete(state, result);
            },
            onError: (nextError) => {
              setError(nextError.message);
              onError?.(nextError);
            },
          },
        });
        setReady(true);
      } catch (nextError) {
        const errorObject = nextError instanceof Error ? nextError : new Error(PHASER_BOOT_ERROR);
        setError(PHASER_BOOT_ERROR);
        onError?.(errorObject);
      }
    };

    boot();
    return () => {
      cancelled = true;
      document.body.classList.remove('phaserPuzzleActive');
      destroyPhaserGame(gameRef.current);
      gameRef.current = null;
      setReady(false);
    };
  }, [bootKey, createConfig, initialState, onComplete, onError, onStateChange, puzzleId, reducedMotion, viewport]);

  const closePuzzle = () => {
    const closeHandler = onCancel ?? onClose;
    closeHandler?.(latestState.current);
  };

  const retryPuzzle = () => {
    setError(null);
    setReady(false);
    destroyPhaserGame(gameRef.current);
    gameRef.current = null;
    setBootKey((current) => current + 1);
  };

  return (
    <PuzzleShell title={title} instructions={instructions} loading={!ready} error={error} onClose={closePuzzle} onRetry={retryPuzzle}>
      <div ref={hostRef} className="phaserHost" />
    </PuzzleShell>
  );
}
