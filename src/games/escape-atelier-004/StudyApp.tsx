import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { GameImage } from '../../components/common/GameImage';
import { Modal } from '../../components/common/Modal';
import { ItemDetailModal } from '../../engine/inventory/ItemDetailModal';
import { findCombineRule, normalizeInventory, resolveItemDefinition } from '../../engine/inventory/inventoryUtils';
import { NotebookModal } from '../../engine/notebook/NotebookModal';
import { getUnreadClueCount } from '../../engine/notebook/notebookUtils';
import { PhaserPuzzle } from '../../engine/phaser/PhaserPuzzle';
import { studyGameConfig } from './gameConfig';
import { studyClues } from './data/clues';
import { studyHints } from './data/hints';
import { studyImages } from './data/imageAssets';
import { studyItemCombineRules } from './data/itemCombineRules';
import { studyItems } from './data/items';
import { isCorrectTypewriterCode } from './data/puzzles';
import { resolveInvestigationMessage, studyInvestigationTargetLabels } from './data/investigationTargets';
import { sceneCopy, studyHotspots } from './data/scenes';
import { endingPages, prologuePages } from './data/story';
import { BookshelfPuzzle } from './components/puzzles/BookshelfPuzzle';
import { PortraitTimePuzzle } from './components/puzzles/PortraitTimePuzzle';
import { TypewriterPuzzle } from './components/puzzles/TypewriterPuzzle';
import { studyAudioService } from './audio/studyAudioService';
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
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [puzzle, setPuzzle] = useState<PuzzleOverlay>(null);
  const [confirmDoor, setConfirmDoor] = useState(false);
  const solved = useMemo(() => new Set(state.solvedPuzzles), [state.solvedPuzzles]);
  const notebookData = { clues: state.notebook.clues, investigationLog: state.investigationLog.entries };
  const unreadClues = getUnreadClueCount(notebookData);
  const stageImage = getStageImage(state.currentScene, state);

  useEffect(() => {
    if (!launchMode || launchHandled.current) return;
    launchHandled.current = true;
    dispatch({ type: launchMode === 'start' ? 'START_NEW' : 'CONTINUE' });
  }, [dispatch, launchMode]);

  useEffect(() => {
    const bgmId = state.currentScene === 'title' ? 'title-bgm' : state.currentScene === 'ending' ? 'ending-bgm' : 'study-bgm';
    studyAudioService.playBgm(bgmId, state.settings);
    return () => studyAudioService.stopBgm();
  }, [state.currentScene, state.settings]);

  const go = (scene: StudySceneId) => dispatch({ type: 'GO_SCENE', scene });
  const collect = (itemId: StudyItemId, text: string) => {
    dispatch({ type: 'ACQUIRE_ITEM', itemId });
    studyAudioService.playSe('item-get', state.settings);
    showMessage(text);
  };
  const discoverClue = (clueId: string) => {
    if (!studyClues[clueId] || state.notebook.clues.some((clue) => clue.clueId === clueId)) return;
    dispatch({ type: 'DISCOVER_CLUE', clueId });
    showMessage(`ノートに記録しました: ${studyClues[clueId].title}`);
  };
  const recordInvestigation = (targetId: string) => {
    dispatch({ type: 'RECORD_INVESTIGATION', targetId, message: resolveInvestigationMessage(targetId, state.flags) });
  };

  const handleSceneAction = () => {
    if (state.currentScene === 'bookshelf') {
      if (!state.collectedItems.includes('diary-piece-02')) collect('diary-piece-02', '左の棚から、日記の破れたページが一枚すべり落ちた。');
      else if (!state.collectedItems.includes('cipher-sheet')) {
        collect('cipher-sheet', '中央の棚の薄い本から、古い暗号表を見つけた。');
        discoverClue('cipher-table');
      }
      else if (!['diary-piece-01', 'diary-piece-02', 'diary-piece-03'].every((itemId) => state.collectedItems.includes(itemId as StudyItemId))) showMessage('日記を戻すには、まだ足りないページがある。');
      else if (!solved.has('diary-repair')) setPuzzle('diary');
      else if (state.flags.overlaySolved && !solved.has('bookshelf')) showMessage('重なった手掛かりの本とページを選べそうだ。');
      else showMessage('本棚は静かだ。必要な手掛かりが揃えば、指定された本を開ける。');
      return;
    }
    if (state.currentScene === 'fireplace') {
      if (state.selectedItemId === 'sealed-letter') {
        dispatch({ type: 'USE_ITEM_ON_TARGET', itemId: 'sealed-letter', targetId: 'fireplace' });
        studyAudioService.playSe('fireplace', state.settings);
        showMessage('封蝋が少し柔らかくなった。');
      } else if (!state.flags.diaryRestored) showMessage('暖炉には弱い熱が残っている。何かを温める手掛かりが必要だ。');
      else showMessage('灰の中には、もう読めるものは残っていない。');
      return;
    }
    if (state.currentScene === 'side-table') {
      if (!state.collectedItems.includes('diary-piece-03')) collect('diary-piece-03', '小さな引き出しの奥から、日記の破れたページを見つけた。');
      else if (!state.collectedItems.includes('transparent-sheet')) {
        dispatch({ type: 'SET_FLAG', key: 'transparentSheetFound', value: true });
        collect('transparent-sheet', '赤い線の入った半透明の紙を見つけた。');
      }
      else showMessage('封蝋は割れている。誰かがここで返事を待っていたようだ。');
      return;
    }
    if (state.currentScene === 'portrait') {
      if (!solved.has('bookshelf')) showMessage('額縁には「忘れても、帰れる」と刻まれている。まだ時刻は分からない。');
      else if (!solved.has('portrait-time')) {
        discoverClue('portrait-clock');
        showMessage('肖像画の裏に小さな時刻合わせがある。');
      }
      else showMessage('肖像画の裏は開き、鍵が取り出された。');
      return;
    }
    if (state.currentScene === 'desk') {
      if (!state.collectedItems.includes('diary-piece-01')) collect('diary-piece-01', '引き出しの底から、日記の破れたページを見つけた。');
      else if (!state.collectedItems.includes('paper-knife')) collect('paper-knife', '机の引き出しから、真鍮のペーパーナイフを見つけた。');
      else if (!state.collectedItems.includes('sealed-letter')) {
        collect('sealed-letter', '日記の下から、赤い封蝋で閉じられた手紙を拾った。');
        discoverClue('sealed-letter');
      }
      else if (state.collectedItems.includes('typed-paper') && state.collectedItems.includes('transparent-sheet') && !state.flags.paperAligned) setPuzzle('paper');
      else showMessage(state.flags.paperAligned ? '紙には BOOK 7 / PAGE 23 の手掛かりが残っている。' : '机には、まだ読めない紙片の記憶が残っている。');
      return;
    }
    if (state.currentScene === 'globe') {
      if (!state.flags.diaryRestored) showMessage('地球儀は固く、まだ動かない。書斎の記憶が足りないようだ。');
      else if (!state.flags.letterOpened) showMessage('地球儀には方角の入力がある。手掛かりになる手紙が必要だ。');
      else if (!state.flags.memoryRouteAligned) setPuzzle('globe');
      else showMessage('地球儀の航路は、書斎へ帰る道筋を指している。');
      return;
    }
    if (state.currentScene === 'typewriter') {
      if (!state.flags.memoryRouteAligned) showMessage('タイプライターは沈黙している。先に地球儀の航路を戻す必要がありそうだ。');
      else if (!state.collectedItems.includes('ink-ribbon')) collect('ink-ribbon', 'タイプライターの横から、乾きかけのインクリボンを見つけた。');
      else if (state.selectedItemId === 'ink-ribbon' && !state.flags.typewriterReady) {
        dispatch({ type: 'USE_ITEM_ON_TARGET', itemId: 'ink-ribbon', targetId: 'typewriter' });
        studyAudioService.playSe('typewriter', state.settings);
        showMessage('インクリボンを戻した。キーを押せば、まだ文字を刻めそうだ。');
      } else if (!state.flags.typewriterReady) showMessage('インクリボンを選んで取り付ける必要がある。');
      else if (!state.collectedItems.includes('cipher-sheet')) showMessage('打つべき言葉を読むための暗号表が必要だ。');
      else showMessage('暗号表で読んだ言葉を入力できそうだ。');
      return;
    }
    if (state.currentScene === 'exit-door') {
      if (!state.collectedItems.includes('study-key')) showMessage('扉は開かない。真鍮の鍵穴が、最後の記憶を待っている。');
      else if (state.selectedItemId !== 'study-key') showMessage('書斎の鍵を選べば、扉を開けられそうだ。');
      else setConfirmDoor(true);
    }
  };

  const solveTypewriter = () => {
    if (!state.flags.typewriterReady) {
      showMessage('先にインクリボンを取り付ける必要がある。');
      return;
    }
    if (!isCorrectTypewriterCode(state.puzzleStates.typewriter.input)) {
      showMessage('キーの並びが違う。手紙に浮かんだ言葉を思い出そう。');
      return;
    }
    dispatch({ type: 'SOLVE_PUZZLE', puzzleId: 'typewriter' });
    studyAudioService.playSe('typewriter', state.settings);
    showMessage('最後の文字が打たれると、タイプライターから紙が一枚送り出された。');
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
    return <StoryView pages={prologuePages} page={storyPage} title="Prologue" onNext={() => (storyPage + 1 >= prologuePages.length ? go('study-main') : setStoryPage(storyPage + 1))} onSkip={() => go('study-main')} />;
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

  const isMain = state.currentScene === 'study-main';

  return (
    <main className="studyShell">
      <header className="studyHeader">
        {!isMain ? <button type="button" onClick={() => go('study-main')}>戻る</button> : <span />}
        <div><span>{studyGameConfig.seriesName}</span><strong>{studyGameConfig.episode} {studyGameConfig.title}</strong></div>
        <button type="button" onClick={() => go('study-main')}>書斎</button>
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
                  recordInvestigation(hotspot.id);
                  if (hotspot.clueIdOnInspect) discoverClue(hotspot.clueIdOnInspect);
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
      <nav className="studyBottom">
        <button type="button" onClick={() => setNotebookOpen(true)} aria-label={`ノートを開く。未読 ${unreadClues} 件`}>
          ノート {unreadClues > 0 ? <span>{unreadClues}</span> : null}
        </button>
        <button type="button" onClick={() => setHintsOpen(true)}>ヒント</button>
        <button type="button" onClick={() => setSettingsOpen(true)}>設定</button>
      </nav>
      {message && <div className="messageToast">{message}</div>}
      {settingsOpen && <StudySettings onClose={() => setSettingsOpen(false)} />}
      {hintsOpen && <StudyHints onClose={() => setHintsOpen(false)} />}
      {notebookOpen && (
        <NotebookModal
          data={notebookData}
          definitions={studyClues}
          targetLabels={studyInvestigationTargetLabels}
          onClose={() => setNotebookOpen(false)}
          onMarkRead={(clueId) => dispatch({ type: 'MARK_CLUE_READ', clueId })}
        />
      )}
      {confirmDoor && <ConfirmDoor onCancel={() => setConfirmDoor(false)} onOpen={() => { dispatch({ type: 'USE_ITEM_ON_TARGET', itemId: 'study-key', targetId: 'exit-door' }); dispatch({ type: 'CLEAR_GAME' }); }} />}
      {puzzle === 'diary' && (
        <PhaserPuzzle
          title="日記復元"
          instructions="ページを入れ替え、季節の記憶を正しい順番へ戻してください。"
          initialState={state.puzzleStates.diaryRepair}
          createConfig={createDiaryRestorePuzzleConfig}
          onStateChange={(nextState) => dispatch({ type: 'SET_DIARY_REPAIR_STATE', state: nextState })}
          onCancel={(nextState) => { dispatch({ type: 'SET_DIARY_REPAIR_STATE', state: nextState }); setPuzzle(null); }}
          onComplete={(nextState) => {
            dispatch({ type: 'SET_DIARY_REPAIR_STATE', state: nextState });
            dispatch({ type: 'SOLVE_PUZZLE', puzzleId: 'diary-repair' });
            dispatch({ type: 'SET_FLAG', key: 'diaryRestored', value: true });
            dispatch({ type: 'SET_FLAG', key: 'globeUnlocked', value: true });
            dispatch({ type: 'DISCOVER_CLUE', clueId: 'diary-restored' });
            dispatch({ type: 'RECORD_INVESTIGATION', targetId: 'diary-restore', message: '日記のページを復元した。' });
            studyAudioService.playSe('paper', state.settings);
            setPuzzle(null);
            showMessage('日記が春から冬へつながった。地球儀の留め具が小さく鳴った。');
          }}
        />
      )}
      {puzzle === 'globe' && (
        <PhaserPuzzle
          title="地球儀回転"
          instructions="館を巡った記憶の航路を順番に選んでください。"
          initialState={state.puzzleStates.globe}
          createConfig={createMemoryGlobePuzzleConfig}
          onStateChange={(nextState) => dispatch({ type: 'SET_GLOBE_ROUTES', selectedRouteIds: nextState.selectedRouteIds })}
          onCancel={(nextState) => { dispatch({ type: 'SET_GLOBE_ROUTES', selectedRouteIds: nextState.selectedRouteIds }); setPuzzle(null); }}
          onComplete={(nextState) => {
            dispatch({ type: 'SET_GLOBE_ROUTES', selectedRouteIds: nextState.selectedRouteIds });
            dispatch({ type: 'SOLVE_PUZZLE', puzzleId: 'globe' });
            dispatch({ type: 'SET_FLAG', key: 'memoryRouteAligned', value: true });
            studyAudioService.playSe('globe', state.settings);
            setPuzzle(null);
            showMessage('地球儀の航路が書斎へ戻った。机の手紙がほのかに光っている。');
          }}
        />
      )}
      {puzzle === 'paper' && (
        <PhaserPuzzle
          title="半透明紙の重ね合わせ"
          instructions="紙を動かして、手紙の欠けた文字を読める位置へ重ねてください。"
          initialState={state.puzzleStates.overlayPaper}
          createConfig={createPaperOverlayPuzzleConfig}
          onStateChange={(nextState) => dispatch({ type: 'SET_PAPER_OVERLAY', state: nextState })}
          onCancel={(nextState) => { dispatch({ type: 'SET_PAPER_OVERLAY', state: nextState }); setPuzzle(null); }}
          onComplete={(nextState) => {
            dispatch({ type: 'SET_PAPER_OVERLAY', state: nextState });
            dispatch({ type: 'SOLVE_PUZZLE', puzzleId: 'overlay-paper' });
            dispatch({ type: 'SET_FLAG', key: 'paperAligned', value: true });
            dispatch({ type: 'DISCOVER_CLUE', clueId: 'overlay-result' });
            dispatch({ type: 'ACQUIRE_ITEM', itemId: 'overlay-clue' });
            dispatch({ type: 'RECORD_INVESTIGATION', targetId: 'paper-overlay', message: '半透明の紙を重ね、文字を読んだ。' });
            studyAudioService.playSe('correct', state.settings);
            setPuzzle(null);
            showMessage('欠けた文字が重なり、BOOK 7 / PAGE 23 と読めるようになった。');
          }}
        />
      )}
    </main>
  );
}

