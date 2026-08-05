import { useMemo, useState, type ReactNode } from 'react';
import { GameImage } from '../../components/common/GameImage';
import { Modal } from '../../components/common/Modal';
import { PhaserPuzzle } from '../../engine/phaser/PhaserPuzzle';
import { observatoryGameConfig } from './data/gameConfig';
import { observatoryHints } from './data/hints';
import { observatoryImages } from './data/imageAssets';
import { observatoryItems } from './data/items';
import { dawnTimeAnswer, isCorrectDawnTime, isCorrectMoonPhaseOrder, moonPhaseLabels } from './data/puzzles';
import { lowerHotspots, sceneCopy, upperHotspots } from './data/scenes';
import { endingPages, prologuePages } from './data/story';
import { createCelestialGlobePuzzleConfig } from './puzzles/celestial-globe/config';
import { createConstellationLinesPuzzleConfig } from './puzzles/constellation-lines/config';
import { createConstellationPlatePuzzleConfig } from './puzzles/constellation-plate/config';
import { createTelescopePuzzleConfig } from './puzzles/telescope/config';
import { hasObservatorySaveData } from './state/saveService';
import { useObservatory } from './state/useObservatory';
import type { ObservatoryGameState, ObservatoryItemId, ObservatoryPuzzleId, ObservatorySceneId } from './types';
import './ObservatoryApp.css';

type PuzzleOverlay = 'plate' | 'globe' | 'telescope' | 'lines' | null;

