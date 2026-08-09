import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { GameImage } from '../../components/common/GameImage';
import { Modal } from '../../components/common/Modal';
import { PhaserPuzzle } from '../../engine/phaser/PhaserPuzzle';
import { studyGameConfig } from './gameConfig';
import { studyHints } from './data/hints';
import { studyImages } from './data/imageAssets';
import { studyItems } from './data/items';
import { isCorrectTypewriterCode } from './data/puzzles';
import { sceneCopy, studyHotspots } from './data/scenes';
import { endingPages, prologuePages } from './data/story';
import { createDiaryRestorePuzzleConfig } from './puzzles/diary-restore/config';
import { createMemoryGlobePuzzleConfig } from './puzzles/memory-globe/config';
import { createPaperOverlayPuzzleConfig } from './puzzles/paper-overlay/config';
import { clearStudySaveData, hasStudySaveData } from './state/saveService';
import { useStudy } from './state/useStudy';
import type { StudyGameState, StudyItemId, StudyPuzzleId, StudySceneId } from './types';
import './StudyApp.css';

type PuzzleOverlay = 'diary' | 'globe' | 'paper' | null;
export type StudyLaunchMode = 'start' | 'continue';

export function StudyApp({ onSeriesSelect, launchMode }: { onSeriesSelect: () => void; launchMode?: StudyLaunchMode }) {
  const { state, dispatch, message, showMessage } = useStudy();
  const launchHandled = useRef(false);
  const [storyPage, setStoryPage] = useState(0);
  const [endingPage, setEndingPage] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hintsOpen, setHintsOpen] = useState(false);
  const [puzzle, setPuzzle] = useState<PuzzleOverlay>(null);
  const [confirmDoor, setConfirmDoor] = useState(false);
  const solved = useMemo(() => new Set(state.solvedPuzzles), [state.solvedPuzzles]);
  const stageImage = getStageImage(state.currentScene, state);

  useEffect(() => {
    if (!launchMode || launchHandled.current) return;
    launchHandled.current = true;
    dispatch({ type: launchMode === 'start' ? 'START_NEW' : 'CONTINUE' });
  }, [dispatch, launchMode]);

  const go = (scene: StudySceneId) => dispatch({ type: 'GO_SCENE', scene });
  const collect = (itemId: StudyItemId, text: string) => {
    dispatch({ type: 'COLLECT_ITEM', itemId });
    showMessage(text);
  };

  const handleSceneAction = () => {
    if (state.currentScene === 'bookshelf') {
      if (!state.collectedItems.includes('diaryPage')) collect('diaryPage', '本の隙間から、日記のページが一枚すべり落ちた。');
      else if (!solved.has('diaryRestore')) setPuzzle('diary');
      else showMessage('日記は春から冬へ、静かに順番を取り戻している。');
      return;
    }
    if (state.currentScene === 'fireplace') {
      if (!state.collectedItems.includes('letterFragment')) collect('letterFragment', '暖炉の灰の奥から、燃え残った手紙の切れ端を拾った。');
      else showMessage('灰の中には、もう読めるものは残っていない。');
      return;
    }
    if (state.currentScene === 'side-table') {
      if (!state.collectedItems.includes('transparentPaper')) collect('transparentPaper', '小さな引き出しから、赤い線の入った半透明の紙を見つけた。');
      else showMessage('封蝋は割れている。誰かがここで返事を待っていたようだ。');
      return;
    }
    if (state.currentScene === 'portrait') {
      showMessage(state.flags.diaryRestored ? '額縁の言葉が、復元した日記の季節と同じ順で光っている。' : '「忘れても、帰れる」。短い言葉が額縁に刻まれている。');
      return;
    }
    if (state.currentScene === 'desk') {
      if (!state.flags.diaryRestored) showMessage('引き出しの中には日記の跡がある。先にページを復元できそうだ。');
      else if (state.selectedItemId === 'transparentPaper' && state.collectedItems.includes('letterFragment') && !state.flags.paperAligned) setPuzzle('paper');
      else showMessage(state.flags.paperAligned ? '手紙には REMEMBER という言葉が浮かび上がっている。' : '手紙の文字は欠けている。何かを重ねれば読めるかもしれない。');
      return;
    }
    if (state.currentScene === 'globe') {
      if (!state.flags.diaryRestored) showMessage('地球儀は固く、まだ動かない。書斎の記憶が足りないようだ。');
      else if (!state.flags.memoryRouteAligned) setPuzzle('globe');
      else showMessage('地球儀の航路は、書斎へ帰る道筋を指している。');
      return;
    }
    if (state.currentScene === 'typewriter') {
      if (!state.flags.paperAligned) showMessage('タイプライターは沈黙している。打つべき言葉がまだわからない。');
      else if (!state.collectedItems.includes('inkRibbon')) collect('inkRibbon', 'タイプライターの横から、乾きかけのインクリボンを見つけた。');
      else if (state.selectedItemId === 'inkRibbon' && !state.flags.typewriterReady) {
        dispatch({ type: 'USE_ITEM', itemId: 'inkRibbon', consume: true });
        dispatch({ type: 'SET_FLAG', key: 'typewriterReady', value: true });
        showMessage('インクリボンを戻した。キーを押せば、まだ文字を刻めそうだ。');
      } else showMessage(state.flags.typewriterReady ? '浮かび上がった言葉を入力できそうだ。' : 'インクリボンを選んで取り付ける必要がある。');
      return;
    }
    if (state.currentScene === 'door') {
      if (!state.flags.doorUnlocked) showMessage('扉は開かない。真鍮の鍵穴が、最後の記憶を待っている。');
      else if (state.selectedItemId !== 'memoryKey') showMessage('記憶の鍵を選べば、扉を開けられそうだ。');
      else setConfirmDoor(true);
    }
  };

  const solveTypewriter = () => {
    if (!state.flags.typewriterReady) {
      showMessage('先にインクリボンを取り付ける必要がある。');
      return;
    }
    if (!isCorrectTypewriterCode(state.puzzleStates.typewriterCode.input)) {
      showMessage('キーの並びが違う。手紙に浮かんだ言葉を思い出そう。');
      return;
    }
    dispatch({ type: 'SOLVE_PUZZLE', puzzleId: 'typewriterCode' });
    dispatch({ type: 'SET_FLAG', key: 'typewriterSolved', value: true });
    dispatch({ type: 'SET_FLAG', key: 'doorUnlocked', value: true });
    dispatch({ type: 'COLLECT_ITEM', itemId: 'memoryKey' });
    showMessage('最後の文字が打たれると、真鍮の鍵が机の奥から現れた。');
  };

  if (state.currentScene === 'title') {
    return (
      <main className="studyTitle">
        <GameImage src={studyImages.title} alt="忘れられた書斎" fallbackLabel="忘れられた書斎" className="studyBackdropImage" decorative />
        <section className="studyTitleText">
          <p>{studyGameConfig.seriesName}</p>
          <h1>{studyGameConfig.episode}<span>{studyGameConfig.title}</span></h1>
          <small>{studyGameConfig.theme} / 難易度 {studyGameConfig.difficulty} / {studyGameConfig.playTime}</small>
          <div className="studyButtons">
            <button type="button" onClick={() => dispatch({ type: 'START_NEW' })}>はじめから</button>
            <button type="button" disabled={!hasStudySaveData()} onClick={() => dispatch({ type: 'CONTINUE' })}>つづきから</button>
            <button type="button" onClick={() => setSettingsOpen(true)}>設定</button>
            <button type="button" onClick={onSeriesSelect}>作品選択</button>
          </div>
        </section>
        {settingsOpen && <StudySettings onClose={() => setSettingsOpen(false)} />}
      </main>
    );
  }

  if (state.currentScene === 'prologue') {
    return <StoryView pages={prologuePages} page={storyPage} title="Prologue" onNext={() => (storyPage + 1 >= prologuePages.length ? go('study') : setStoryPage(storyPage + 1))} onSkip={() => go('study')} />;
  }

  if (state.currentScene === 'ending') {
    const finished = endingPage >= endingPages.length;
    return (
      <StoryView
        pages={endingPages}
        page={endingPage}
        title={finished ? 'ESCAPE' : 'Ending'}
        onNext={() => setEndingPage(endingPage + 1)}
        finished={finished}
        actions={<><button type="button" onClick={() => go('title')}>タイトルへ戻る</button><button type="button" onClick={() => dispatch({ type: 'START_NEW' })}>もう一度遊ぶ</button></>}
      />
    );
  }

  const isMain = state.currentScene === 'study';

  return (
    <main className="studyShell">
      <header className="studyHeader">
        {!isMain ? <button type="button" onClick={() => go('study')}>戻る</button> : <span />}
        <div><span>{studyGameConfig.seriesName}</span><strong>{studyGameConfig.episode} {studyGameConfig.title}</strong></div>
        <button type="button" onClick={() => go('study')}>書斎</button>
      </header>
      <section className={`studyStage scene-${state.currentScene}`} aria-label="忘れられた書斎">
        <GameImage src={stageImage.src} alt={stageImage.alt} fallbackLabel={stageImage.fallback} className="studyStageImage" decorative />
        {isMain ? (
          <>
            <h2>忘れられた書斎</h2>
            {studyHotspots.map((hotspot) => (
              <button
                key={hotspot.id}
                type="button"
                className="studyHotspot"
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, width: `${hotspot.width}%`, height: `${hotspot.height}%` }}
                onClick={() => {
                  dispatch({ type: 'INSPECT', pointId: hotspot.id });
                  if (hotspot.targetScene) go(hotspot.targetScene);
                }}
                aria-label={hotspot.label}
              />
            ))}
          </>
        ) : (
          <FocusPanel sceneId={state.currentScene} onAction={handleSceneAction} onTypewriterSubmit={solveTypewriter} />
        )}
      </section>
      <Inventory />
      <nav className="studyBottom"><button type="button" onClick={() => setHintsOpen(true)}>ヒント</button><button type="button" onClick={() => setSettingsOpen(true)}>設定</button></nav>
      {message && <div className="messageToast">{message}</div>}
      {settingsOpen && <StudySettings onClose={() => setSettingsOpen(false)} />}
      {hintsOpen && <StudyHints onClose={() => setHintsOpen(false)} />}
      {confirmDoor && <ConfirmDoor onCancel={() => setConfirmDoor(false)} onOpen={() => { dispatch({ type: 'USE_ITEM', itemId: 'memoryKey', consume: true }); dispatch({ type: 'CLEAR_GAME' }); }} />}
      {puzzle === 'diary' && (
        <PhaserPuzzle
          title="日記復元"
          instructions="ページを入れ替え、季節の記憶を正しい順番へ戻してください。"
          initialState={state.puzzleStates.diaryRestore}
          createConfig={createDiaryRestorePuzzleConfig}
          onCancel={(nextState) => { dispatch({ type: 'SET_DIARY_ORDER', pageOrder: nextState.pageOrder }); setPuzzle(null); }}
          onComplete={(nextState) => {
            dispatch({ type: 'SET_DIARY_ORDER', pageOrder: nextState.pageOrder });
            dispatch({ type: 'SOLVE_PUZZLE', puzzleId: 'diaryRestore' });
            dispatch({ type: 'SET_FLAG', key: 'diaryRestored', value: true });
            dispatch({ type: 'SET_FLAG', key: 'globeUnlocked', value: true });
            setPuzzle(null);
            showMessage('日記が春から冬へつながった。地球儀の留め具が小さく鳴った。');
          }}
        />
      )}
      {puzzle === 'globe' && (
        <PhaserPuzzle
          title="地球儀回転"
          instructions="館を巡った記憶の航路を順番に選んでください。"
          initialState={state.puzzleStates.memoryGlobe}
          createConfig={createMemoryGlobePuzzleConfig}
          onCancel={(nextState) => { dispatch({ type: 'SET_GLOBE_ROUTES', selectedRouteIds: nextState.selectedRouteIds }); setPuzzle(null); }}
          onComplete={(nextState) => {
            dispatch({ type: 'SET_GLOBE_ROUTES', selectedRouteIds: nextState.selectedRouteIds });
            dispatch({ type: 'SOLVE_PUZZLE', puzzleId: 'memoryGlobe' });
            dispatch({ type: 'SET_FLAG', key: 'memoryRouteAligned', value: true });
            setPuzzle(null);
            showMessage('地球儀の航路が書斎へ戻った。机の手紙がほのかに光っている。');
          }}
        />
      )}
      {puzzle === 'paper' && (
        <PhaserPuzzle
          title="半透明紙の重ね合わせ"
          instructions="紙を動かして、手紙の欠けた文字を読める位置へ重ねてください。"
          initialState={state.puzzleStates.paperOverlay}
          createConfig={createPaperOverlayPuzzleConfig}
          onCancel={(nextState) => { dispatch({ type: 'SET_PAPER_OVERLAY', state: nextState }); setPuzzle(null); }}
          onComplete={(nextState) => {
            dispatch({ type: 'SET_PAPER_OVERLAY', state: nextState });
            dispatch({ type: 'SOLVE_PUZZLE', puzzleId: 'paperOverlay' });
            dispatch({ type: 'SET_FLAG', key: 'paperAligned', value: true });
            setPuzzle(null);
            showMessage('欠けた文字が重なり、REMEMBER という言葉が読めるようになった。');
          }}
        />
      )}
    </main>
  );
}