function FocusPanel({ sceneId, onAction, onTypewriterSubmit }: { sceneId: StudySceneId; onAction: () => void; onTypewriterSubmit: () => void }) {
  const { state, dispatch, showMessage } = useStudy();
  const copy = sceneCopy[sceneId as keyof typeof sceneCopy];
  if (!copy) return null;
  const solved = new Set(state.solvedPuzzles);
  return (
    <div className="studyFocus">
      <h2>{copy.title}</h2>
      <p>{copy.description}</p>
      {sceneId === 'typewriter' && state.flags.typewriterReady && state.collectedItems.includes('cipher-sheet') && !solved.has('typewriter') ? (
        <TypewriterPuzzle
          state={state.puzzleStates.typewriter}
          onChange={(nextState) => dispatch({ type: 'SET_TYPEWRITER_INPUT', input: nextState.input })}
          onComplete={onTypewriterSubmit}
        />
      ) : null}
      {sceneId === 'bookshelf' && state.flags.overlaySolved && !solved.has('bookshelf') ? (
        <BookshelfPuzzle
          state={state.puzzleStates.bookshelf}
          onChange={(nextState) => dispatch({ type: 'SET_BOOKSHELF_STATE', state: nextState })}
          onComplete={() => {
            dispatch({ type: 'SOLVE_PUZZLE', puzzleId: 'bookshelf' });
            dispatch({ type: 'RECORD_INVESTIGATION', targetId: 'bookshelfPuzzle', message: 'BOOK 7 の PAGE 23 を開いた。' });
            studyAudioService.playSe('correct', state.settings);
            showMessage('ページに「肖像画の時刻は七時十五分」と記されていた。');
          }}
        />
      ) : null}
      {sceneId === 'portrait' && solved.has('bookshelf') && !solved.has('portrait-time') ? (
        <PortraitTimePuzzle
          state={state.puzzleStates.portraitTime}
          onChange={(nextState) => dispatch({ type: 'SET_PORTRAIT_TIME', state: nextState })}
          onComplete={() => {
            dispatch({ type: 'SOLVE_PUZZLE', puzzleId: 'portrait-time' });
            dispatch({ type: 'RECORD_INVESTIGATION', targetId: 'portraitTime', message: '肖像画の時刻を07:15に合わせた。' });
            studyAudioService.playSe('correct', state.settings);
            showMessage('肖像画の裏から、書斎の鍵が滑り落ちた。');
          }}
        />
      ) : null}
      <button type="button" onClick={onAction}>調べる / 使う</button>
    </div>
  );
}