export function ObservatoryApp({ onSeriesSelect }: { onSeriesSelect: () => void }) {
  const { state, dispatch, message, showMessage } = useObservatory();
  const [storyPage, setStoryPage] = useState(0);
  const [endingPage, setEndingPage] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hintsOpen, setHintsOpen] = useState(false);
  const [puzzle, setPuzzle] = useState<PuzzleOverlay>(null);
  const [confirmSkylight, setConfirmSkylight] = useState(false);
  const solved = useMemo(() => new Set(state.solvedPuzzles), [state.solvedPuzzles]);
  const stageImage = getStageImage(state.currentScene, state);

  const go = (scene: ObservatorySceneId) => dispatch({ type: 'GO_SCENE', scene, area: scene === 'upper-main' ? 'upper-floor' : scene === 'lower-main' ? 'lower-floor' : undefined });
  const collect = (itemId: ObservatoryItemId, text: string) => {
    dispatch({ type: 'COLLECT_ITEM', itemId });
    showMessage(text);
  };

  const startPlatePuzzle = () => {
    const hasPieces = ['platePiece1', 'platePiece2', 'platePiece3'].every((itemId) => state.inventory.includes(itemId as ObservatoryItemId));
    if (!hasPieces) showMessage('まだ足りない破片があるようだ。');
    else setPuzzle('plate');
  };

  const startGlobePuzzle = () => {
    if (!state.inventory.includes('constellationPlate') || !state.flags.starClockGearInstalled || !state.flags.moonPuzzleSolved) {
      showMessage('星座盤、月の記録、星時計の歯車がまだ揃っていない。');
      return;
    }
    setPuzzle('globe');
  };

  const startTelescopePuzzle = () => {
    if (!state.flags.celestialGlobeAligned || !state.flags.telescopeLensInstalled) {
      showMessage('望遠鏡はまだ観測できる状態ではない。');
      return;
    }
    setPuzzle('telescope');
  };

  const startLinesPuzzle = () => {
    if (!state.inventory.includes('starRecord')) showMessage('どの星を結べばよいか分からない。');
    else setPuzzle('lines');
  };

  const handleSceneAction = () => {
    if (state.currentScene === 'desk') {
      if (!state.collectedItems.includes('platePiece1')) collect('platePiece1', '机の下から星座盤の破片を見つけた。');
      else showMessage('日記には、月が満ちていく順番が丁寧に記されている。');
      return;
    }
    if (state.currentScene === 'constellation-wall') {
      if (!state.collectedItems.includes('platePiece2')) collect('platePiece2', '星座図の額縁の裏から破片を見つけた。');
      else if (!state.flags.constellationPlateRepaired) startPlatePuzzle();
      else startLinesPuzzle();
      return;
    }
    if (state.currentScene === 'staircase') {
      if (!state.collectedItems.includes('platePiece3')) collect('platePiece3', '螺旋階段の踊り場で破片を拾った。');
      else if (state.currentArea === 'lower-floor') go('upper-main');
      else go('lower-main');
      return;
    }
    if (state.currentScene === 'moon-model') {
      if (!solved.has('moonPhases')) showMessage('月相カードを、月が満ちていく順番へ並べ替えよう。');
      else showMessage('月の模型の奥は開いている。真鍮の歯車はもう回収した。');
      return;
    }
    if (state.currentScene === 'star-clock') {
      if (!state.flags.starClockGearInstalled) {
        if (!state.inventory.includes('brassGear')) showMessage('内部の歯車が一つ欠けている。');
        else if (state.selectedItemId !== 'brassGear') showMessage(state.selectedItemId ? 'ここでは使えないようだ。' : '真鍮の歯車を選べば取り付けられそうだ。');
        else {
          dispatch({ type: 'USE_ITEM', itemId: 'brassGear', consume: true });
          dispatch({ type: 'SET_FLAG', key: 'starClockGearInstalled', value: true });
          showMessage('歯車を取り付けた。まだ何かが足りないようだ。');
        }
      } else showMessage(state.flags.starClockStarted ? `星時計は夜明けの時刻 ${dawnTimeAnswer} を示している。` : '歯車は噛み合ったが、時計はまだ止まっている。');
      return;
    }
    if (state.currentScene === 'celestial-globe') {
      if (!state.flags.celestialGlobeAligned) startGlobePuzzle();
      else if (!state.collectedItems.includes('smallLens')) collect('smallLens', '天球儀の台座から小さなレンズが現れた。');
      else showMessage('天球儀の星は、静かに同じ位置を指している。');
      return;
    }
    if (state.currentScene === 'telescope') {
      if (!state.flags.telescopeLensInstalled) {
        if (!state.inventory.includes('smallLens')) showMessage('レンズが一枚欠けている。');
        else if (state.selectedItemId !== 'smallLens') showMessage(state.selectedItemId ? 'ここでは使えないようだ。' : '小さなレンズを選べば取り付けられそうだ。');
        else {
          dispatch({ type: 'USE_ITEM', itemId: 'smallLens', consume: true });
          dispatch({ type: 'SET_FLAG', key: 'telescopeLensInstalled', value: true });
          dispatch({ type: 'SET_FLAG', key: 'telescopeUnlocked', value: true });
          showMessage('レンズを取り付けた。望遠鏡の視界が澄んでいく。');
        }
      } else startTelescopePuzzle();
      return;
    }
    if (state.currentScene === 'skylight') {
      if (!state.flags.dawnTimeSolved) showMessage('天窓の装置には、夜明けの時刻を入力する必要がある。');
      else if (!state.inventory.includes('dawnKey')) showMessage('天窓には、星形の鍵穴がある。');
      else if (state.selectedItemId !== 'dawnKey') showMessage(state.selectedItemId ? 'ここでは使えないようだ。' : '夜明けの鍵を選べば開けられそうだ。');
      else setConfirmSkylight(true);
    }
  };

  if (state.currentScene === 'title') {
    return (
      <main className="obsTitle">
        <GameImage src={observatoryImages.title} alt="星降る天文台" fallbackLabel="星降る天文台" className="obsBackdropImage" decorative />
        <section className="obsTitleText">
          <p>{observatoryGameConfig.seriesName}</p>
          <h1>{observatoryGameConfig.episode}<span>{observatoryGameConfig.title}</span></h1>
          <div className="obsButtons">
            <button type="button" onClick={() => dispatch({ type: 'START_NEW' })}>はじめから</button>
            <button type="button" disabled={!hasObservatorySaveData()} onClick={() => dispatch({ type: 'CONTINUE' })}>つづきから</button>
            <button type="button" onClick={() => setSettingsOpen(true)}>設定</button>
            <button type="button" onClick={onSeriesSelect}>作品選択</button>
          </div>
        </section>
        {settingsOpen && <ObservatorySettings onClose={() => setSettingsOpen(false)} />}
      </main>
    );
  }

  if (state.currentScene === 'prologue') {
    return <StoryView pages={prologuePages} page={storyPage} title="Prologue" onNext={() => (storyPage + 1 >= prologuePages.length ? go('lower-main') : setStoryPage(storyPage + 1))} onSkip={() => go('lower-main')} />;
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
        actions={<><button type="button" onClick={() => go('title')}>タイトルへ戻る</button><button type="button" onClick={() => dispatch({ type: 'START_NEW' })}>もう一度遊ぶ</button><button type="button" onClick={onSeriesSelect}>シリーズ選択へ戻る</button></>}
      />
    );
  }

  const isMain = state.currentScene === 'lower-main' || state.currentScene === 'upper-main';
  const hotspots = state.currentScene === 'upper-main' ? upperHotspots : lowerHotspots;

  return (
    <main className="obsShell">
      <header className="obsHeader">
        {!isMain ? <button type="button" onClick={() => go(state.currentArea === 'upper-floor' ? 'upper-main' : 'lower-main')}>戻る</button> : <span />}
        <div><span>{observatoryGameConfig.seriesName}</span><strong>{observatoryGameConfig.episode} {observatoryGameConfig.title}</strong></div>
        <button type="button" onClick={() => go(state.currentArea === 'upper-floor' ? 'upper-main' : 'lower-main')}>{state.currentArea === 'upper-floor' ? '上階' : '下階'}</button>
      </header>

      <section className={`obsStage period-${state.timePeriod} scene-${state.currentScene}`} aria-label="天文台">
        <GameImage src={stageImage.src} alt={stageImage.alt} fallbackLabel={stageImage.fallback} className="obsStageImage" decorative />
        {isMain ? (
          <>
            <h2>{state.currentArea === 'upper-floor' ? '天文台 上階' : '天文台 下階'}</h2>
            {hotspots.map((hotspot) => (
              <button
                key={hotspot.id}
                type="button"
                className="obsHotspot"
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, width: `${hotspot.width}%`, height: `${hotspot.height}%` }}
                onClick={() => {
                  dispatch({ type: 'INSPECT', pointId: hotspot.id });
                  if (hotspot.targetScene) dispatch({ type: 'GO_SCENE', scene: hotspot.targetScene, area: hotspot.targetArea });
                }}
                aria-label={hotspot.label}
              />
            ))}
          </>
        ) : (
          <FocusPanel sceneId={state.currentScene} onAction={handleSceneAction} onMoonSolved={() => {
            dispatch({ type: 'SOLVE_PUZZLE', puzzleId: 'moonPhases' });
            dispatch({ type: 'SET_FLAG', key: 'moonPuzzleSolved', value: true });
            collect('brassGear', '星時計内部の小さな扉が開き、真鍮の歯車を手に入れた。');
          }} />
        )}
      </section>

      <Inventory />
      <nav className="obsBottom"><button type="button" onClick={() => setHintsOpen(true)}>ヒント</button><button type="button" onClick={() => setSettingsOpen(true)}>設定</button><button type="button" onClick={onSeriesSelect}>作品選択</button></nav>
      {message && <div className="messageToast">{message}</div>}
      {settingsOpen && <ObservatorySettings onClose={() => setSettingsOpen(false)} />}
      {hintsOpen && <ObservatoryHints onClose={() => setHintsOpen(false)} />}
      {confirmSkylight && <ConfirmSkylight onCancel={() => setConfirmSkylight(false)} onOpen={() => { dispatch({ type: 'USE_ITEM', itemId: 'dawnKey', consume: true }); dispatch({ type: 'CLEAR_GAME' }); }} />}
      {puzzle === 'plate' && <PhaserPuzzle title="星座盤の修復" instructions="破片をドラッグし、タップで90度回転させてください。" initialState={state.puzzleStates.constellationPlate} createConfig={createConstellationPlatePuzzleConfig} onCancel={(nextState) => { dispatch({ type: 'SET_PLATE_STATE', state: nextState }); setPuzzle(null); }} onComplete={(nextState) => { dispatch({ type: 'SET_PLATE_STATE', state: nextState }); dispatch({ type: 'SOLVE_PUZZLE', puzzleId: 'constellationPlate' }); dispatch({ type: 'SET_FLAG', key: 'constellationPlateRepaired', value: true }); dispatch({ type: 'REMOVE_ITEMS', itemIds: ['platePiece1', 'platePiece2', 'platePiece3'] }); dispatch({ type: 'COLLECT_ITEM', itemId: 'constellationPlate' }); setPuzzle(null); showMessage('星座盤が修復された。'); }} />}
      {puzzle === 'globe' && <PhaserPuzzle title="天球儀" instructions="左右へ動かし、星座盤の示す位置に合わせてください。" initialState={state.puzzleStates.celestialGlobe} createConfig={createCelestialGlobePuzzleConfig} onCancel={(nextState) => { dispatch({ type: 'SET_GLOBE_POSITION', positionId: nextState.positionId }); setPuzzle(null); }} onComplete={(nextState) => { dispatch({ type: 'SET_GLOBE_POSITION', positionId: nextState.positionId }); dispatch({ type: 'SOLVE_PUZZLE', puzzleId: 'celestialGlobe' }); dispatch({ type: 'SET_FLAG', key: 'celestialGlobeAligned', value: true }); dispatch({ type: 'SET_FLAG', key: 'telescopeUnlocked', value: true }); dispatch({ type: 'COLLECT_ITEM', itemId: 'smallLens' }); setPuzzle(null); showMessage('天球儀の星が柔らかく光り、小さなレンズを手に入れた。'); }} />}
      {puzzle === 'telescope' && <PhaserPuzzle title="望遠鏡の観測" instructions="視界を動かし、照準の中央で観測してください。" initialState={state.puzzleStates.telescope} createConfig={createTelescopePuzzleConfig} onCancel={(nextState) => { dispatch({ type: 'SET_TELESCOPE_STATE', state: nextState }); setPuzzle(null); }} onComplete={(nextState) => { dispatch({ type: 'SET_TELESCOPE_STATE', state: nextState }); dispatch({ type: 'SOLVE_PUZZLE', puzzleId: 'telescope' }); dispatch({ type: 'SET_FLAG', key: 'allStarsObserved', value: true }); dispatch({ type: 'COLLECT_ITEM', itemId: 'starRecord' }); setPuzzle(null); showMessage('三つの星を観測し、星の記録紙が完成した。'); }} />}
      {puzzle === 'lines' && <PhaserPuzzle title="星座を結ぶ" instructions="観測した星を記録紙の順番で選んでください。" initialState={state.puzzleStates.constellationLines} createConfig={createConstellationLinesPuzzleConfig} onCancel={(nextState) => { dispatch({ type: 'SET_CONSTELLATION_LINES', selectedStarIds: nextState.selectedStarIds }); setPuzzle(null); }} onComplete={(nextState) => { dispatch({ type: 'SET_CONSTELLATION_LINES', selectedStarIds: nextState.selectedStarIds }); dispatch({ type: 'SOLVE_PUZZLE', puzzleId: 'constellationLines' }); dispatch({ type: 'SET_FLAG', key: 'constellationConnected', value: true }); dispatch({ type: 'SET_FLAG', key: 'starClockStarted', value: true }); setPuzzle(null); showMessage(`星時計が動き出し、夜明けの時刻 ${dawnTimeAnswer} を示した。`); }} />}
    </main>
  );
}

