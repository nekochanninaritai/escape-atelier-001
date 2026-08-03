export type SceneId =
  | 'title'
  | 'prologue'
  | 'room'
  | 'piano'
  | 'clock'
  | 'desk'
  | 'bookshelf'
  | 'musicBox'
  | 'door'
  | 'ending';

export type ItemId = 'sheetPiece1' | 'sheetPiece2' | 'sheetPiece3' | 'windingKey' | 'completedSheet' | 'doorKey';

export type PuzzleId = 'sheetOrder' | 'clockMusicBox' | 'pianoMelody';

export type GameSettings = {
  bgmEnabled: boolean;
  seEnabled: boolean;
  bgmVolume: number;
  seVolume: number;
};

export type GameState = {
  version: number;
  currentScene: SceneId;
  inventory: ItemId[];
  selectedItemId: ItemId | null;
  collectedItems: ItemId[];
  solvedPuzzles: PuzzleId[];
  inspectedPoints: string[];
  flags: Record<string, boolean>;
  viewedHints: Record<string, number>;
  settings: GameSettings;
  isCleared: boolean;
};

export type Hotspot = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  targetScene?: SceneId;
  actionId?: string;
};

export type ItemDefinition = {
  id: ItemId;
  name: string;
  description: string;
  image: string;
  usedDescription?: string;
};

export type PuzzleDefinition = {
  id: PuzzleId;
  title: string;
  answer: string[];
  prompt: string;
  successMessage: string;
  failureMessage: string;
};

export type GameAction =
  | { type: 'START_NEW' }
  | { type: 'CONTINUE'; scene?: SceneId }
  | { type: 'GO_SCENE'; scene: SceneId }
  | { type: 'SELECT_ITEM'; itemId: ItemId }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'COLLECT_ITEM'; itemId: ItemId }
  | { type: 'USE_ITEM'; itemId: ItemId; consume?: boolean }
  | { type: 'SOLVE_PUZZLE'; puzzleId: PuzzleId }
  | { type: 'INSPECT'; pointId: string }
  | { type: 'SET_FLAG'; key: string; value: boolean }
  | { type: 'VIEW_HINT'; puzzleId: PuzzleId; level: number }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<GameSettings> }
  | { type: 'CLEAR_GAME' }
  | { type: 'RESET' };
