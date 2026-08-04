import { OBSERVATORY_SAVE_KEY, OBSERVATORY_SAVE_VERSION } from '../data/gameConfig';
import { globePositions, initialMoonPhaseOrder, moonPhaseOrder, normalizePlateRotation } from '../data/puzzles';
import { telescopeStars } from '../data/stars';
import type { GlobePosition, ObservatoryAreaId, ObservatoryGameState, ObservatoryItemId, ObservatoryPuzzleId, ObservatorySceneId, TimePeriod } from '../types';
import { observatoryInitialState } from './initialState';

const areas: ObservatoryAreaId[] = ['lower-floor', 'upper-floor'];
const scenes: ObservatorySceneId[] = ['title', 'prologue', 'lower-main', 'upper-main', 'telescope', 'celestial-globe', 'star-clock', 'desk', 'constellation-wall', 'moon-model', 'staircase', 'skylight', 'ending'];
const items: ObservatoryItemId[] = ['platePiece1', 'platePiece2', 'platePiece3', 'constellationPlate', 'brassGear', 'smallLens', 'starRecord', 'dawnKey'];
const puzzles: ObservatoryPuzzleId[] = ['constellationPlate', 'moonPhases', 'celestialGlobe', 'telescope', 'constellationLines', 'dawnTime'];
const periods: TimePeriod[] = ['night', 'predawn', 'dawn'];
const starIds = telescopeStars.map((star) => star.id);

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const filterIds = <T extends string>(value: unknown, allowed: readonly T[]) => (Array.isArray(value) ? value.filter((id): id is T => allowed.includes(id as T)) : []);
const boolFlags = <T extends Record<string, boolean>>(base: T, value: unknown): T => {
  if (!isRecord(value)) return base;
  return Object.fromEntries(Object.entries(base).map(([key, fallback]) => [key, typeof value[key] === 'boolean' ? value[key] : fallback])) as T;
};
const clampNumber = (value: unknown, min: number, max: number, fallback: number) => (typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback);

export function loadObservatoryState(): ObservatoryGameState {
  try {
    const raw = window.localStorage.getItem(OBSERVATORY_SAVE_KEY);
    if (!raw) return observatoryInitialState;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== OBSERVATORY_SAVE_VERSION) return observatoryInitialState;
    const puzzleStates = isRecord(parsed.puzzleStates) ? parsed.puzzleStates : {};
    const plate = isRecord(puzzleStates.constellationPlate) && isRecord(puzzleStates.constellationPlate.pieces) ? puzzleStates.constellationPlate.pieces : {};
    const telescope = isRecord(puzzleStates.telescope) ? puzzleStates.telescope : {};
    const lines = isRecord(puzzleStates.constellationLines) ? puzzleStates.constellationLines : {};
    const moon = isRecord(puzzleStates.moonPhases) ? puzzleStates.moonPhases : {};
    const globe = isRecord(puzzleStates.celestialGlobe) ? puzzleStates.celestialGlobe : {};
    const dawn = isRecord(puzzleStates.dawnTime) ? puzzleStates.dawnTime : {};
    const moonOrder = filterIds(moon.order, moonPhaseOrder).length === moonPhaseOrder.length ? filterIds(moon.order, moonPhaseOrder) : [...initialMoonPhaseOrder];
    return {
      ...observatoryInitialState,
      currentArea: areas.includes(parsed.currentArea as ObservatoryAreaId) ? (parsed.currentArea as ObservatoryAreaId) : 'lower-floor',
      currentScene: scenes.includes(parsed.currentScene as ObservatorySceneId) ? (parsed.currentScene as ObservatorySceneId) : 'title',
      currentViewId: typeof parsed.currentViewId === 'string' ? parsed.currentViewId : 'lower-main',
      inventory: filterIds(parsed.inventory, items),
      selectedItemId: items.includes(parsed.selectedItemId as ObservatoryItemId) ? (parsed.selectedItemId as ObservatoryItemId) : null,
      collectedItems: filterIds(parsed.collectedItems, items),
      usedItems: filterIds(parsed.usedItems, items),
      inspectedPoints: Array.isArray(parsed.inspectedPoints) ? parsed.inspectedPoints.filter((id): id is string => typeof id === 'string') : [],
      solvedPuzzles: filterIds(parsed.solvedPuzzles, puzzles),
      flags: boolFlags(observatoryInitialState.flags, parsed.flags),
      puzzleStates: {
        constellationPlate: {
          pieces: Object.fromEntries(
            Object.entries(observatoryInitialState.puzzleStates.constellationPlate.pieces).map(([id, base]) => {
              const current = isRecord(plate[id]) ? plate[id] : {};
              return [id, { placed: typeof current.placed === 'boolean' ? current.placed : base.placed, rotation: normalizePlateRotation(typeof current.rotation === 'number' ? current.rotation : base.rotation), slotId: typeof current.slotId === 'string' ? current.slotId : null }];
            }),
          ) as ObservatoryGameState['puzzleStates']['constellationPlate']['pieces'],
        },
        moonPhases: { order: moonOrder },
        celestialGlobe: { positionId: globePositions.includes(globe.positionId as GlobePosition) ? (globe.positionId as GlobePosition) : 'north' },
        telescope: {
          viewportX: clampNumber(telescope.viewportX, -320, 320, 0),
          viewportY: clampNumber(telescope.viewportY, -240, 240, 0),
          observedStarIds: filterIds(telescope.observedStarIds, starIds),
        },
        constellationLines: { selectedStarIds: filterIds(lines.selectedStarIds, starIds) },
        dawnTime: { input: typeof dawn.input === 'string' && /^\d{2}:\d{2}$/.test(dawn.input) ? dawn.input : '00:00' },
      },
      viewedHints: isRecord(parsed.viewedHints) ? Object.fromEntries(Object.entries(parsed.viewedHints).filter(([, value]) => typeof value === 'number')) as Record<string, number> : {},
      settings: isRecord(parsed.settings) ? { ...observatoryInitialState.settings, ...parsed.settings } : observatoryInitialState.settings,
      timePeriod: periods.includes(parsed.timePeriod as TimePeriod) ? (parsed.timePeriod as TimePeriod) : 'night',
      isCleared: typeof parsed.isCleared === 'boolean' ? parsed.isCleared : false,
    };
  } catch {
    return observatoryInitialState;
  }
}

export function saveObservatoryState(state: ObservatoryGameState) {
  try {
    window.localStorage.setItem(OBSERVATORY_SAVE_KEY, JSON.stringify(state));
  } catch {
    // Storage failures should not stop play.
  }
}

export function hasObservatorySaveData() {
  try {
    return window.localStorage.getItem(OBSERVATORY_SAVE_KEY) !== null;
  } catch {
    return false;
  }
}