function FocusPanel({ sceneId, onAction, onMoonSolved }: { sceneId: ObservatorySceneId; onAction: () => void; onMoonSolved: () => void }) {
  const { state, dispatch, showMessage } = useObservatory();
  const copy = sceneCopy[sceneId as keyof typeof sceneCopy];
  if (!copy) return null;
  return (
    <div className="obsFocus">
      <h2>{copy.title}</h2>
      <p>{getFocusDescription(sceneId, state, copy.description)}</p>
      {sceneId === 'moon-model' && !state.solvedPuzzles.includes('moonPhases') ? <MoonPuzzle onSolved={onMoonSolved} /> : null}
      {sceneId === 'star-clock' && state.flags.starClockStarted ? <StarClock /> : null}
      {sceneId === 'skylight' && state.flags.starClockStarted && !state.flags.dawnTimeSolved ? <DawnTimePuzzle onSolved={() => {
        dispatch({ type: 'SOLVE_PUZZLE', puzzleId: 'dawnTime' });
        dispatch({ type: 'SET_FLAG', key: 'dawnTimeSolved', value: true });
        dispatch({ type: 'SET_TIME_PERIOD', period: 'predawn' });
        dispatch({ type: 'COLLECT_ITEM', itemId: 'dawnKey' });
        showMessage('小さな収納が開き、夜明けの鍵を手に入れた。');
      }} /> : null}
      <button type="button" onClick={onAction}>調べる / 使う</button>
    </div>
  );
}

