import { useMemo, useState } from 'react';
import { GameImage } from '../../components/common/GameImage';
import { Modal } from '../../components/common/Modal';
import { PhaserPuzzle } from '../../engine/phaser/PhaserPuzzle';
import { greenhouseGameConfig } from './data/gameConfig';
import { greenhouseHints } from './data/hints';
import { greenhouseImages } from './data/imageAssets';
import { greenhouseItems } from './data/items';
import { flowerColors, isCorrectFlowerSequence } from './data/puzzles';
import { greenhouseHotspots, sceneCopy } from './data/scenes';
import { endingPages, prologuePages } from './data/story';
import { createMirrorLightPuzzleConfig } from './puzzles/mirror-light/config';
import { createPlantPotsPuzzleConfig } from './puzzles/plant-pots/config';
import { createWateringCanPuzzleConfig } from './puzzles/watering-can/config';
import { clearGreenhouseSaveData, hasGreenhouseSaveData } from './state/saveService';
import { useGreenhouse } from './state/useGreenhouse';
import type { GreenhouseItemId, GreenhousePuzzleId, GreenhouseSceneId } from './types';
import './GreenhouseApp.css';

type PuzzleOverlay = 'wateringCan' | 'plantPots' | 'mirrorLight' | null;

export function GreenhouseApp({ onSeriesSelect }: { onSeriesSelect: () => void }) {
  const { state, dispatch, message, showMessage } = useGreenhouse();
  const [storyPage, setStoryPage] = useState(0);
  const [endingPage, setEndingPage] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hintsOpen, setHintsOpen] = useState(false);
  const [confirmDoor, setConfirmDoor] = useState(false);
  const [puzzle, setPuzzle] = useState<PuzzleOverlay>(null);
  const solved = useMemo(() => new Set(state.solvedPuzzles), [state.solvedPuzzles]);
  const stageImage = getStageImage(state.currentScene, state);

  const collect = (itemId: GreenhouseItemId, text: string) => {
    dispatch({ type: 'COLLECT_ITEM', itemId });
    showMessage(text);
  };

  const go = (scene: GreenhouseSceneId) => dispatch({ type: 'GO_SCENE', scene });

  const startWateringCanPuzzle = () => {
    const hasPieces = ['canPiece1', 'canPiece2', 'canPiece3'].every((id) => state.inventory.includes(id as GreenhouseItemId));
    if (!hasPieces) {
      showMessage('まだ足りない破片があるようだ。');
      return;
    }
    setPuzzle('wateringCan');
  };

  const handleSceneAction = () => {
    if (state.currentScene === 'workbench') {
      if (!state.collectedItems.includes('canPiece1')) collect('canPiece1', '作業机の隅で水差しの破片を見つけた。');
      else startWateringCanPuzzle();
      return;
    }
    if (state.currentScene === 'pots') {
      if (!state.collectedItems.includes('canPiece2')) collect('canPiece2', '植木鉢棚の陰から水差しの破片を拾った。');
      else if (state.inventory.includes('flowerSeed') && state.selectedItemId === 'flowerSeed' && !state.flags.seedPlanted) {
        dispatch({ type: 'USE_ITEM', itemId: 'flowerSeed', consume: true });
        dispatch({ type: 'SET_FLAG', key: 'seedPlanted', value: true });
        showMessage('花の種を、よく日に当たる鉢へ植えた。芽から花へ育つ順に鉢が反応しそうだ。');
      } else if (state.flags.seedPlanted && !solved.has('plantPots')) setPuzzle('plantPots');
      else showMessage(state.flags.seedPlanted ? '鉢の並びを整えられそうだ。' : '種を植えられそうな鉢がある。');
      return;
    }
    if (state.currentScene === 'statue') {
      if (!state.collectedItems.includes('canPiece3')) collect('canPiece3', '蔦の下から水差しの破片を見つけた。');
      else showMessage('石像は静かに温室を見守っている。');
      return;
    }
    if (state.currentScene === 'fountain') {
      if (state.selectedItemId === 'wateringCan' && !state.flags.waterCollected) {
        dispatch({ type: 'USE_ITEM', itemId: 'wateringCan', consume: true });
        dispatch({ type: 'COLLECT_ITEM', itemId: 'wateredCan' });
        dispatch({ type: 'SET_FLAG', key: 'waterCollected', value: true });
        showMessage('水差しに澄んだ水をくんだ。');
      } else showMessage(state.flags.waterCollected ? '噴水には静かな水面が戻っている。' : '水を受ける器があれば、くめそうだ。');
      return;
    }
    if (state.currentScene === 'tree') {
      if (state.selectedItemId === 'wateredCan' && !state.flags.plantWatered) {
        dispatch({ type: 'USE_ITEM', itemId: 'wateredCan', consume: true });
        dispatch({ type: 'SET_FLAG', key: 'plantWatered', value: true });
        dispatch({ type: 'SET_FLAG', key: 'flowersBloomed', value: true });
        showMessage('花が青、白、赤、黄の順に咲いた。');
      } else if (state.flags.flowersBloomed && !solved.has('flowerColors')) showMessage('枝先には青、白、赤、黄の花が咲いた跡が順に残っている。入力できそうだ。');
      else if (state.flags.treeBloomed && !state.collectedItems.includes('butterflyKey')) collect('butterflyKey', '開いた花の中から蝶の鍵が現れた。');
      else showMessage('大樹はまだ光と水を待っている。');
      return;
    }
    if (state.currentScene === 'mirrorDevice') {
      if (!state.flags.mirrorInstalled) {
        if (state.selectedItemId !== 'smallMirror') {
          showMessage('鏡が一枚足りないようだ。');
          return;
        }
        dispatch({ type: 'USE_ITEM', itemId: 'smallMirror', consume: true });
        dispatch({ type: 'SET_FLAG', key: 'mirrorInstalled', value: true });
        showMessage('小さな鏡を装置へ取り付けた。');
        return;
      }
      if (!solved.has('mirrorLight')) setPuzzle('mirrorLight');
      else showMessage('光は大樹へまっすぐ届いている。');
      return;
    }
    if (state.currentScene === 'door') {
      if (!state.inventory.includes('butterflyKey')) showMessage('扉には蝶の形をした鍵穴がある。');
      else if (state.selectedItemId !== 'butterflyKey') showMessage(state.selectedItemId ? 'ここでは使えないようだ。' : '蝶の鍵を選べば開けられそうだ。');
      else setConfirmDoor(true);
    }
  };

  const submitColor = (colorId: string) => {
    if (!state.flags.flowersBloomed || solved.has('flowerColors')) return;
    const next = [...state.puzzleStates.flowerColors.currentInput, colorId];
    dispatch({ type: 'SET_FLOWER_INPUT', input: next });
    if (next.length < 4) return;
    if (isCorrectFlowerSequence(next)) {
      dispatch({ type: 'SOLVE_PUZZLE', puzzleId: 'flowerColors' });
      dispatch({ type: 'SET_FLOWER_INPUT', input: [] });
      collect('flowerSeed', '花の奥から淡く光る種がこぼれた。');
    } else {
      showMessage('順番が違うようだ。花の咲いた順を思い出そう。');
      window.setTimeout(() => dispatch({ type: 'SET_FLOWER_INPUT', input: [] }), 420);
    }
  };

  if (state.currentScene === 'title') {
    return (
      <main className="greenTitle">
        <GameImage src={greenhouseImages.title} alt="夕暮れの光に包まれた古い温室" fallbackLabel="温室のタイトル背景" className="greenBackdropImage" decorative />
        <section className="greenTitleText">
          <p>{greenhouseGameConfig.seriesName}</p>
          <h1>
            {greenhouseGameConfig.episode}
            <span>{greenhouseGameConfig.title}</span>
          </h1>
          <div className="greenButtons">
            <button type="button" onClick={() => dispatch({ type: 'START_NEW' })}>はじめから</button>
            <button type="button" disabled={!hasGreenhouseSaveData()} onClick={() => dispatch({ type: 'CONTINUE' })}>つづきから</button>
            <button type="button" onClick={() => setSettingsOpen(true)}>設定</button>
            <button type="button" onClick={onSeriesSelect}>作品選択</button>
          </div>
        </section>
        {settingsOpen && <GreenhouseSettings onClose={() => setSettingsOpen(false)} />}
      </main>
    );
  }

  if (state.currentScene === 'prologue') {
    return (
      <StoryView
        pages={prologuePages}
        page={storyPage}
        title="Prologue"
        onNext={() => (storyPage + 1 >= prologuePages.length ? go('greenhouse') : setStoryPage(storyPage + 1))}
        onSkip={() => go('greenhouse')}
      />
    );
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
        actions={
          <>
            <button type="button" onClick={() => go('title')}>タイトルへ戻る</button>
            <button type="button" onClick={() => dispatch({ type: 'START_NEW' })}>もう一度遊ぶ</button>
          </>
        }
      />
    );
  }

  return (
    <main className="greenShell">
      <header className="greenHeader">
        {state.currentScene !== 'greenhouse' ? <button type="button" onClick={() => go('greenhouse')}>戻る</button> : <span />}
        <div>
          <span>{greenhouseGameConfig.seriesName}</span>
          <strong>{greenhouseGameConfig.episode} {greenhouseGameConfig.title}</strong>
        </div>
        <button type="button" onClick={() => go('greenhouse')}>温室</button>
      </header>

      <section className={`greenStage scene-${state.currentScene}`} aria-label="温室">
        <GameImage src={stageImage.src} alt={stageImage.alt} fallbackLabel={stageImage.fallback} className="greenStageImage" decorative />
        {state.currentScene === 'greenhouse' ? (
          <>
            <h2>黄昏の温室</h2>
            {greenhouseHotspots.map((hotspot) => (
              <button
                key={hotspot.id}
                type="button"
                className="greenHotspot"
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
          <FocusPanel sceneId={state.currentScene} onAction={handleSceneAction} onColor={submitColor} />
        )}
      </section>

      <Inventory />
      <nav className="greenBottom">
        <button type="button" onClick={() => setHintsOpen(true)}>ヒント</button>
        <button type="button" onClick={() => setSettingsOpen(true)}>設定</button>
      </nav>

      {message && <div className="messageToast">{message}</div>}
      {settingsOpen && <GreenhouseSettings onClose={() => setSettingsOpen(false)} />}
      {hintsOpen && <GreenhouseHints onClose={() => setHintsOpen(false)} />}
      {confirmDoor && (
        <Modal title="蝶の鍵を使いますか？" onClose={() => setConfirmDoor(false)}>
          <div className="greenConfirm">
            <button type="button" onClick={() => setConfirmDoor(false)}>やめる</button>
            <button
              type="button"
              onClick={() => {
                dispatch({ type: 'USE_ITEM', itemId: 'butterflyKey', consume: true });
                dispatch({ type: 'CLEAR_GAME' });
              }}
            >
              鍵を回す
            </button>
          </div>
        </Modal>
      )}
      {puzzle === 'wateringCan' && (
        <PhaserPuzzle
          title="水差しの修復"
          instructions="破片をドラッグして、中央の輪郭へ重ねてください。"
          initialState={state.puzzleStates.wateringCan}
          createConfig={createWateringCanPuzzleConfig}
          onCancel={(nextState) => {
            dispatch({ type: 'SET_WATERING_CAN_STATE', state: nextState });
            setPuzzle(null);
          }}
          onComplete={(nextState) => {
            dispatch({ type: 'SET_WATERING_CAN_STATE', state: nextState });
            dispatch({ type: 'SOLVE_PUZZLE', puzzleId: 'wateringCan' });
            dispatch({ type: 'REMOVE_ITEMS', itemIds: ['canPiece1', 'canPiece2', 'canPiece3'] });
            dispatch({ type: 'COLLECT_ITEM', itemId: 'wateringCan' });
            dispatch({ type: 'SET_FLAG', key: 'wateringCanRepaired', value: true });
            setPuzzle(null);
            showMessage('水差しが元の形を取り戻した。');
          }}
        />
      )}
      {puzzle === 'plantPots' && (
        <PhaserPuzzle
          title="植木鉢の並べ替え"
          instructions="鉢を左右へ動かし、成長していく順番に並べてください。"
          initialState={state.puzzleStates.plantPots}
          createConfig={createPlantPotsPuzzleConfig}
          onCancel={(nextState) => {
            dispatch({ type: 'SET_POT_ORDER', order: nextState.order });
            setPuzzle(null);
          }}
          onComplete={(nextState) => {
            dispatch({ type: 'SET_POT_ORDER', order: nextState.order });
            dispatch({ type: 'SOLVE_PUZZLE', puzzleId: 'plantPots' });
            dispatch({ type: 'COLLECT_ITEM', itemId: 'smallMirror' });
            setPuzzle(null);
            showMessage('鉢棚の奥から小さな鏡が現れた。');
          }}
        />
      )}
      {puzzle === 'mirrorLight' && (
        <PhaserPuzzle
          title="光の反射"
          instructions="鏡をタップして角度を変え、夕日の光を大樹へ届けてください。"
          initialState={state.puzzleStates.mirrors}
          createConfig={createMirrorLightPuzzleConfig}
          onCancel={(nextState) => {
            dispatch({ type: 'SET_MIRROR_ANGLES', angles: nextState.angles });
            setPuzzle(null);
          }}
          onComplete={(nextState) => {
            dispatch({ type: 'SET_MIRROR_ANGLES', angles: nextState.angles });
            dispatch({ type: 'SOLVE_PUZZLE', puzzleId: 'mirrorLight' });
            dispatch({ type: 'SET_FLAG', key: 'treeBloomed', value: true });
            setPuzzle(null);
            showMessage('大樹の花が開いた。中心に何かが輝いている。');
          }}
        />
      )}
    </main>
  );
}

function FocusPanel({ sceneId, onAction, onColor }: { sceneId: GreenhouseSceneId; onAction: () => void; onColor: (colorId: string) => void }) {
  const { state } = useGreenhouse();
  const copy = sceneCopy[sceneId as keyof typeof sceneCopy];
  if (!copy) return null;
  const colorInput = state.puzzleStates.flowerColors.currentInput;
  return (
    <div className="greenFocus">
      <h2>{copy.title}</h2>
      <p>{copy.description}</p>
      <button type="button" onClick={onAction}>調べる / 使う</button>
      {sceneId === 'tree' && state.flags.flowersBloomed && !state.solvedPuzzles.includes('flowerColors') && (
        <div className="colorPuzzle">
          <p>入力: {colorInput.map((id) => flowerColors.find((color) => color.id === id)?.name).join('、') || 'なし'}</p>
          <div>
            {flowerColors.map((color) => (
              <button key={color.id} type="button" onClick={() => onColor(color.id)} style={{ borderColor: color.color }}>
                <span style={{ background: color.color }} />
                {color.name}・{color.symbol}
              </button>
            ))}
          </div>
        </div>
      )}
      {sceneId === 'tree' && state.flags.treeBloomed && <p>花の中心に、蝶の形をした鍵が見える。</p>}
    </div>
  );
}

function Inventory() {
  const { state, dispatch } = useGreenhouse();
  return (
    <section className="greenInventory" aria-label="インベントリ">
      {state.inventory.length === 0 ? <p>持ち物はありません</p> : null}
      {state.inventory.map((itemId) => {
        const item = greenhouseItems[itemId];
        return (
          <button
            key={itemId}
            type="button"
            className={state.selectedItemId === itemId ? 'selected' : ''}
            onClick={() => dispatch({ type: 'SELECT_ITEM', itemId })}
            aria-label={`${item.name}を選択`}
          >
            <img src={item.image} alt="" draggable={false} />
            <span>{item.name}</span>
          </button>
        );
      })}
    </section>
  );
}

function GreenhouseHints({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useGreenhouse();
  const entries = Object.entries(greenhouseHints) as [GreenhousePuzzleId, readonly string[]][];
  return (
    <Modal title="ヒント" onClose={onClose}>
      <div className="greenHints">
        {entries.map(([id, hints]) => {
          const viewed = state.viewedHints[id] ?? 0;
          return (
            <section key={id}>
              <h3>{id}</h3>
              {hints.slice(0, viewed).map((hint) => <p key={hint}>{hint}</p>)}
              {viewed < hints.length && (
                <button type="button" onClick={() => dispatch({ type: 'VIEW_HINT', puzzleId: id, level: viewed + 1 })}>
                  ヒント{viewed + 1}を見る
                </button>
              )}
            </section>
          );
        })}
      </div>
    </Modal>
  );
}

function GreenhouseSettings({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useGreenhouse();
  const resetSave = () => {
    if (!window.confirm('セーブデータをリセットしますか？')) return;
    clearGreenhouseSaveData();
    dispatch({ type: 'RESET' });
    onClose();
  };

  return (
    <Modal title="設定" onClose={onClose}>
      <div className="greenSettings">
        <label><input type="checkbox" checked={state.settings.bgmEnabled} onChange={(event) => dispatch({ type: 'UPDATE_SETTINGS', settings: { bgmEnabled: event.target.checked } })} /> BGM</label>
        <label><input type="checkbox" checked={state.settings.seEnabled} onChange={(event) => dispatch({ type: 'UPDATE_SETTINGS', settings: { seEnabled: event.target.checked } })} /> SE</label>
        <label>BGM音量<input type="range" min="0" max="1" step="0.05" value={state.settings.bgmVolume} onChange={(event) => dispatch({ type: 'UPDATE_SETTINGS', settings: { bgmVolume: Number(event.target.value) } })} /></label>
        <label>SE音量<input type="range" min="0" max="1" step="0.05" value={state.settings.seVolume} onChange={(event) => dispatch({ type: 'UPDATE_SETTINGS', settings: { seVolume: Number(event.target.value) } })} /></label>
        <div className="greenSettingsActions">
          <button type="button" onClick={() => { dispatch({ type: 'GO_SCENE', scene: 'title' }); onClose(); }}>タイトルへ戻る</button>
          <button type="button" onClick={onClose}>ゲームへ戻る</button>
          <button type="button" className="greenDangerButton" onClick={resetSave}>セーブリセット</button>
        </div>
      </div>
    </Modal>
  );
}

function StoryView({ pages, page, title, onNext, onSkip, finished = false, actions }: { pages: string[]; page: number; title: string; onNext: () => void; onSkip?: () => void; finished?: boolean; actions?: React.ReactNode }) {
  return (
    <main className="greenStory">
      <GameImage
        src={finished ? greenhouseImages.ending : greenhouseImages.title}
        alt={finished ? '花と蝶に満ちた夕暮れの温室' : '夕暮れの古い温室'}
        fallbackLabel={finished ? 'エンディング背景' : 'ストーリー背景'}
        className="greenBackdropImage"
        decorative
      />
      <section className="greenStoryText">
        {finished ? (
          <>
            <h1>{title}</h1>
            <p>Escape Atelier #002</p>
            <p>プレイしていただきありがとうございました</p>
            <div className="greenButtons">{actions}</div>
          </>
        ) : (
          <>
            <h1>{title}</h1>
            <p>{pages[page]}</p>
            <div className="greenButtons">
              <button type="button" onClick={onNext}>次へ</button>
              {onSkip && <button type="button" onClick={onSkip}>スキップ</button>}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function getStageImage(sceneId: GreenhouseSceneId, state: ReturnType<typeof useGreenhouse>['state']) {
  if (sceneId === 'greenhouse') {
    return { src: greenhouseImages.main, alt: '温室全景', fallback: '温室全景' };
  }
  if (sceneId === 'tree') {
    const bloomed = state.flags.treeBloomed;
    return { src: bloomed ? greenhouseImages.treeBloomed : greenhouseImages.tree, alt: bloomed ? '花が開いた大樹' : '眠ったような中央の大樹', fallback: '中央の大樹' };
  }
  if (sceneId === 'fountain') {
    const filled = state.flags.waterCollected;
    return { src: filled ? greenhouseImages.fountainUsed : greenhouseImages.fountain, alt: filled ? '水が戻った噴水' : '乾いた古い噴水', fallback: '噴水' };
  }
  if (sceneId === 'pots') return { src: greenhouseImages.pots, alt: '植木鉢棚', fallback: '植木鉢棚' };
  if (sceneId === 'workbench') return { src: greenhouseImages.workbench, alt: '園芸用の作業机', fallback: '作業机' };
  if (sceneId === 'mirrorDevice') return { src: greenhouseImages.mirrorDevice, alt: '真鍮の鏡の装置', fallback: '鏡の装置' };
  if (sceneId === 'door') {
    return { src: state.flags.doorUnlocked || state.isCleared ? greenhouseImages.doorOpen : greenhouseImages.door, alt: '温室のガラス扉', fallback: 'ガラス扉' };
  }
  if (sceneId === 'statue') return { src: greenhouseImages.statue, alt: '蔦に覆われた石像', fallback: '石像' };
  return { src: greenhouseImages.main, alt: '温室', fallback: '温室' };
}
