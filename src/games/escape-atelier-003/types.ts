export type ObservatoryAreaId = 'lower-floor' | 'upper-floor';

export type ObservatorySceneId =
  | 'title'
  | 'prologue'
  | 'lower-main'
  | 'upper-main'
  | 'telescope'
  | 'celestial-globe'
  | 'star-clock'
  | 'desk'
  | 'constellation-wall'
  | 'moon-model'
  | 'staircase'
  | 'skylight'
  | 'ending';

export type ObservatoryItemId =
  | 'platePiece1'
  | 'platePiece2'
  | 'platePiece3'
  | 'constellationPlate'
  | 'brassGear'
  | 'smallLens'
  | 'starRecord'
  | 'dawnKey';

export type ObservatoryPuzzleId =
  | 'constellationPlate'
  | 'moonPhases'
  | 'celestialGlobe'
  | 'telescope'
  | 'constellationLines'
  | 'dawnTime';

export type GlobePosition = 'north' | 'east' | 'south' | 'west' | 'target';
export type TimePeriod = 'night' | 'predawn' | 'dawn';

export type ObservatorySettings = {
  bgmEnabled: boolean;
  seEnabled: boolean;
  bgmVolume: number;
  seVolume: number;
};

export type PlatePieceState = {
  placed: boolean;
  rotation: 0 | 90 | 180 | 270;
  slotId: string | null;
};

export type ConstellationPlatePuzzleState = {
  pieces: Record<string, PlatePieceState>;
};

export type TelescopePuzzleState = {
  viewportX: number;
  viewportY: number;
  observedStarIds: string[];
};

export type ConstellationLinesPuzzleState = {
  selectedStarIds: string[];
};

export type ObservatoryGameState = {
  version: number;
  currentArea: ObservatoryAreaId;
  currentScene: ObservatorySceneId;
  currentViewId: string;
  inventory: ObservatoryItemId[];
  selectedItemId: ObservatoryItemId | null;
  collectedItems: ObservatoryItemId[];
  usedItems: ObservatoryItemId[];
  inspectedPoints: string[];
  solvedPuzzles: ObservatoryPuzzleId[];
  flags: {
    constellationPlateRepaired: boolean;
    moonPuzzleSolved: boolean;
    starClockGearInstalled: boolean;
    celestialGlobeAligned: boolean;
    telescopeLensInstalled: boolean;
    telescopeUnlocked: boolean;
    allStarsObserved: boolean;
    constellationConnected: boolean;
    starClockStarted: boolean;
    dawnTimeSolved: boolean;
    skylightUnlocked: boolean;
  };
  puzzleStates: {
    constellationPlate: ConstellationPlatePuzzleState;
    moonPhases: { order: string[] };
    celestialGlobe: { positionId: GlobePosition };
    telescope: TelescopePuzzleState;
    constellationLines: ConstellationLinesPuzzleState;
    dawnTime: { input: string };
  };
  viewedHints: Record<string, number>;
  settings: ObservatorySettings;
  timePeriod: TimePeriod;
  isCleared: boolean;
};

export type ObservatoryHotspot = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  targetScene?: ObservatorySceneId;
  targetArea?: ObservatoryAreaId;
};

export type ObservatoryAction =
  | { type: 'START_NEW' }
  | { type: 'CONTINUE' }
  | { type: 'GO_SCENE'; scene: ObservatorySceneId; area?: ObservatoryAreaId; viewId?: string }
  | { type: 'SELECT_ITEM'; itemId: ObservatoryItemId }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'COLLECT_ITEM'; itemId: ObservatoryItemId }
  | { type: 'USE_ITEM'; itemId: ObservatoryItemId; consume?: boolean }
  | { type: 'REMOVE_ITEMS'; itemIds: ObservatoryItemId[] }
  | { type: 'SOLVE_PUZZLE'; puzzleId: ObservatoryPuzzleId }
  | { type: 'INSPECT'; pointId: string }
  | { type: 'SET_FLAG'; key: keyof ObservatoryGameState['flags']; value: boolean }
  | { type: 'SET_PLATE_STATE'; state: ConstellationPlatePuzzleState }
  | { type: 'SET_MOON_ORDER'; order: string[] }
  | { type: 'SET_GLOBE_POSITION'; positionId: GlobePosition }
  | { type: 'SET_TELESCOPE_STATE'; state: TelescopePuzzleState }
  | { type: 'SET_CONSTELLATION_LINES'; selectedStarIds: string[] }
  | { type: 'SET_DAWN_TIME_INPUT'; input: string }
  | { type: 'SET_TIME_PERIOD'; period: TimePeriod }
  | { type: 'VIEW_HINT'; puzzleId: ObservatoryPuzzleId; level: number }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<ObservatorySettings> }
  | { type: 'CLEAR_GAME' }
  | { type: 'RESET' };
