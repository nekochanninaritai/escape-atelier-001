import { gameConfig } from '../data/gameConfig';
import { useGame } from '../context/useGame';
import './TitleScene.css';

export function TitleScene({ onSettings }: { onSettings: () => void }) {
  const { state, dispatch } = useGame();
  const canContinue = state.currentScene !== 'title' || state.inventory.length > 0 || state.solvedPuzzles.length > 0 || state.isCleared;

  return (
    <main className="titleScene">
      <div className="titleGlow" />
      <section className="titleContent" aria-label="タイトル">
        <p>{gameConfig.seriesName}</p>
        <h1>{gameConfig.episode}<span>{gameConfig.title}</span></h1>
        <div className="titleButtons">
          <button type="button" onClick={() => dispatch({ type: 'START_NEW' })}>はじめから</button>
          <button type="button" disabled={!canContinue} onClick={() => dispatch({ type: 'CONTINUE' })}>つづきから</button>
          <button type="button" onClick={onSettings}>設定</button>
        </div>
      </section>
    </main>
  );
}