function getFocusDescription(sceneId: ObservatorySceneId, state: ObservatoryGameState, fallback: string) {
  if (sceneId === 'star-clock') {
    if (state.flags.starClockStarted) return `星時計は静かに動き、夜明けの時刻 ${dawnTimeAnswer} を示している。`;
    if (state.flags.starClockGearInstalled) return '歯車は取り付けられたが、時計盤はまだ完全には動かない。星の記録が必要なようだ。';
  }
  if (sceneId === 'telescope' && state.flags.telescopeLensInstalled) {
    return '小さなレンズが収まり、望遠鏡の視界が澄んでいる。星を観測できそうだ。';
  }
  if (sceneId === 'celestial-globe' && state.inventory.includes('constellationPlate')) {
    return '修復した星座盤の銀の印は、東西南北のどれでもなく天頂を示している。';
  }
  if (sceneId === 'skylight') {
    if (state.isCleared) return '開いた天窓の向こうに、淡い朝焼けが広がっている。';
    if (state.flags.dawnTimeSolved) return '夜明けの光が天窓の縁を照らしている。星形の鍵穴が見える。';
  }
  return fallback;
}

function MoonPuzzle({ onSolved }: { onSolved: () => void }) {
  const { state, dispatch, showMessage } = useObservatory();
  const order = state.puzzleStates.moonPhases.order;
  const [selected, setSelected] = useState<string | null>(null);
  const move = (delta: number) => {
    if (!selected) return;
    const index = order.indexOf(selected);
    const nextIndex = index + delta;
    if (nextIndex < 0 || nextIndex >= order.length) return;
    const next = [...order];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    dispatch({ type: 'SET_MOON_ORDER', order: next });
  };
  return (
    <div className="moonPuzzle">
      <div className="moonCards">{order.map((id) => <button key={id} type="button" className={selected === id ? 'selected' : ''} onClick={() => setSelected(id)}>{moonPhaseLabels[id as keyof typeof moonPhaseLabels]}</button>)}</div>
      <div className="obsButtons"><button type="button" onClick={() => move(-1)}>左へ</button><button type="button" onClick={() => move(1)}>右へ</button><button type="button" onClick={() => dispatch({ type: 'SET_MOON_ORDER', order: ['moon-half', 'moon-new', 'moon-full', 'moon-crescent'] })}>リセット</button><button type="button" onClick={() => (isCorrectMoonPhaseOrder(order) ? onSolved() : showMessage('月の順番が違うようだ。'))}>確認</button></div>
    </div>
  );
}

