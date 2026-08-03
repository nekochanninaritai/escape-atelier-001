import { SAVE_VERSION } from '../data/gameConfig';
import type { GameState } from '../types/game';

export const initialState: GameState = {
  version: SAVE_VERSION,
  currentScene: 'title',
  inventory: [],
  selectedItemId: null,
  collectedItems: [],
  solvedPuzzles: [],
  inspectedPoints: [],
  flags: {},
  viewedHints: {},
  settings: {
    bgmEnabled: true,
    seEnabled: true,
    bgmVolume: 0.45,
    seVolume: 0.7,
  },
  isCleared: false,
};