function FocusPanel({ sceneId, onAction, onTypewriterSubmit }: { sceneId: StudySceneId; onAction: () => void; onTypewriterSubmit: () => void }) {
  const { state, dispatch } = useStudy();
  const copy = sceneCopy[sceneId as keyof typeof sceneCopy];
  if (!copy) return null;
  return (
    <div className="studyFocus">
      <h2>{copy.title}</h2>
      <p>{copy.description}</p>
      {sceneId === 'typewriter' && state.flags.typewriterReady ? (
        <div className="typewriterPanel">
          <input
            type="text"
            value={state.puzzleStates.typewriterCode.input}
            maxLength={16}
            onChange={(event) => dispatch({ type: 'SET_TYPEWRITER_INPUT', input: event.target.value })}
            aria-label="タイプライターへ入力する言葉"
          />
          <button type="button" onClick={onTypewriterSubmit}>打ち終える</button>
        </div>
      ) : null}
      <button type="button" onClick={onAction}>調べる / 使う</button>
    </div>
  );
}

function Inventory() {
  const { state, dispatch } = useStudy();
  const [detailItem, setDetailItem] = useState<StudyItemId | null>(null);
  return (
    <>
      <section className="studyInventory" aria-label="インベントリ">
        {state.inventory.length === 0 ? <p>持ち物はありません</p> : null}
        {state.inventory.map((itemId) => {
          const item = studyItems[itemId];
          return (
            <div className="studyInventorySlot" key={itemId}>
              <button type="button" className={state.selectedItemId === itemId ? 'studyInventoryItem selected' : 'studyInventoryItem'} onClick={() => dispatch({ type: 'SELECT_ITEM', itemId })} aria-label={`${item.name}を選ぶ`}>
                <GameImage src={item.image} alt={item.alt} fallbackLabel={item.name} className="studyItemIcon" decorative />
                <span>{item.name}</span>
              </button>
              <button type="button" className="studyDetailButton" onClick={() => setDetailItem(itemId)} aria-label={`${item.name}の詳細`}>i</button>
            </div>
          );
        })}
      </section>
      {detailItem && (
        <Modal title={studyItems[detailItem].name} onClose={() => setDetailItem(null)}>
          <div className="studyItemDetail">
            <GameImage src={studyItems[detailItem].image} alt={studyItems[detailItem].alt} fallbackLabel={studyItems[detailItem].name} className="studyLargeItemIcon" />
            <p>{studyItems[detailItem].description}</p>
          </div>
        </Modal>
      )}
    </>
  );
}

