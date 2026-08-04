import { OBSERVATORY_SAVE_VERSION } from '../data/gameConfig';
import { initialMoonPhaseOrder } from '../data/puzzles';
import type { ObservatoryGameState } from '../types';

export const observatoryInitialState: ObservatoryGameState = {
  version: OBSERVATORY_SAVE_VERSION,
  currentArea: 'lower-floor',
  currentScene: 'title',
  currentViewId: 'lower-main',
  inventory: [],
  selectedItemId: null,
  collectedItems: [],
  usedItems: [],
  inspectedPoints: [],
  solvedPuzzles: [],
  flags: {
    constellationPlateRepaired: false,
    moonPuzzleSolved: false,
    starClockGearInstalled: false,
    celestialGlobeAligned: false,
    telescopeLensInstalled: false,
    telescopeUnlocked: false,
    allStarsObserved: false,
    constellationConnected: false,
    starClockStarted: false,
    dawnTimeSolved: false,
    skylightUnlocked: false,
  },
  puzzleStates: {
    constellationPlate: {
      pieces: {
        piece1: { placed: false, rotation: 0, slotId: null },
        piece2: { placed: false, rotation: 0, slotId: null },
        piece3: { placed: false, rotation: 0, slotId: null },
      },
    },
    moonPhases: { order: [...initialMoonPhaseOrder] },
    celestialGlobe: { positionId: 'north' },
    telescope: { viewportX: 0, viewportY: 0, observedStarIds: [] },
    constellationLines: { selectedStarIds: [] },
    dawnTime: { input: '00:00' },
  },
  viewedHints: {},
  settings: {
    bgmEnabled: true,
    seEnabled: true,
    bgmVolume: 0.7,
    seVolume: 0.8,
  },
  timePeriod: 'night',
  isCleared: false,
};
