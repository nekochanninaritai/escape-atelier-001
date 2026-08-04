import { SAVE_KEY, SAVE_VERSION } from '../data/gameConfig';
import { initialState } from '../reducers/initialState';
import type { GameState, ItemId, PuzzleId, SceneId } from '../types/game';

const scenes: SceneId[] = ['title', 'prologue', 'room', 'piano', 'clock', 'desk', 'bookshelf', 'globe', 'musicBox', 'door', 'ending'];
const items: ItemId[] = ['sheetPiece1', 'sheetPiece2', 'sheetPiece3', 'combinedPaper', 'windingKey', 'completedSheet', 'doorKey'];
const puzzles: PuzzleId[] = ['sheetOrder', 'clockMusicBox', 'pianoMelody'];

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const booleanRecord = (value: unknown): Record<string, boolean> => {
  if (!isRecord(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => typeof entry === 'boolean')) as Record<string, boolean>;
};
const numberRecord = (value: unknown): Record<string, number> => {
  if (!isRecord(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => typeof entry === 'number')) as Record<string, number>;
};

export function loadGameState(): GameState {
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return initialState;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== SAVE_VERSION) return initialState;

    return {
      ...initialState,
      ...parsed,
      currentScene: scenes.includes(parsed.currentScene as SceneId) ? (parsed.currentScene as SceneId) : 'title',
      inventory: Array.isArray(parsed.inventory) ? parsed.inventory.filter((id): id is ItemId => items.includes(id as ItemId)) : [],
      selectedItemId: items.includes(parsed.selectedItemId as ItemId) ? (parsed.selectedItemId as ItemId) : null,
      collectedItems: Array.isArray(parsed.collectedItems)
        ? parsed.collectedItems.filter((id): id is ItemId => items.includes(id as ItemId))
        : [],
      solvedPuzzles: Array.isArray(parsed.solvedPuzzles)
        ? parsed.solvedPuzzles.filter((id): id is PuzzleId => puzzles.includes(id as PuzzleId))
        : [],
      inspectedPoints: Array.isArray(parsed.inspectedPoints) ? parsed.inspectedPoints.filter((id) => typeof id === 'string') : [],
      flags: booleanRecord(parsed.flags),
      viewedHints: numberRecord(parsed.viewedHints),
      settings: isRecord(parsed.settings) ? { ...initialState.settings, ...parsed.settings } : initialState.settings,
      isCleared: typeof parsed.isCleared === 'boolean' ? parsed.isCleared : false,
    };
  } catch {
    return initialState;
  }
}

export function saveGameState(state: GameState) {
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // Private browsing or full storage should never block the game itself.
  }
}

export function hasSaveData() {
  try {
    return window.localStorage.getItem(SAVE_KEY) !== null;
  } catch {
    return false;
  }
}

export function clearSaveData() {
  try {
    window.localStorage.removeItem(SAVE_KEY);
  } catch {
    // The reducer reset still lets the current session recover.
  }
}
