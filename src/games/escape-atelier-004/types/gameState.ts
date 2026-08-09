import type { InventoryItemState, ItemId, ItemStateId } from '../../../engine/inventory/types';
import type { ClueState, InvestigationLogEntry } from '../../../engine/notebook/types';
import type { StudyPuzzleId, StudyPuzzleStates } from './puzzles';
import type { StudySceneId } from './scenes';

export const STUDY_ITEM_IDS = [
  'diary-piece-01',
  'diary-piece-02',
  'diary-piece-03',
  'sealed-letter',
  'heated-letter',
  'opened-letter',
  'paper-knife',
  'ink-ribbon',
  'cipher-sheet',
  'transparent-sheet',
  'typed-paper',
  'overlay-clue',
  'study-key',
] as const;

export type StudyItemId = (typeof STUDY_ITEM_IDS)[number];

export type StudySettings = {
  bgmEnabled: boolean;
  seEnabled: boolean;
  bgmVolume: number;
  seVolume: number;
};

export type StudyFlags = {
  diaryPiecesCollected: boolean;
  diaryRestored: boolean;
  letterFound: boolean;
  letterHeated: boolean;
  letterOpened: boolean;
  globeUnlocked: boolean;
  globeSolved: boolean;
  memoryRouteAligned: boolean;
  inkRibbonInstalled: boolean;
  typewriterReady: boolean;
  typewriterSolved: boolean;
  transparentSheetFound: boolean;
  overlaySolved: boolean;
  paperAligned: boolean;
  bookshelfClueFound: boolean;
  targetBookOpened: boolean;
  portraitClueFound: boolean;
  finalTimeSolved: boolean;
  studyKeyFound: boolean;
  exitDoorUnlocked: boolean;
  doorUnlocked: boolean;
};

export type StudyGameState = {
  version: number;
  currentScene: StudySceneId;
  inventory: InventoryItemState[];
  selectedItemId: StudyItemId | null;
  itemStates: Partial<Record<StudyItemId, ItemStateId>>;
  collectedItems: StudyItemId[];
  usedItems: StudyItemId[];
  completedCombineRules: string[];
  completedUseRules: string[];
  completedInteractions: string[];
  inspectedPoints: string[];
  solvedPuzzles: StudyPuzzleId[];
  flags: StudyFlags;
  puzzleStates: StudyPuzzleStates;
  viewedHints: Record<string, number>;
  notebook: {
    clues: ClueState[];
  };
  investigationLog: {
    entries: InvestigationLogEntry[];
  };
  settings: StudySettings;
  isCleared: boolean;
};

export type StudyAction =
  | { type: 'START_NEW' }
  | { type: 'CONTINUE' }
  | { type: 'GO_SCENE'; scene: StudySceneId }
  | { type: 'ACQUIRE_ITEM'; itemId: StudyItemId }
  | { type: 'REMOVE_ITEM'; itemId: StudyItemId }
  | { type: 'SELECT_ITEM'; itemId: StudyItemId }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'USE_ITEM_ON_TARGET'; itemId: StudyItemId; targetId: string }
  | { type: 'SET_ITEM_STATE'; itemId: StudyItemId; stateId: ItemStateId }
  | { type: 'TRANSFORM_ITEM'; sourceItemId: StudyItemId; targetItemId: StudyItemId }
  | { type: 'COMBINE_ITEMS'; firstItemId: StudyItemId; secondItemId: StudyItemId }
  | { type: 'SOLVE_PUZZLE'; puzzleId: StudyPuzzleId }
  | { type: 'COMPLETE_PUZZLE'; puzzleId: StudyPuzzleId }
  | { type: 'INSPECT'; pointId: string }
  | { type: 'SET_FLAG'; key: keyof StudyFlags; value: boolean }
  | { type: 'SET_DIARY_REPAIR_STATE'; state: StudyPuzzleStates['diaryRepair'] }
  | { type: 'SET_DIARY_ORDER'; pageOrder: string[] }
  | { type: 'SET_GLOBE_ROUTES'; selectedRouteIds: string[] }
  | { type: 'SET_PAPER_OVERLAY'; state: StudyPuzzleStates['overlayPaper'] }
  | { type: 'SET_TYPEWRITER_INPUT'; input: string }
  | { type: 'SET_BOOKSHELF_STATE'; state: StudyPuzzleStates['bookshelf'] }
  | { type: 'SET_PORTRAIT_TIME'; state: StudyPuzzleStates['portraitTime'] }
  | { type: 'VIEW_HINT'; puzzleId: StudyPuzzleId; level: number }
  | { type: 'DISCOVER_CLUE'; clueId: string }
  | { type: 'MARK_CLUE_READ'; clueId: string }
  | { type: 'MARK_ALL_CLUES_READ' }
  | { type: 'RECORD_INVESTIGATION'; targetId: string; message?: string }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<StudySettings> }
  | { type: 'CLEAR_GAME' }
  | { type: 'RESET' };

export const isStudyItemId = (itemId: ItemId): itemId is StudyItemId => STUDY_ITEM_IDS.includes(itemId as StudyItemId);
