import { gameConfig } from '../data/gameConfig';
import { imageAssets } from '../data/imageAssets';
import { useGame } from '../context/useGame';
import { GameImage } from '../components/common/GameImage';
import './TitleScene.css';

export function TitleScene({ onSettings, onSeriesSelect }: { onSettings: () => void; onSeriesSelect?: () => void }) {
  const { state, dispatch } = useGame();
  const canContinue = state.currentScene !== 'title' || state.inventory.length > 0 || state.solvedPuzzles.length > 0 || state.isCleared;

  return (
    <main className="titleScene">
      <GameImage
        src={imageAssets.title.background}
        alt="夕暮れの古い音楽室"
        fallbackLabel="タイトル背景"
        className="titleBackground"
        decorative
      />
      <div className="titleGlow" />
      <section className="titleContent" aria-label="タイトル">
        <p>{gameConfig.seriesName}</p>
        <h1>
          {gameConfig.episode}
          <span>{gameConfig.title}</span>
        </h1>
        <div className="titleButtons">
          <button type="button" onClick={() => dispatch({ type: 'START_NEW' })}>
            はじめから
          </button>
          <button type="button" disabled={!canContinue} onClick={() => dispatch({ type: 'CONTINUE' })}>
            つづきから
          </button>
          <button type="button" onClick={onSettings}>
            設定
          </button>
          {onSeriesSelect && (
            <button type="button" onClick={onSeriesSelect}>
              作品選択
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
