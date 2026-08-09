import type { ReactNode } from 'react';

type PuzzleShellProps = {
  title: string;
  instructions: string;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onRetry: () => void;
  children: ReactNode;
};

export function PuzzleShell({ title, instructions, loading, error, onClose, onRetry, children }: PuzzleShellProps) {
  return (
    <div className="phaserOverlay" role="dialog" aria-modal="true" aria-label={title}>
      <section className="phaserPanel">
        <header className="phaserHeader">
          <div>
            <h2>{title}</h2>
            <p>{instructions}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="パズルを閉じる">
            戻る
          </button>
        </header>
        {error ? (
          <div className="phaserFallback">
            <p>{error}</p>
            <div className="phaserFallbackActions">
              <button type="button" onClick={onRetry}>
                再読み込み
              </button>
              <button type="button" onClick={onClose}>
                戻る
              </button>
            </div>
          </div>
        ) : (
          <>
            {loading && <p className="phaserLoading">読み込み中...</p>}
            {children}
          </>
        )}
      </section>
    </div>
  );
}
