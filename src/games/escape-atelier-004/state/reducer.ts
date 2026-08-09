import { applyCombineRule, applyItemUseRule, acquireInventoryItem, normalizeInventory, removeInventoryItem, selectInventoryItem, setInventoryItemState, transformInventoryItem } from '../../../engine/inventory/inventoryUtils';
import { discoverClue, markAllCluesAsRead, markClueAsRead, recordInvestigation } from '../../../engine/notebook/notebookUtils';
import { studyClues } from '../data/clues';
import { studyInvestigationTargets } from '../data/investigationTargets';
import { studyItemCombineRules } from '../data/itemCombineRules';
import { studyItemUseRules } from '../data/itemUseRules';
import { studyItems } from '../data/items';
import { studyInitialState } from './initialState';
import type { StudyAction, StudyGameState, StudyItemId } from '../types';

const unique = <T,>(values: T[]) => [...new Set(values)];

function inventoryDataFromState(state: StudyGameState) {
  return normalizeInventory(state.inventory, studyItems, state.selectedItemId, state.itemStates, state.collectedItems, state.usedItems);
}

function applyInventoryData(state: StudyGameState, data: ReturnType<typeof inventoryDataFromState>): StudyGameState {
  return {
    ...state,
    inventory: data.inventory,
    selectedItemId: data.selectedItemId as StudyItemId | null,
    itemStates: data.itemStates,
    collectedItems: data.collectedItems.filter((itemId): itemId is StudyItemId => itemId in studyItems),
    usedItems: data.usedItems.filter((itemId): itemId is StudyItemId => itemId in studyItems),
  };
}

function applyFlags(state: StudyGameState, flags: Record<string, boolean> | undefined): StudyGameState {
  if (!flags) return state;
  const nextFlags = { ...state.flags };
  Object.entries(flags).forEach(([key, value]) => {
    if (key in nextFlags) nextFlags[key as keyof StudyGameState['flags']] = value;
  });
  return { ...state, flags: nextFlags };
}

function notebookDataFromState(state: StudyGameState) {
  return { clues: state.notebook.clues, investigationLog: state.investigationLog.entries };
}

function applyNotebookData(state: StudyGameState, data: ReturnType<typeof notebookDataFromState>): StudyGameState {
  return { ...state, notebook: { clues: data.clues }, investigationLog: { entries: data.investigationLog } };
}

export function studyReducer(state: StudyGameState, action: StudyAction): StudyGameState {
  switch (action.type) {
    case 'START_NEW':
      return { ...studyInitialState, currentScene: 'prologue', settings: state.settings };
    case 'CONTINUE':
      return { ...state, currentScene: state.currentScene === 'title' ? 'study' : state.currentScene };
    case 'GO_SCENE':
      return { ...state, currentScene: action.scene };
    case 'ACQUIRE_ITEM': {
      const result = acquireInventoryItem(inventoryDataFromState(state), studyItems, action.itemId);
      return applyInventoryData(state, result.data);
    }
    case 'REMOVE_ITEM': {
      const result = removeInventoryItem(inventoryDataFromState(state), action.itemId);
      return applyInventoryData(state, result.data);
    }
    case 'SELECT_ITEM':
      return applyInventoryData(state, selectInventoryItem(inventoryDataFromState(state), studyItems, action.itemId));
    case 'CLEAR_SELECTION':
      return { ...state, selectedItemId: null };
    case 'SET_ITEM_STATE': {
      const result = setInventoryItemState(inventoryDataFromState(state), studyItems, action.itemId, action.stateId);
      return applyInventoryData(state, result.data);
    }
    case 'TRANSFORM_ITEM': {
      const result = transformInventoryItem(inventoryDataFromState(state), studyItems, action.sourceItemId, action.targetItemId);
      return applyInventoryData(state, result.data);
    }
    case 'COMBINE_ITEMS': {
      const result = applyCombineRule(inventoryDataFromState(state), studyItems, studyItemCombineRules, state.completedCombineRules, action.firstItemId, action.secondItemId, state.flags);
      const next = applyFlags(applyInventoryData(state, result.data), result.flags);
      return result.ruleId ? { ...next, completedCombineRules: unique([...next.completedCombineRules, result.ruleId]) } : next;
    }
    case 'USE_ITEM_ON_TARGET': {
      const result = applyItemUseRule(inventoryDataFromState(state), studyItems, studyItemUseRules, state.completedUseRules, action.itemId, action.targetId, state.flags);
      const next = applyFlags(applyInventoryData(state, result.data), result.flags);
      return result.ruleId ? { ...next, completedUseRules: unique([...next.completedUseRules, result.ruleId]) } : next;
    }
    case 'SOLVE_PUZZLE':
      return state.solvedPuzzles.includes(action.puzzleId) ? state : { ...state, solvedPuzzles: [...state.solvedPuzzles, action.puzzleId] };
    case 'INSPECT':
      return { ...state, inspectedPoints: unique([...state.inspectedPoints, action.pointId]) };
    case 'SET_FLAG':
      return { ...state, flags: { ...state.flags, [action.key]: action.value } };
    case 'SET_DIARY_ORDER':
      return { ...state, puzzleStates: { ...state.puzzleStates, diaryRestore: { pageOrder: action.pageOrder } } };
    case 'SET_GLOBE_ROUTES':
      return { ...state, puzzleStates: { ...state.puzzleStates, memoryGlobe: { selectedRouteIds: action.selectedRouteIds } } };
    case 'SET_PAPER_OVERLAY':
      return { ...state, puzzleStates: { ...state.puzzleStates, paperOverlay: action.state } };
    case 'SET_TYPEWRITER_INPUT':
      return { ...state, puzzleStates: { ...state.puzzleStates, typewriterCode: { input: action.input } } };
    case 'VIEW_HINT':
      return { ...state, viewedHints: { ...state.viewedHints, [action.puzzleId]: Math.max(state.viewedHints[action.puzzleId] ?? 0, action.level) } };
    case 'DISCOVER_CLUE': {
      const result = discoverClue(notebookDataFromState(state), studyClues, action.clueId);
      return applyNotebookData(state, result.data);
    }
    case 'MARK_CLUE_READ': {
      const result = markClueAsRead(notebookDataFromState(state), action.clueId);
      return applyNotebookData(state, result.data);
    }
    case 'MARK_ALL_CLUES_READ': {
      const result = markAllCluesAsRead(notebookDataFromState(state));
      return applyNotebookData(state, result.data);
    }
    case 'RECORD_INVESTIGATION': {
      const result = recordInvestigation(notebookDataFromState(state), studyInvestigationTargets, action.targetId, action.message);
      return applyNotebookData(state, result.data);
    }
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.settings } };
    case 'CLEAR_GAME':
      return { ...state, currentScene: 'ending', isCleared: true, selectedItemId: null, flags: { ...state.flags, doorUnlocked: true } };
    case 'RESET':
      return { ...studyInitialState, settings: state.settings };
    default:
      return state;
  }
}
