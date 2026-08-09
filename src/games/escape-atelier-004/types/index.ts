export type {
  BookshelfPuzzleState,
  DiaryRepairState,
  DiaryRestoreState,
  FinalTimeState,
  GlobeState,
  MemoryGlobeState,
  OverlayPaperState,
  PaperOverlayState,
  StudyPuzzleId,
  StudyPuzzleStates,
  TypewriterPuzzleState,
} from './puzzles';
export { STUDY_PUZZLE_IDS, normalizeStudyPuzzleId } from './puzzles';

export type { HotspotAction, HotspotDefinition, StudyHotspot, StudySceneDefinition, StudySceneId } from './scenes';
export { STUDY_SCENE_IDS, normalizeStudySceneId } from './scenes';

export type { StudyAction, StudyFlags, StudyGameState, StudyItemId, StudySettings } from './gameState';
export { STUDY_ITEM_IDS, isStudyItemId } from './gameState';
