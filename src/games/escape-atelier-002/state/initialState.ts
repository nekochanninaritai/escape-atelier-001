import { GREENHOUSE_SAVE_VERSION } from '../data/gameConfig';
import { initialMirrorAngles, initialPotOrder } from '../data/puzzles';
import type { GreenhouseGameState } from '../types';

export const greenhouseInitialState: GreenhouseGameState = {
  version: GREENHOUSE_SAVE_VERSION,
  currentScene: 'title',
  inventory: [],
  selectedItemId: null,
  collectedItems: [],
  usedItems: [],
  inspectedPoints: [],
  solvedPuzzles: [],
  flags: {
    wateringCanRepaired: false,
    waterCollected: false,
    plantWatered: false,
    flowersBloomed: false,
    seedPlanted: false,
    mirrorInstalled: false,
    treeBloomed: false,
    doorUnlocked: false,
  },
  puzzleStates: {
    wateringCan: { placedPieceIds: [] },
    flowerColors: { currentInput: [] },
    plantPots: { order: [...initialPotOrder] },
    mirrors: { angles: { ...initialMirrorAngles } },
  },
  viewedHints: {},
  settings: { bgmEnabled: true, seEnabled: true, bgmVolume: 0.55, seVolume: 0.75 },
  isCleared: false,
};
