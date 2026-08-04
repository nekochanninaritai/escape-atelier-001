export type GreenhouseSceneId =
  | 'title'
  | 'prologue'
  | 'greenhouse'
  | 'tree'
  | 'pots'
  | 'fountain'
  | 'workbench'
  | 'mirrorDevice'
  | 'door'
  | 'statue'
  | 'ending';

export type GreenhouseItemId =
  | 'canPiece1'
  | 'canPiece2'
  | 'canPiece3'
  | 'wateringCan'
  | 'wateredCan'
  | 'flowerSeed'
  | 'smallMirror'
  | 'butterflyKey';

export type GreenhousePuzzleId = 'wateringCan' | 'flowerColors' | 'plantPots' | 'mirrorLight';

export type GreenhouseSettings = {
  bgmEnabled: boolean;
  seEnabled: boolean;
  bgmVolume: number;
  seVolume: number;
};

export type WateringCanPuzzleState = {
  placedPieceIds: string[];
};

export type PlantPotsPuzzleState = {
  order: string[];
};

export type MirrorLightPuzzleState = {
  angles: Record<string, number>;
};

export type GreenhouseGameState = {
  version: number;
  currentScene: GreenhouseSceneId;
  inventory: GreenhouseItemId[];
  selectedItemId: GreenhouseItemId | null;
  collectedItems: GreenhouseItemId[];
  usedItems: GreenhouseItemId[];
  inspectedPoints: string[];
  solvedPuzzles: GreenhousePuzzleId[];
  flags: {
    wateringCanRepaired: boolean;
    waterCollected: boolean;
    plantWatered: boolean;
    flowersBloomed: boolean;
    seedPlanted: boolean;
    mirrorInstalled: boolean;
    treeBloomed: boolean;
    doorUnlocked: boolean;
  };
  puzzleStates: {
    wateringCan: WateringCanPuzzleState;
    flowerColors: { currentInput: string[] };
    plantPots: PlantPotsPuzzleState;
    mirrors: MirrorLightPuzzleState;
  };
  viewedHints: Record<string, number>;
  settings: GreenhouseSettings;
  isCleared: boolean;
};

export type GreenhouseHotspot = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  targetScene?: GreenhouseSceneId;
};

export type GreenhouseAction =
  | { type: 'START_NEW' }
  | { type: 'CONTINUE' }
  | { type: 'GO_SCENE'; scene: GreenhouseSceneId }
  | { type: 'SELECT_ITEM'; itemId: GreenhouseItemId }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'COLLECT_ITEM'; itemId: GreenhouseItemId }
  | { type: 'USE_ITEM'; itemId: GreenhouseItemId; consume?: boolean }
  | { type: 'REMOVE_ITEMS'; itemIds: GreenhouseItemId[] }
  | { type: 'SOLVE_PUZZLE'; puzzleId: GreenhousePuzzleId }
  | { type: 'INSPECT'; pointId: string }
  | { type: 'SET_FLAG'; key: keyof GreenhouseGameState['flags']; value: boolean }
  | { type: 'SET_WATERING_CAN_STATE'; state: WateringCanPuzzleState }
  | { type: 'SET_FLOWER_INPUT'; input: string[] }
  | { type: 'SET_POT_ORDER'; order: string[] }
  | { type: 'SET_MIRROR_ANGLES'; angles: Record<string, number> }
  | { type: 'VIEW_HINT'; puzzleId: GreenhousePuzzleId; level: number }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<GreenhouseSettings> }
  | { type: 'CLEAR_GAME' }
  | { type: 'RESET' };
