import { useEffect, useMemo, useRef, useState } from 'react';
import Phaser from 'phaser';
import type { PhaserPuzzleConfigFactory } from './types';
import './PhaserPuzzle.css';

type PhaserPuzzleProps<TState> = {
  title: string;
  instructions: string;
  initialState: TState;
  createConfig: PhaserPuzzleConfigFactory<TState>;
  onComplete: (state: TState) => void;
  onCancel: (state: TState) => void;
};

export function PhaserPuzzle<TState>({ title, instructions, initialState, createConfig, onComplete, onCancel }: PhaserPuzzleProps<TState>) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const latestState = useRef(initialState);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const reducedMotion = useMemo(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false, []);

  useEffect(() => {
    latestState.current = initialState;
  }, [initialState]);

  useEffect(() => {
    let cancelled = false;
    document.body.classList.add('phaserPuzzleActive');

    const boot = async () => {
      try {
        if (!hostRef.current || gameRef.current) return;
        if (cancelled) return;
        const config = createConfig({
          initialState,
          reducedMotion,
          onStateChange: (state) => {
            latestState.current = state;
          },
          onComplete: (state) => {
            latestState.current = state;
            onComplete(state);
          },
        });
        gameRef.current = new Phaser.Game({
          ...config,
          type: Phaser.AUTO,
          parent: hostRef.current,
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 720,
            height: 520,
          },
          backgroundColor: '#1d2d24',
        });
        setReady(true);
      } catch {
        setError('パズルの読み込みに失敗しました。戻ってもう一度お試しください。');
      }
    };

    void boot();
    return () => {
      cancelled = true;
      document.body.classList.remove('phaserPuzzleActive');
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [createConfig, initialState, onComplete, reducedMotion]);

  return (
    <div className="phaserOverlay" role="dialog" aria-modal="true" aria-label={title}>
      <section className="phaserPanel">
        <header className="phaserHeader">
          <div>
            <h2>{title}</h2>
            <p>{instructions}</p>
          </div>
          <button type="button" onClick={() => onCancel(latestState.current)} aria-label="パズルを閉じる">
            戻る
          </button>
        </header>
        {error ? (
          <div className="phaserFallback">
            <p>{error}</p>
            <button type="button" onClick={() => onCancel(latestState.current)}>
              戻る
            </button>
          </div>
        ) : (
          <>
            {!ready && <p className="phaserLoading">読み込み中...</p>}
            <div ref={hostRef} className="phaserHost" />
          </>
        )}
      </section>
    </div>
  );
}