function StarClock() {
  return <div className="starClock" aria-label={`星時計は${dawnTimeAnswer}を示している`}><span>{dawnTimeAnswer}</span><i /></div>;
}

function DawnTimePuzzle({ onSolved }: { onSolved: () => void }) {
  const { state, dispatch, showMessage } = useObservatory();
  const [hour, minute] = state.puzzleStates.dawnTime.input.split(':').map(Number);
  const setTime = (nextHour: number, nextMinute: number) => dispatch({ type: 'SET_DAWN_TIME_INPUT', input: `${String((nextHour + 24) % 24).padStart(2, '0')}:${String((nextMinute + 60) % 60).padStart(2, '0')}` });
  return (
    <div className="timePuzzle">
      <div><button type="button" onClick={() => setTime(hour + 1, minute)}>時+</button><strong>{String(hour).padStart(2, '0')}</strong><button type="button" onClick={() => setTime(hour - 1, minute)}>時-</button></div>
      <div><button type="button" onClick={() => setTime(hour, minute + 5)}>分+</button><strong>{String(minute).padStart(2, '0')}</strong><button type="button" onClick={() => setTime(hour, minute - 5)}>分-</button></div>
      <button type="button" onClick={() => (isCorrectDawnTime(state.puzzleStates.dawnTime.input) ? onSolved() : showMessage('星時計の示す夜明けとは違うようだ。'))}>決定</button>
    </div>
  );
}

