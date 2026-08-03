import { useMemo, useState } from 'react';
import { GameShell } from '../components/game/GameShell';
import { ImageStage } from '../components/game/ImageStage';
import { Modal } from '../components/common/Modal';
import { items } from '../data/items';
import { puzzles } from '../data/puzzles';
import { useGame } from '../context/useGame';
import { audioService } from '../services/audioService';
import type { ItemId, SceneId } from '../types/game';
import './FocusScene.css';

type FocusSceneProps = {
  sceneId: SceneId;
  onSettings: () => void;
  onHints: () => void;
};

const fragmentIds: ItemId[] = ['sheetPiece1', 'sheetPiece2', 'sheetPiece3'];
const pianoKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

const sceneCopy: Record<string, { title: string; description: string; variant: string }> = {
  piano: { title: 'ピアノ', description: '古いグランドピアノだ。鍵盤の一部に、かすかな傷がある。', variant: 'piano' },
  clock: { title: '古時計', description: '長い間、止まったままの時計だ。音符の記号が数字の代わりに並んでいる。', variant: 'clock' },
  desk: { title: '机', description: '深い色の木でできた机。引き出しには小さな鍵穴がある。', variant: 'desk' },
  bookshelf: { title: '本棚', description: '音楽史や古い楽譜の本が並んでいる。', variant: 'bookshelf' },
  musicBox: { title: 'オルゴール', description: '小さなオルゴール。ゼンマイが外れている。', variant: 'musicBox' },
  door: { title: '出口の扉', description: '重い木の扉。鍵が掛かっている。', variant: 'door' },
};

