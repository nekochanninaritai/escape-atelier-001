import type { StudyGameCondition } from '../data/actions';
import type { StudyGameState } from '../types';

export function evaluateCondition(condition: StudyGameCondition, gameState: StudyGameState): boolean {
  if (condition.type === 'has-item') return gameState.inventory.some((entry) => entry.itemId === condition.itemId);
  if (condition.type === 'flag') return gameState.flags[condition.flagId] === condition.value;
  if (condition.type === 'puzzle-solved') return gameState.solvedPuzzles.includes(condition.puzzleId);
  if (condition.type === 'clue-discovered') return gameState.notebook.clues.some((clue) => clue.clueId === condition.clueId);
  return gameState.currentScene === condition.sceneId;
}

export function evaluateConditions(conditions: readonly StudyGameCondition[] | undefined, gameState: StudyGameState): boolean {
  return !conditions || conditions.every((condition) => evaluateCondition(condition, gameState));
}

