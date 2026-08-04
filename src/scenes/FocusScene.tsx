import { useMemo, useState } from 'react';
import { GameShell } from '../components/game/GameShell';
import { ImageStage } from '../components/game/ImageStage';
import { Modal } from '../components/common/Modal';
import { imageAssets } from '../data/imageAssets';
import { items } from '../data/items';
import { puzzles } from '../data/puzzles';
import { useGame } from '../context/useGame';
import { audioService } from '../services/audioService';
import type { Hotspot, ItemId, SceneId } from '../types/game';
import './FocusScene.css';

type FocusSceneProps = {
  sceneId: SceneId;
  onSettings: () => void;
  onHints: () => void;
};

const fragmentIds: ItemId[] = ['sheetPiece1', 'sheetPiece2', 'sheetPiece3'];
const pianoKeys = [
  { note: 'C', solfege: 'ド' },
  { note: 'D', solfege: 'レ' },
  { note: 'E', solfege: 'ミ' },
  { note: 'F', solfege: 'ファ' },
  { note: 'G', solfege: 'ソ' },
  { note: 'A', solfege: 'ラ' },
  { note: 'B', solfege: 'シ' },
];
const noteNames = Object.fromEntries(pianoKeys.map((key) => [key.note, key.solfege]));

const bookshelfHotspots: Hotspot[] = [
  { id: 'bookshelf-globe', label: '地球儀', x: 40.5, y: 41.5, width: 18, height: 13.5, targetScene: 'globe' },
];

const sceneCopy: Record<string, { title: string; description: string; variant: string }> = {
  piano: {
    title: 'ピアノ',
    description: '古いグランドピアノだ。そばに、音階の練習帳が置かれている。',
    variant: 'piano',
  },
  clock: {
    title: '古時計',
    description: '長い間、止まったままの時計だ。音楽記号が数字の代わりに並んでいる。',
    variant: 'clock',
  },
  desk: {
    title: '机',
    description: '深い艶の木でできた机。引き出しには細い傷がある。',
    variant: 'desk',
  },
  bookshelf: {
    title: '本棚',
    description: '音楽史や古い楽譜の本が並んでいる。棚の中には古い地球儀も見える。',
    variant: 'bookshelf',
  },
  globe: {
    title: '地球儀',
    description: '本棚に置かれた古い地球儀だ。真鍮の台座が鈍く光っている。',
    variant: 'globe',
  },
  musicBox: {
    title: 'オルゴール',
    description: '小さなオルゴール。側面に小さな穴がある。',
    variant: 'musicBox',
  },
  door: {
    title: '出口の扉',
    description: '重い木の扉。鍵が掛かっている。',
    variant: 'door',
  },
};

