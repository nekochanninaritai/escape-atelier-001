import { hints } from '../../data/hints';
import { useGame } from '../../context/useGame';
import type { PuzzleId } from '../../types/game';
import { Modal } from '../common/Modal';
import './HintModal.css';

function currentPuzzle(solved: PuzzleId[]): PuzzleId {
  if (!solved.includes('sheetOrder')) return 'sheetOrder';
  if (!solved.includes('clockMusicBox')) return 'clockMusicBox';
  return 'pianoMelody';
}

export function HintModal({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useGame();
  const puzzleId = currentPuzzle(state.solvedPuzzles);
  const viewedLevel = state.viewedHints[puzzleId] ?? 0;
  const nextLevel = Math.min(viewedLevel + 1, 3);
  const visibleHints = hints[puzzleId].slice(0, viewedLevel);

  return (
    <Modal title="ヒント" onClose={onClose}>
      <div className="hintPanel">
        {visibleHints.length === 0 ? <p>まだヒントは開いていません。</p> : visibleHints.map((hint, index) => <p key={hint}>ヒント{index + 1}: {hint}</p>)}
        <button type="button" onClick={() => dispatch({ type: 'VIEW_HINT', puzzleId, level: nextLevel })}>
          {viewedLevel >= 3 ? 'ヒント3を表示中' : `ヒント${nextLevel}を見る`}
        </button>
      </div>
    </Modal>
  );
}