function Inventory() {
  const { state, dispatch } = useObservatory();
  return (
    <section className="obsInventory" aria-label="インベントリ">
      {state.inventory.length === 0 ? <p>持ち物はありません</p> : null}
      {state.inventory.map((itemId) => {
        const item = observatoryItems[itemId];
        return <button key={itemId} type="button" className={state.selectedItemId === itemId ? 'selected' : ''} onClick={() => dispatch({ type: 'SELECT_ITEM', itemId })} aria-label={`${item.name}を選択`}><img src={item.image} alt="" draggable={false} /><span>{item.name}</span></button>;
      })}
    </section>
  );
}

function ObservatoryHints({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useObservatory();
  const nextPuzzle = getCurrentHintPuzzle(state);
  const hints = observatoryHints[nextPuzzle];
  const viewed = state.viewedHints[nextPuzzle] ?? 0;
  return <Modal title="ヒント" onClose={onClose}><div className="obsHints"><h3>{hintTitle(nextPuzzle)}</h3>{hints.slice(0, viewed).map((hint) => <p key={hint}>{hint}</p>)}{viewed < hints.length && <button type="button" onClick={() => dispatch({ type: 'VIEW_HINT', puzzleId: nextPuzzle, level: viewed + 1 })}>ヒント{viewed + 1}を見る</button>}</div></Modal>;
}

function ObservatorySettings({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useObservatory();
  return <Modal title="設定" onClose={onClose}><div className="obsSettings"><label><input type="checkbox" checked={state.settings.bgmEnabled} onChange={(event) => dispatch({ type: 'UPDATE_SETTINGS', settings: { bgmEnabled: event.target.checked } })} /> BGM</label><label><input type="checkbox" checked={state.settings.seEnabled} onChange={(event) => dispatch({ type: 'UPDATE_SETTINGS', settings: { seEnabled: event.target.checked } })} /> SE</label><label>BGM音量<input type="range" min="0" max="1" step="0.05" value={state.settings.bgmVolume} onChange={(event) => dispatch({ type: 'UPDATE_SETTINGS', settings: { bgmVolume: Number(event.target.value) } })} /></label><label>SE音量<input type="range" min="0" max="1" step="0.05" value={state.settings.seVolume} onChange={(event) => dispatch({ type: 'UPDATE_SETTINGS', settings: { seVolume: Number(event.target.value) } })} /></label></div></Modal>;
}

function ConfirmSkylight({ onCancel, onOpen }: { onCancel: () => void; onOpen: () => void }) {
  return <Modal title="夜明けの鍵を使いますか？" onClose={onCancel}><div className="obsConfirm"><button type="button" onClick={onCancel}>やめる</button><button type="button" onClick={onOpen}>鍵を回す</button></div></Modal>;
}

function StoryView({ pages, page, title, onNext, onSkip, finished = false, actions }: { pages: string[]; page: number; title: string; onNext: () => void; onSkip?: () => void; finished?: boolean; actions?: ReactNode }) {
  return (
    <main className="obsStory">
      <GameImage src={finished ? observatoryImages.ending : observatoryImages.title} alt="天文台の夜明け" fallbackLabel="天文台の夜明け" className="obsBackdropImage" decorative />
      <section className="obsStoryText">{finished ? <><h1>{title}</h1><p>Escape Atelier #003</p><p>星降る天文台からの脱出</p><p>プレイしていただきありがとうございました</p><div className="obsButtons">{actions}</div></> : <><h1>{title}</h1><p>{pages[page]}</p><div className="obsButtons"><button type="button" onClick={onNext}>次へ</button>{onSkip && <button type="button" onClick={onSkip}>スキップ</button>}</div></>}</section>
    </main>
  );
}

function getStageImage(sceneId: ObservatorySceneId, state: ObservatoryGameState) {
  if (sceneId === 'lower-main') return { src: observatoryImages.lowerMain, alt: '天文台下階', fallback: '天文台下階' };
  if (sceneId === 'upper-main') return { src: observatoryImages.upperMain, alt: '天文台上階', fallback: '天文台上階' };
  if (sceneId === 'telescope') return { src: state.flags.telescopeLensInstalled ? observatoryImages.telescopeLensInstalled : observatoryImages.telescope, alt: '大型望遠鏡', fallback: '大型望遠鏡' };
  if (sceneId === 'celestial-globe') return { src: observatoryImages.celestialGlobe, alt: '天球儀', fallback: '天球儀' };
  if (sceneId === 'star-clock') return { src: state.flags.starClockStarted ? observatoryImages.starClockActive : state.flags.starClockGearInstalled ? observatoryImages.starClockGearInstalled : observatoryImages.starClock, alt: '星時計', fallback: '星時計' };
  if (sceneId === 'desk') return { src: observatoryImages.desk, alt: '書き物机', fallback: '書き物机' };
  if (sceneId === 'constellation-wall') return { src: observatoryImages.constellationWall, alt: '星座図の壁', fallback: '星座図の壁' };
  if (sceneId === 'moon-model') return { src: observatoryImages.moonModel, alt: '月の模型', fallback: '月の模型' };
  if (sceneId === 'staircase') return { src: observatoryImages.staircase, alt: '螺旋階段', fallback: '螺旋階段' };
  if (sceneId === 'skylight') return { src: state.isCleared ? observatoryImages.skylightOpen : state.flags.dawnTimeSolved ? observatoryImages.skylightDawn : observatoryImages.skylight, alt: '天窓', fallback: '天窓' };
  return { src: observatoryImages.lowerMain, alt: '天文台', fallback: '天文台' };
}

function getCurrentHintPuzzle(state: ObservatoryGameState): ObservatoryPuzzleId {
  if (!state.flags.constellationPlateRepaired) return 'constellationPlate';
  if (!state.flags.moonPuzzleSolved) return 'moonPhases';
  if (!state.flags.celestialGlobeAligned) return 'celestialGlobe';
  if (!state.flags.allStarsObserved) return 'telescope';
  if (!state.flags.constellationConnected) return 'constellationLines';
  return 'dawnTime';
}

function hintTitle(id: ObservatoryPuzzleId) {
  const titles: Record<ObservatoryPuzzleId, string> = {
    constellationPlate: '星座盤修復',
    moonPhases: '月の満ち欠け',
    celestialGlobe: '天球儀',
    telescope: '望遠鏡',
    constellationLines: '星座を結ぶ',
    dawnTime: '最終時刻',
  };
  return titles[id];
}