export function FocusScene({ sceneId, onSettings, onHints }: FocusSceneProps) {
  const { state, dispatch, showMessage } = useGame();
  const [clockAnswer, setClockAnswer] = useState('');
  const [pianoInput, setPianoInput] = useState<string[]>([]);
  const [confirmDoor, setConfirmDoor] = useState(false);
  const copy = sceneCopy[sceneId] ?? sceneCopy.desk;

  const hasAllFragments = fragmentIds.every((id) => state.inventory.includes(id) || state.collectedItems.includes(id));
  const solved = useMemo(() => new Set(state.solvedPuzzles), [state.solvedPuzzles]);
  const sceneImage = (() => {
    if (sceneId === 'desk' && solved.has('sheetOrder')) return imageAssets.rooms.deskOpen;
    if (sceneId === 'globe' && state.flags.globeOpened) return imageAssets.rooms.globeOpen;
    if (sceneId === 'musicBox' && state.flags.musicBoxPlayed) return imageAssets.rooms.musicBoxActive;
    if (sceneId === 'piano' && solved.has('pianoMelody')) return imageAssets.rooms.pianoOpen;
    if (sceneId === 'door' && state.isCleared) return imageAssets.rooms.doorOpen;
    if (sceneId === 'piano') return imageAssets.rooms.piano;
    if (sceneId === 'clock') return imageAssets.rooms.clock;
    if (sceneId === 'bookshelf') return imageAssets.rooms.bookshelf;
    if (sceneId === 'globe') return imageAssets.rooms.globe;
    if (sceneId === 'musicBox') return imageAssets.rooms.musicBox;
    if (sceneId === 'door') return imageAssets.rooms.door;
    return imageAssets.rooms.desk;
  })();

  const collect = (itemId: ItemId, message: string) => {
    if (!state.collectedItems.includes(itemId)) {
      dispatch({ type: 'COLLECT_ITEM', itemId });
      audioService.playSe('item', state.settings);
    }
    showMessage(message);
  };

  const inspectForFragment = (pointId: string, itemId: ItemId, emptyMessage: string) => {
    dispatch({ type: 'INSPECT', pointId });
    if (!state.collectedItems.includes(itemId)) collect(itemId, `${items[itemId].name}を手に入れた。`);
    else showMessage(emptyMessage);
  };

  const inspectGlobe = () => {
    dispatch({ type: 'INSPECT', pointId: 'globe-base' });

    if (state.flags.windingKeyObtained || state.collectedItems.includes('windingKey')) {
      dispatch({ type: 'SET_FLAG', key: 'globeOpened', value: true });
      showMessage('地球儀の台座は開いている。中にはもう何もない。');
      return;
    }

    if (!state.flags.globeMarkSeen) {
      showMessage('古い地球儀だ。特に変わったところはなさそうだ。');
      return;
    }

    dispatch({ type: 'SET_FLAG', key: 'globeOpened', value: true });
    dispatch({ type: 'SET_FLAG', key: 'windingKeyObtained', value: true });
    collect('windingKey', '地球儀の台座に、小さなゼンマイが隠されていた。');
  };

  const handleMusicBox = (forceUse = false) => {
    if (state.flags.musicBoxPlayed) {
      showMessage('オルゴールは「月、星、鳥」の順に小さく光っている。');
      return;
    }

    const hasWindingKey = state.inventory.includes('windingKey');
    if (!hasWindingKey) {
      showMessage('側面に小さな穴がある。何かを取り付けられそうだ。');
      return;
    }

    if (!forceUse && state.selectedItemId && state.selectedItemId !== 'windingKey') {
      showMessage('ここでは使えないようだ。');
      return;
    }

    dispatch({ type: 'USE_ITEM', itemId: 'windingKey', consume: true });
    dispatch({ type: 'SET_FLAG', key: 'musicBoxPlayed', value: true });
    showMessage('オルゴールが動き出し、「月、星、鳥」の順に淡く光った。');
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
    dispatch({ type: 'SET_FLAG', key: 'sheetMarkedByClock', value: true });
    collect('completedSheet', puzzle.successMessage);
  };

  const pressPianoKey = (note: string) => {
    if (!state.inventory.includes('completedSheet')) {
      showMessage('まだピアノを弾く手掛かりが足りない。');
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

  const handleFocusHotspot = (hotspot: Hotspot) => {
    dispatch({ type: 'INSPECT', pointId: hotspot.id });

    if (hotspot.id === 'bookshelf-globe' && !state.flags.globeMarkSeen && !state.flags.windingKeyObtained) {
      showMessage('古い地球儀だ。特に変わったところはなさそうだ。');
      return;
    }

    if (hotspot.targetScene) dispatch({ type: 'GO_SCENE', scene: hotspot.targetScene });
  };

  return (
    <GameShell onBack={() => dispatch({ type: 'GO_SCENE', scene: 'room' })} onSettings={onSettings} onHints={onHints}>
      <ImageStage
        label={copy.title}
        variant={copy.variant}
        src={sceneImage}
        alt={`${copy.title}の拡大画像`}
        hotspots={sceneId === 'bookshelf' ? bookshelfHotspots : []}
        onHotspot={handleFocusHotspot}
      >
        <div className="focusPanel">
          <h2>{copy.title}</h2>
          <p>{copy.description}</p>

          {sceneId === 'desk' && (
            <div className={solved.has('sheetOrder') ? 'drawer drawerOpen' : 'drawer'}>
              <button type="button" onClick={() => inspectForFragment('desk-fragment', 'sheetPiece1', '机の上には、もう目新しいものはない。')}>
                机を調べる
              </button>
              {hasAllFragments && !solved.has('sheetOrder') && <p>すべての切れ端がそろった。インベントリからつなぎ合わせられそうだ。</p>}
            </div>
          )}

          {sceneId === 'bookshelf' && (
            <button type="button" onClick={() => inspectForFragment('bookshelf-fragment', 'sheetPiece2', '本の隙間には、もう何も挟まっていない。')}>
              本棚を調べる
            </button>
          )}

          {sceneId === 'globe' && (
            <div className={state.flags.globeOpened ? 'drawer drawerOpen' : 'drawer'}>
              <button type="button" onClick={inspectGlobe}>
                地球儀を調べる
              </button>
            </div>
          )}

          {sceneId === 'piano' && (
            <>
              <button type="button" onClick={() => inspectForFragment('piano-fragment', 'sheetPiece3', 'ピアノ周りは静かだ。')}>
                ピアノ周りを調べる
              </button>
              <div className="scaleBook" aria-label="音階の練習帳">
                <p>音階の練習帳</p>
                <div className="scaleStaff">
                  {pianoKeys.map((key, index) => (
                    <span key={key.note} style={{ left: `${8 + index * 14}%`, bottom: `${12 + index * 9}%` }}>
                      <i />
                      <b>{key.solfege}</b>
                    </span>
                  ))}
                </div>
              </div>
              <div className="pianoKeys" aria-label="ピアノ鍵盤">
                {pianoKeys.map((key) => (
                  <button key={key.note} type="button" onClick={() => pressPianoKey(key.note)} aria-label={`${key.solfege}の鍵盤`}>
                    <strong>{key.solfege}</strong>
                    <span>{key.note}</span>
                  </button>
                ))}
              </div>
              <p className="tinyText">入力: {pianoInput.map((note) => noteNames[note]).join('・') || 'なし'}</p>
            </>
          )}

          {sceneId === 'clock' && (
            <div className="puzzleBox">
              <div className="clockPuzzle">
                <img src={imageAssets.puzzles.clockFace} alt="音楽記号が並んだ古時計の文字盤" draggable={false} />
                <span className="clockHand hourHand" />
                <span className="clockHand minuteHand" />
              </div>
              <p>時計盤には 1=月、3=星、4=鳥 と刻まれている。</p>
              {state.flags.musicBoxPlayed && !solved.has('clockMusicBox') && (
                <>
                  <label>
                    答え
                    <input inputMode="numeric" value={clockAnswer} maxLength={3} onChange={(event) => setClockAnswer(event.target.value.replace(/\D/g, ''))} />
                  </label>
                  <button type="button" onClick={submitClockPuzzle}>
                    確かめる
                  </button>
                </>
              )}
              {!state.flags.musicBoxPlayed && <p>今はまだ、どの記号を読むべきか分からない。</p>}
              {solved.has('clockMusicBox') && <p>完成した楽譜には、淡い金色の音符が並んでいる。</p>}
            </div>
          )}

          {sceneId === 'musicBox' && (
            <>
              {state.flags.musicBoxPlayed && (
                <div className="musicBoxClue">
                  <img src={imageAssets.puzzles.musicBoxClue} alt="オルゴールから現れた金属のプレート" draggable={false} />
                  <span aria-label="オルゴールの手掛かり">星 月 鳥</span>
                </div>
              )}
              {!state.flags.musicBoxPlayed && state.inventory.includes('windingKey') && (
                <button type="button" onClick={() => handleMusicBox(true)}>
                  ゼンマイを使う
                </button>
              )}
              <button type="button" onClick={() => handleMusicBox(false)}>
                オルゴールを調べる
              </button>
            </>
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
            <button type="button" onClick={() => setConfirmDoor(false)}>
              やめる
            </button>
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