function Inventory() {
  const { state, dispatch, showMessage } = useStudy();
  const [detailItem, setDetailItem] = useState<StudyItemId | null>(null);
  const inventoryData = normalizeInventory(state.inventory, studyItems, state.selectedItemId, state.itemStates, state.collectedItems, state.usedItems);
  const getCombinableItems = (itemId: StudyItemId) =>
    inventoryData.inventory
      .map((entry) => entry.itemId)
      .filter((candidateId) => candidateId !== itemId && Boolean(findCombineRule(studyItemCombineRules, itemId, candidateId)));
  const combineItems = (firstItemId: StudyItemId, secondItemId: StudyItemId) => {
    const rule = findCombineRule(studyItemCombineRules, firstItemId, secondItemId);
    dispatch({ type: 'COMBINE_ITEMS', firstItemId, secondItemId });
    if (rule && !state.completedCombineRules.includes(rule.id)) showMessage(rule.successMessage);
    else showMessage('この二つは組み合わせられないようだ。');
    setDetailItem(null);
  };
  const openDetail = (itemId: StudyItemId) => {
    const item = studyItems[itemId];
    if (item.clueIdOnInspect && !state.notebook.clues.some((clue) => clue.clueId === item.clueIdOnInspect)) {
      dispatch({ type: 'DISCOVER_CLUE', clueId: item.clueIdOnInspect });
      showMessage(`ノートに記録しました: ${studyClues[item.clueIdOnInspect]?.title ?? item.name}`);
    }
    setDetailItem(itemId);
  };

  return (
    <>
      <section className="studyInventory" aria-label="インベントリ">
        {state.inventory.length === 0 ? <p>持ち物はありません</p> : null}
        {state.inventory.map((entry) => {
          const item = resolveItemDefinition(studyItems, entry.itemId, entry.stateId);
          if (!item) return null;
          const itemId = entry.itemId as StudyItemId;
          return (
            <div className="studyInventorySlot" key={`${entry.itemId}-${entry.acquiredAt ?? 0}`}>
              <button type="button" className={state.selectedItemId === itemId ? 'studyInventoryItem selected' : 'studyInventoryItem'} onClick={() => dispatch({ type: 'SELECT_ITEM', itemId })} aria-label={`${item.name}を選ぶ`}>
                <GameImage src={item.image ?? ''} alt={item.alt ?? item.name} fallbackLabel={item.name} className="studyItemIcon" decorative />
                <span>{item.name}</span>
                {entry.isUsed ? <em>使用済み</em> : null}
              </button>
              <button type="button" className="studyDetailButton" onClick={() => openDetail(itemId)} aria-label={`${item.name}の詳細`}>i</button>
            </div>
          );
        })}
      </section>
      {detailItem && (
        <ItemDetailModal
          itemId={detailItem}
          inventoryData={inventoryData}
          definitions={studyItems}
          combinableItemIds={getCombinableItems(detailItem)}
          onClose={() => setDetailItem(null)}
          onSelectItem={(itemId) => {
            dispatch({ type: 'SELECT_ITEM', itemId: itemId as StudyItemId });
            setDetailItem(null);
          }}
          onSetItemState={(itemId, stateId) => dispatch({ type: 'SET_ITEM_STATE', itemId: itemId as StudyItemId, stateId })}
          onCombine={(firstItemId, secondItemId) => combineItems(firstItemId as StudyItemId, secondItemId as StudyItemId)}
        />
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
  const { state } = useStudy();
  return <Modal title="記憶の鍵を使いますか？" onClose={onCancel}><div className="studyConfirm"><button type="button" onClick={onCancel}>やめる</button><button type="button" onClick={() => { studyAudioService.playSe('door', state.settings); onOpen(); }}>鍵を回す</button></div></Modal>;
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
  if (sceneId === 'exit-door') return { src: state.flags.exitDoorUnlocked || state.flags.doorUnlocked || state.isCleared ? studyImages.doorOpen : studyImages.door, alt: '出口の扉', fallback: '出口の扉' };
  return { src: studyImages.main, alt: '忘れられた書斎', fallback: '忘れられた書斎' };
}

function getCurrentHintPuzzle(state: StudyGameState): StudyPuzzleId {
  if (!state.flags.diaryRestored) return 'diary-repair';
  if (!state.flags.memoryRouteAligned) return 'globe';
  if (!state.flags.typewriterSolved) return 'typewriter';
  if (!state.flags.paperAligned) return 'overlay-paper';
  if (!state.flags.targetBookOpened) return 'bookshelf';
  if (!state.flags.finalTimeSolved) return 'portrait-time';
  return 'typewriter';
}

function hintTitle(id: StudyPuzzleId) {
  const titles: Record<StudyPuzzleId, string> = {
    'diary-repair': '日記復元',
    globe: '地球儀回転',
    'overlay-paper': '半透明紙の重ね合わせ',
    typewriter: 'タイプライター',
    bookshelf: '本棚',
    'portrait-time': '肖像画の時刻',
  };
  return titles[id];
}

