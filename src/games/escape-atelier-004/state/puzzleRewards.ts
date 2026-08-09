import { acquireInventoryItem, removeInventoryItem } from '../../../engine/inventory/inventoryUtils';
import type { InventoryData } from '../../../engine/inventory/types';
import { discoverClue } from '../../../engine/notebook/notebookUtils';
import { studyClues } from '../data/clues';
import { studyItems } from '../data/items';
import { studyPuzzleRewards } from '../data/puzzleRewards';
import type { PuzzleRewardDefinition } from '../data/puzzleRewards';
import type { StudyGameState, StudyItemId, StudyPuzzleId } from '../types';
import { isStudyItemId } from '../types';

export type PuzzleRewardResult = {
  state: StudyGameState;
  changed: boolean;
  reward?: PuzzleRewardDefinition;
};

export function applyPuzzleReward(state: StudyGameState, puzzleId: StudyPuzzleId): PuzzleRewardResult {
  if (state.solvedPuzzles.includes(puzzleId)) return { state, changed: false };

  const reward = studyPuzzleRewards[puzzleId];
  let next: StudyGameState = {
    ...state,
    solvedPuzzles: [...state.solvedPuzzles, puzzleId],
  };

  if (reward.setFlags) {
    next = { ...next, flags: { ...next.flags, ...reward.setFlags } };
  }

  reward.acquireItemIds?.forEach((itemId) => {
    next = applyInventory(next, acquireInventoryItem(inventoryDataFromState(next), studyItems, itemId).data);
  });

  reward.removeItemIds?.forEach((itemId) => {
    next = applyInventory(next, removeInventoryItem(inventoryDataFromState(next), itemId).data);
  });

  reward.discoverClueIds?.forEach((clueId) => {
    const result = discoverClue({ clues: next.notebook.clues, investigationLog: next.investigationLog.entries }, studyClues, clueId);
    next = { ...next, notebook: { clues: result.data.clues }, investigationLog: { entries: result.data.investigationLog } };
  });

  return { state: next, changed: true, reward };
}

function inventoryDataFromState(state: StudyGameState): InventoryData {
  return {
    inventory: state.inventory,
    selectedItemId: state.selectedItemId,
    itemStates: state.itemStates,
    collectedItems: state.collectedItems,
    usedItems: state.usedItems,
  };
}

function applyInventory(state: StudyGameState, data: InventoryData): StudyGameState {
  return {
    ...state,
    inventory: data.inventory,
    selectedItemId: data.selectedItemId && isStudyItemId(data.selectedItemId) ? data.selectedItemId : null,
    itemStates: data.itemStates,
    collectedItems: data.collectedItems.filter((itemId): itemId is StudyItemId => isStudyItemId(itemId)),
    usedItems: data.usedItems.filter((itemId): itemId is StudyItemId => isStudyItemId(itemId)),
  };
}
