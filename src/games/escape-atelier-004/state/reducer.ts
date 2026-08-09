import { studyInitialState } from './initialState';
import type { StudyAction, StudyGameState } from '../types';

const unique = <T,>(values: T[]) => [...new Set(values)];

export function studyReducer(state: StudyGameState, action: StudyAction): StudyGameState {
  switch (action.type) {
    case 'START_NEW':
      return { ...studyInitialState, currentScene: 'prologue', settings: state.settings };
    case 'CONTINUE':
      return { ...state, currentScene: state.currentScene === 'title' ? 'study' : state.currentScene };
    case 'GO_SCENE':
      return { ...state, currentScene: action.scene };
    case 'SELECT_ITEM':
      return { ...state, selectedItemId: state.selectedItemId === action.itemId ? null : action.itemId };
    case 'CLEAR_SELECTION':
      return { ...state, selectedItemId: null };
    case 'COLLECT_ITEM':
      if (state.collectedItems.includes(action.itemId)) return state;
      return { ...state, inventory: unique([...state.inventory, action.itemId]), collectedItems: unique([...state.collectedItems, action.itemId]) };
    case 'USE_ITEM':
      return {
        ...state,
        inventory: action.consume ? state.inventory.filter((itemId) => itemId !== action.itemId) : state.inventory,
        usedItems: unique([...state.usedItems, action.itemId]),
        selectedItemId: state.selectedItemId === action.itemId ? null : state.selectedItemId,
      };
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