function StudyHints({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useStudy();
  const nextPuzzle = getCurrentHintPuzzle(state);
  const hints = studyHints[nextPuzzle];
  const viewed = state.viewedHints[nextPuzzle] ?? 0;
  return (
    <Modal title="ヒント" onClose={onClose}>
      <div className="studyHints">
        <h3>{hintTitle(nextPuzzle)}</h3>
        {hints.slice(0, viewed).map((hint) => <p key={hint}>{hint}</p>)}
        {viewed < hints.length && <button type="button" onClick={() => dispatch({ type: 'VIEW_HINT', puzzleId: nextPuzzle, level: viewed + 1 })}>ヒント {viewed + 1} を見る</button>}
      </div>
    </Modal>
  );
}

function StudySettings({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useStudy();
  const resetSave = () => {
    if (!window.confirm('セーブデータをリセットしますか？')) return;
    clearStudySaveData();
    dispatch({ type: 'RESET' });
    onClose();
  };

  return (
    <Modal title="設定" onClose={onClose}>
      <div className="studySettings">
        <label><input type="checkbox" checked={state.settings.bgmEnabled} onChange={(event) => dispatch({ type: 'UPDATE_SETTINGS', settings: { bgmEnabled: event.target.checked } })} /> BGM</label>
        <label><input type="checkbox" checked={state.settings.seEnabled} onChange={(event) => dispatch({ type: 'UPDATE_SETTINGS', settings: { seEnabled: event.target.checked } })} /> SE</label>
        <label>BGM音量<input type="range" min="0" max="1" step="0.05" value={state.settings.bgmVolume} onChange={(event) => dispatch({ type: 'UPDATE_SETTINGS', settings: { bgmVolume: Number(event.target.value) } })} /></label>
        <label>SE音量<input type="range" min="0" max="1" step="0.05" value={state.settings.seVolume} onChange={(event) => dispatch({ type: 'UPDATE_SETTINGS', settings: { seVolume: Number(event.target.value) } })} /></label>
        <div className="studySettingsActions">
          <button type="button" onClick={() => { dispatch({ type: 'GO_SCENE', scene: 'title' }); onClose(); }}>タイトルへ戻る</button>
          <button type="button" onClick={onClose}>ゲームへ戻る</button>
          <button type="button" className="studyDangerButton" onClick={resetSave}>セーブリセット</button>
        </div>
      </div>
    </Modal>
  );
}

function ConfirmDoor({ onCancel, onOpen }: { onCancel: () => void; onOpen: () => void }) {
  return <Modal title="記憶の鍵を使いますか？" onClose={onCancel}><div className="studyConfirm"><button type="button" onClick={onCancel}>やめる</button><button type="button" onClick={onOpen}>鍵を回す</button></div></Modal>;
}

function StoryView({ pages, page, title, onNext, onSkip, finished = false, actions }: { pages: string[]; page: number; title: string; onNext: () => void; onSkip?: () => void; finished?: boolean; actions?: ReactNode }) {
  return (
    <main className="studyStory">
      <GameImage src={finished ? studyImages.ending : studyImages.title} alt="忘れられた書斎" fallbackLabel="忘れられた書斎" className="studyBackdropImage" decorative />
      <section className="studyStoryText">
        {finished ? <><h1>{title}</h1><p>Escape Atelier #004</p><p>忘れられた書斎からの脱出</p><p>プレイしていただきありがとうございました</p><div className="studyButtons">{actions}</div></> : <><h1>{title}</h1><p>{pages[page]}</p><div className="studyButtons"><button type="button" onClick={onNext}>次へ</button>{onSkip && <button type="button" onClick={onSkip}>スキップ</button>}</div></>}
      </section>
    </main>
  );
}

function getStageImage(sceneId: StudySceneId, state: StudyGameState) {
  if (sceneId === 'bookshelf') return { src: studyImages.bookshelf, alt: '大きな本棚', fallback: '大きな本棚' };
  if (sceneId === 'desk') return { src: studyImages.desk, alt: '書斎机', fallback: '書斎机' };
  if (sceneId === 'typewriter') return { src: studyImages.typewriter, alt: 'タイプライター', fallback: 'タイプライター' };
  if (sceneId === 'fireplace') return { src: studyImages.fireplace, alt: '暖炉', fallback: '暖炉' };
  if (sceneId === 'globe') return { src: studyImages.globe, alt: '地球儀', fallback: '地球儀' };
  if (sceneId === 'portrait') return { src: studyImages.portrait, alt: '肖像画', fallback: '肖像画' };
  if (sceneId === 'side-table') return { src: studyImages.sideTable, alt: 'サイドテーブル', fallback: 'サイドテーブル' };
  if (sceneId === 'door') return { src: state.flags.doorUnlocked || state.isCleared ? studyImages.doorOpen : studyImages.door, alt: '出口の扉', fallback: '出口の扉' };
  return { src: studyImages.main, alt: '忘れられた書斎', fallback: '忘れられた書斎' };
}

function getCurrentHintPuzzle(state: StudyGameState): StudyPuzzleId {
  if (!state.flags.diaryRestored) return 'diaryRestore';
  if (!state.flags.memoryRouteAligned) return 'memoryGlobe';
  if (!state.flags.paperAligned) return 'paperOverlay';
  return 'typewriterCode';
}

function hintTitle(id: StudyPuzzleId) {
  const titles: Record<StudyPuzzleId, string> = {
    diaryRestore: '日記復元',
    memoryGlobe: '地球儀回転',
    paperOverlay: '半透明紙の重ね合わせ',
    typewriterCode: 'タイプライター',
  };
  return titles[id];
}
