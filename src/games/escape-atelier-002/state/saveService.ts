import { GREENHOUSE_SAVE_KEY, GREENHOUSE_SAVE_VERSION } from '../data/gameConfig';
import { initialMirrorAngles, initialPotOrder } from '../data/puzzles';
import type { GreenhouseGameState, GreenhouseItemId, GreenhousePuzzleId, GreenhouseSceneId } from '../types';
import { greenhouseInitialState } from './initialState';

const scenes: GreenhouseSceneId[] = ['title', 'prologue', 'greenhouse', 'tree', 'pots', 'fountain', 'workbench', 'mirrorDevice', 'door', 'statue', 'ending'];
const items: GreenhouseItemId[] = ['canPiece1', 'canPiece2', 'canPiece3', 'wateringCan', 'wateredCan', 'flowerSeed', 'smallMirror', 'butterflyKey'];
const puzzles: GreenhousePuzzleId[] = ['wateringCan', 'flowerColors', 'plantPots', 'mirrorLight'];
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const numberRecord = (value: unknown): Record<string, number> => {
  if (!isRecord(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => typeof entry === 'number')) as Record<string, number>;
};

const filterIds = <T extends string>(value: unknown, allowed: readonly T[]) => (Array.isArray(value) ? value.filter((id): id is T => allowed.includes(id as T)) : []);

export function loadGreenhouseState(): GreenhouseGameState {
  try {
    const raw = window.localStorage.getItem(GREENHOUSE_SAVE_KEY);
    if (!raw) return greenhouseInitialState;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== GREENHOUSE_SAVE_VERSION) return greenhouseInitialState;
    const puzzleStates = isRecord(parsed.puzzleStates) ? parsed.puzzleStates : {};
    const flags = isRecord(parsed.flags) ? parsed.flags : {};
    return {
      ...greenhouseInitialState,
      ...parsed,
      currentScene: scenes.includes(parsed.currentScene as GreenhouseSceneId) ? (parsed.currentScene as GreenhouseSceneId) : 'title',
      inventory: filterIds(parsed.inventory, items),
      selectedItemId: items.includes(parsed.selectedItemId as GreenhouseItemId) ? (parsed.selectedItemId as GreenhouseItemId) : null,
      collectedItems: filterIds(parsed.collectedItems, items),
      usedItems: filterIds(parsed.usedItems, items),
      solvedPuzzles: filterIds(parsed.solvedPuzzles, puzzles),
      inspectedPoints: Array.isArray(parsed.inspectedPoints) ? parsed.inspectedPoints.filter((id): id is string => typeof id === 'string') : [],
      flags: { ...greenhouseInitialState.flags, ...flags },
      puzzleStates: {
        wateringCan: { placedPieceIds: filterIds(isRecord(puzzleStates.wateringCan) ? puzzleStates.wateringCan.placedPieceIds : [], ['piece-1', 'piece-2', 'piece-3']) },
        flowerColors: { currentInput: filterIds(isRecord(puzzleStates.flowerColors) ? puzzleStates.flowerColors.currentInput : [], ['blue', 'white', 'red', 'yellow']) },
        plantPots: { order: filterIds(isRecord(puzzleStates.plantPots) ? puzzleStates.plantPots.order : initialPotOrder, initialPotOrder).length === 4 ? filterIds(isRecord(puzzleStates.plantPots) ? puzzleStates.plantPots.order : initialPotOrder, initialPotOrder) : [...initialPotOrder] },
        mirrors: { angles: isRecord(puzzleStates.mirrors) ? { ...initialMirrorAngles, ...numberRecord(puzzleStates.mirrors.angles) } : { ...initialMirrorAngles } },
      },
      settings: isRecord(parsed.settings) ? { ...greenhouseInitialState.settings, ...parsed.settings } : greenhouseInitialState.settings,
      isCleared: typeof parsed.isCleared === 'boolean' ? parsed.isCleared : false,
    };
  } catch {
    return greenhouseInitialState;
  }
}

export function saveGreenhouseState(state: GreenhouseGameState) {
  try {
    window.localStorage.setItem(GREENHOUSE_SAVE_KEY, JSON.stringify(state));
  } catch {
    // Storage failures should not stop play.
  }
}

export function hasGreenhouseSaveData() {
  try {
    return window.localStorage.getItem(GREENHOUSE_SAVE_KEY) !== null;
  } catch {
    return false;
  }
}
