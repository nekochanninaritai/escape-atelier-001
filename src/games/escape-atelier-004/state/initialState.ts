import { STUDY_SAVE_VERSION } from '../gameConfig';
import { initialDiaryPageOrder } from '../data/puzzles';
import type { StudyFlags, StudyGameState, StudyPuzzleStates, StudySettings } from '../types';

export function createInitialStudyFlags(): StudyFlags {
  return {
    diaryPiecesCollected: false,
    diaryRestored: false,
    letterFound: false,
    letterHeated: false,
    letterOpened: false,
    globeUnlocked: false,
    globeSolved: false,
    memoryRouteAligned: false,
    inkRibbonInstalled: false,
    typewriterReady: false,
    typewriterSolved: false,
    transparentSheetFound: false,
    overlaySolved: false,
    paperAligned: false,
    bookshelfClueFound: false,
    targetBookOpened: false,
    portraitClueFound: false,
    finalTimeSolved: false,
    studyKeyFound: false,
    exitDoorUnlocked: false,
    doorUnlocked: false,
  };
}

export function createInitialStudyPuzzleStates(): StudyPuzzleStates {
  return {
    diaryRepair: {
      pageOrder: [...initialDiaryPageOrder],
      pieces: {
        spring: { x: 104, y: 96, rotation: 0, placed: false },
        summer: { x: 536, y: 112, rotation: 90, placed: false },
        autumn: { x: 128, y: 344, rotation: 180, placed: false },
        winter: { x: 520, y: 360, rotation: 270, placed: false },
      },
    },
    globe: {
      positionId: 'closed',
      selectedRouteIds: [],
    },
    typewriter: {
      input: '',
    },
    overlayPaper: {
      x: 64,
      y: -42,
      paperOffsetX: 64,
      paperOffsetY: -42,
      rotation: -18,
      aligned: false,
    },
    bookshelf: {
      selectedBookId: null,
      openedPage: null,
    },
    portraitTime: {
      hour: null,
      minute: null,
    },
  };
}

export function createDefaultStudySettings(): StudySettings {
  return {
    bgmEnabled: true,
    seEnabled: true,
    bgmVolume: 0.7,
    seVolume: 0.8,
  };
}

export function createInitialStudyGameState(): StudyGameState {
  return {
    version: STUDY_SAVE_VERSION,
    currentScene: 'title',
    inventory: [],
    selectedItemId: null,
    collectedItems: [],
    usedItems: [],
    completedCombineRules: [],
    completedUseRules: [],
    completedInteractions: [],
    inspectedPoints: [],
    solvedPuzzles: [],
    flags: createInitialStudyFlags(),
    itemStates: {},
    puzzleStates: createInitialStudyPuzzleStates(),
    viewedHints: {},
    notebook: {
      clues: [],
    },
    investigationLog: {
      entries: [],
    },
    settings: createDefaultStudySettings(),
    isCleared: false,
  };
}

export const studyInitialState: StudyGameState = createInitialStudyGameState();
