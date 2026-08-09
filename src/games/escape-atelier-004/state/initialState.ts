import { STUDY_SAVE_VERSION } from '../gameConfig';
import { initialDiaryPageOrder } from '../data/puzzles';
import type { StudyGameState } from '../types';

export const studyInitialState: StudyGameState = {
  version: STUDY_SAVE_VERSION,
  currentScene: 'title',
  inventory: [],
  selectedItemId: null,
  collectedItems: [],
  usedItems: [],
  inspectedPoints: [],
  solvedPuzzles: [],
  flags: {
    diaryRestored: false,
    globeUnlocked: false,
    memoryRouteAligned: false,
    paperAligned: false,
    typewriterReady: false,
    typewriterSolved: false,
    doorUnlocked: false,
    letterHeated: false,
    letterOpened: false,
    inkRibbonInstalled: false,
  },
  itemStates: {},
  puzzleStates: {
    diaryRestore: { pageOrder: [...initialDiaryPageOrder] },
    memoryGlobe: { selectedRouteIds: [] },
    paperOverlay: { paperOffsetX: 64, paperOffsetY: -42, rotation: -18 },
    typewriterCode: { input: '' },
  },
  viewedHints: {},
  completedCombineRules: [],
  completedUseRules: [],
  settings: {
    bgmEnabled: true,
    seEnabled: true,
    bgmVolume: 0.7,
    seVolume: 0.8,
  },
  isCleared: false,
};
