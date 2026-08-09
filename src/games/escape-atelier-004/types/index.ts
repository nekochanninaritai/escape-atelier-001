export type StudySceneId =
  | 'title'
  | 'prologue'
  | 'study'
  | 'bookshelf'
  | 'desk'
  | 'typewriter'
  | 'fireplace'
  | 'globe'
  | 'portrait'
  | 'side-table'
  | 'door'
  | 'ending';

export type StudyItemId = 'diaryPage' | 'letterFragment' | 'inkRibbon' | 'transparentPaper' | 'memoryKey';

export type StudyPuzzleId = 'diaryRestore' | 'memoryGlobe' | 'paperOverlay' | 'typewriterCode';

export type StudySettings = {
  bgmEnabled: boolean;
  seEnabled: boolean;
  bgmVolume: number;
  seVolume: number;
};

export type DiaryRestoreState = {
  pageOrder: string[];
};

export type MemoryGlobeState = {
  selectedRouteIds: string[];
};

export type PaperOverlayState = {
  paperOffsetX: number;
  paperOffsetY: number;
  rotation: number;
};

export type StudyGameState = {
  version: number;
  currentScene: StudySceneId;
  inventory: StudyItemId[];
  selectedItemId: StudyItemId | null;
  collectedItems: StudyItemId[];
  usedItems: StudyItemId[];
  inspectedPoints: string[];
  solvedPuzzles: StudyPuzzleId[];
  flags: {
    diaryRestored: boolean;
    globeUnlocked: boolean;
    memoryRouteAligned: boolean;
    paperAligned: boolean;
    typewriterReady: boolean;
    typewriterSolved: boolean;
    doorUnlocked: boolean;
  };
  puzzleStates: {
    diaryRestore: DiaryRestoreState;
    memoryGlobe: MemoryGlobeState;
    paperOverlay: PaperOverlayState;
    typewriterCode: { input: string };
  };
  viewedHints: Record<string, number>;
  settings: StudySettings;
  isCleared: boolean;
};

export type StudyHotspot = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  targetScene?: StudySceneId;
};

export type StudyAction =
  | { type: 'START_NEW' }
  | { type: 'CONTINUE' }
  | { type: 'GO_SCENE'; scene: StudySceneId }
  | { type: 'SELECT_ITEM'; itemId: StudyItemId }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'COLLECT_ITEM'; itemId: StudyItemId }
  | { type: 'USE_ITEM'; itemId: StudyItemId; consume?: boolean }
  | { type: 'SOLVE_PUZZLE'; puzzleId: StudyPuzzleId }
  | { type: 'INSPECT'; pointId: string }
  | { type: 'SET_FLAG'; key: keyof StudyGameState['flags']; value: boolean }
  | { type: 'SET_DIARY_ORDER'; pageOrder: string[] }
  | { type: 'SET_GLOBE_ROUTES'; selectedRouteIds: string[] }
  | { type: 'SET_PAPER_OVERLAY'; state: PaperOverlayState }
  | { type: 'SET_TYPEWRITER_INPUT'; input: string }
  | { type: 'VIEW_HINT'; puzzleId: StudyPuzzleId; level: number }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<StudySettings> }
  | { type: 'CLEAR_GAME' }
  | { type: 'RESET' };
