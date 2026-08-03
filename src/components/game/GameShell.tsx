import type { ReactNode } from 'react';
import { gameConfig } from '../../data/gameConfig';
import { useGame } from '../../context/useGame';
import { InventoryBar } from '../inventory/InventoryBar';
import './GameShell.css';

type GameShellProps = {
  children: ReactNode;
  onBack?: () => void;
  onHints: () => void;
  onSettings: () => void;
};

export function GameShell({ children, onBack, onHints, onSettings }: GameShellProps) {
  const { dispatch } = useGame();
  return (
    <main className="gameShell">
      <header className="gameHeader">
        {onBack ? (
          <button type="button" className="smallButton" onClick={onBack} aria-label="音楽室へ戻る">
            戻る
          </button>
        ) : (
          <span className="headerSpacer" />
        )}
        <div className="gameTitle">
          <span>{gameConfig.seriesName}</span>
          <strong>{gameConfig.episode} {gameConfig.title}</strong>
        </div>
        <button type="button" className="smallButton" onClick={() => dispatch({ type: 'GO_SCENE', scene: 'room' })} aria-label="音楽室">
          部屋
        </button>
      </header>
      <div className="sceneFrame">{children}</div>
      <InventoryBar />
      <nav className="bottomMenu" aria-label="補助メニュー">
        <button type="button" onClick={onHints}>ヒント</button>
        <button type="button" onClick={onSettings}>設定</button>
      </nav>
    </main>
  );
}