export function FocusScene({ sceneId, onSettings, onHints }: FocusSceneProps) {
  const { state, dispatch, showMessage } = useGame();
  const [sheetOrder, setSheetOrder] = useState<ItemId[]>([]);
  const [clockAnswer, setClockAnswer] = useState('');
  const [pianoInput, setPianoInput] = useState<string[]>([]);
  const [confirmDoor, setConfirmDoor] = useState(false);
  const copy = sceneCopy[sceneId] ?? sceneCopy.desk;

  const hasAllFragments = fragmentIds.every((id) => state.inventory.includes(id) || state.collectedItems.includes(id));
  const solved = useMemo(() => new Set(state.solvedPuzzles), [state.solvedPuzzles]);

  const collect = (itemId: ItemId, message: string) => {
    dispatch({ type: 'COLLECT_ITEM', itemId });
    audioService.playSe('item', state.settings);
    showMessage(message);
  };

  const inspectForFragment = (pointId: string, itemId: ItemId, emptyMessage: string) => {
    dispatch({ type: 'INSPECT', pointId });
    if (!state.collectedItems.includes(itemId)) collect(itemId, `${items[itemId].name}を手に入れた。`);
    else showMessage(emptyMessage);
  };

  const toggleSheetPiece = (itemId: ItemId) => {
    setSheetOrder((current) => {
      if (current.includes(itemId)) return current.filter((id) => id !== itemId);
      return [...current, itemId];
    });
  };

  const submitSheetPuzzle = () => {
    const puzzle = puzzles.sheetOrder;
    if (sheetOrder.join(',') !== puzzle.answer.join(',')) {
      audioService.playSe('fail', state.settings);
      showMessage(puzzle.failureMessage);
      setSheetOrder([]);
      return;
    }
    dispatch({ type: 'SOLVE_PUZZLE', puzzleId: 'sheetOrder' });
    collect('windingKey', '隠された引き出しから、オルゴールのゼンマイを手に入れた。');
    showMessage(puzzle.successMessage);
  };

  const useMusicBox = () => {
    if (state.flags.musicBoxPlayed) {
      showMessage('オルゴールは「♪、月、扉」の順に小さく光った。');
      return;
    }
    if (state.selectedItemId !== 'windingKey') {
      showMessage(state.selectedItemId ? 'ここでは使えないようだ。' : 'ゼンマイがあれば動かせそうだ。');
      return;
    }
    dispatch({ type: 'USE_ITEM', itemId: 'windingKey', consume: true });
    dispatch({ type: 'SET_FLAG', key: 'musicBoxPlayed', value: true });
    showMessage('オルゴールが動き出し、「♪、月、扉」の順に光った。');
  };

  const submitClockPuzzle = () => {
    const puzzle = puzzles.clockMusicBox;
    if (clockAnswer !== puzzle.answer.join('')) {
      audioService.playSe('fail', state.settings);
      showMessage(puzzle.failureMessage);
      setClockAnswer('');
      return;
    }
    dispatch({ type: 'SOLVE_PUZZLE', puzzleId: 'clockMusicBox' });
    collect('completedSheet', '完成した楽譜を手に入れた。');
    showMessage(puzzle.successMessage);
  };

  const pressPianoKey = (note: string) => {
    if (!state.inventory.includes('completedSheet')) {
      showMessage('今はまだ、どの順に弾けばよいか分からない。');
      return;
    }
    const next = [...pianoInput, note];
    setPianoInput(next);
    audioService.playSe('tap', state.settings);
    const answer = puzzles.pianoMelody.answer;
    if (answer[next.length - 1] !== note) {
      audioService.playSe('fail', state.settings);
      showMessage(puzzles.pianoMelody.failureMessage);
      setPianoInput([]);
      return;
    }
    if (next.length === answer.length) {
      dispatch({ type: 'SOLVE_PUZZLE', puzzleId: 'pianoMelody' });
      collect('doorKey', 'ピアノの隠し引き出しから、古い鍵を手に入れた。');
      showMessage(puzzles.pianoMelody.successMessage);
      setPianoInput([]);
    }
  };

  const tryDoor = () => {
    if (!state.inventory.includes('doorKey')) {
      showMessage('扉には鍵が掛かっている。');
      return;
    }
    if (state.selectedItemId !== 'doorKey') {
      showMessage(state.selectedItemId ? 'ここでは使えないようだ。' : '鍵を選べば開けられそうだ。');
      return;
    }
    setConfirmDoor(true);
  };

  return (
    <GameShell onBack={() => dispatch({ type: 'GO_SCENE', scene: 'room' })} onSettings={onSettings} onHints={onHints}>
      <ImageStage label={copy.title} variant={copy.variant}>
        <div className="focusPanel">
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>

          {sceneId === 'desk' && (
            <div className={solved.has('sheetOrder') ? 'drawer drawerOpen' : 'drawer'}>
              <button type="button" onClick={() => inspectForFragment('desk-fragment', 'sheetPiece1', '机の上には、もう目新しいものはない。')}>
                机を調べる
              </button>
              {hasAllFragments && !solved.has('sheetOrder') && (
                <div className="puzzleBox">
                  <h3>{puzzles.sheetOrder.title}</h3>
                  <p>{puzzles.sheetOrder.prompt}</p>
                  <div className="choiceRow">
                    {fragmentIds.map((itemId) => (
                      <button key={itemId} type="button" className={sheetOrder.includes(itemId) ? 'chosen' : ''} onClick={() => toggleSheetPiece(itemId)}>
                        {items[itemId].name.replace('楽譜の切れ端 ', '')}
                      </button>
                    ))}
                  </div>
                  <p>選択: {sheetOrder.map((id) => items[id].name.replace('楽譜の切れ端 ', '')).join(' → ') || 'なし'}</p>
                  <button type="button" onClick={submitSheetPuzzle}>並べる</button>
                </div>
              )}
            </div>
          )}

          {sceneId === 'bookshelf' && (
            <button type="button" onClick={() => inspectForFragment('bookshelf-fragment', 'sheetPiece2', '本の隙間には、もう何も挟まっていない。')}>
              本棚を調べる
            </button>
          )}

          {sceneId === 'piano' && (
            <>
              <button type="button" onClick={() => inspectForFragment('piano-fragment', 'sheetPiece3', 'ピアノ周りは静かだ。')}>
                ピアノ周りを調べる
              </button>
              <div className="pianoKeys" aria-label="ピアノ鍵盤">
                {pianoKeys.map((note) => (
                  <button key={note} type="button" onClick={() => pressPianoKey(note)} aria-label={`${note}の鍵盤`}>
                    {note}
                  </button>
                ))}
              </div>
              <p className="tinyText">入力: {pianoInput.join(' ') || 'なし'}</p>
            </>
          )}

          {sceneId === 'clock' && (
            <div className="puzzleBox">
              <p>時計盤には 1=月、3=♪、4=扉 と刻まれている。</p>
              {state.flags.musicBoxPlayed && !solved.has('clockMusicBox') && (
                <>
                  <label>
                    答え
                    <input inputMode="numeric" value={clockAnswer} maxLength={3} onChange={(event) => setClockAnswer(event.target.value.replace(/\D/g, ''))} />
                  </label>
                  <button type="button" onClick={submitClockPuzzle}>確かめる</button>
                </>
              )}
              {solved.has('clockMusicBox') && <p>楽譜の欠けていた旋律は、もう読める。</p>}
            </div>
          )}

          {sceneId === 'musicBox' && (
            <button type="button" onClick={useMusicBox}>
              オルゴールを調べる
            </button>
          )}

          {sceneId === 'door' && (
            <button type="button" className={state.isCleared ? 'doorOpen' : ''} onClick={tryDoor}>
              扉を調べる
            </button>
          )}
        </div>
      </ImageStage>
      {confirmDoor && (
        <Modal title="古い鍵を使いますか？" onClose={() => setConfirmDoor(false)}>
          <div className="confirmActions">
            <button type="button" onClick={() => setConfirmDoor(false)}>やめる</button>
            <button
              type="button"
              onClick={() => {
                dispatch({ type: 'USE_ITEM', itemId: 'doorKey', consume: true });
                dispatch({ type: 'CLEAR_GAME' });
                audioService.playSe('door', state.settings);
              }}
            >
              鍵を回す
            </button>
          </div>
        </Modal>
      )}
    </GameShell>
  );
}
