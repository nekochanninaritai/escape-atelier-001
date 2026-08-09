import type { StudyFlags, StudyItemId, StudyPuzzleId, StudySceneId } from '../types';

export type StudyGameActionDefinition =
  | { type: 'show-message'; messageId: string }
  | { type: 'goto-scene'; sceneId: StudySceneId }
  | { type: 'acquire-item'; itemId: StudyItemId }
  | { type: 'remove-item'; itemId: StudyItemId }
  | { type: 'discover-clue'; clueId: string }
  | { type: 'record-investigation'; targetId: string }
  | { type: 'open-puzzle'; puzzleId: StudyPuzzleId }
  | { type: 'set-flag'; flagId: keyof StudyFlags; value: boolean }
  | { type: 'conditional-message'; conditionId: string; successMessageId: string; failureMessageId: string };

export type StudyGameCondition =
  | { type: 'has-item'; itemId: StudyItemId }
  | { type: 'flag'; flagId: keyof StudyFlags; value: boolean }
  | { type: 'puzzle-solved'; puzzleId: StudyPuzzleId }
  | { type: 'clue-discovered'; clueId: string }
  | { type: 'scene'; sceneId: StudySceneId };

