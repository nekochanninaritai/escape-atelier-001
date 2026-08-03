import { initialState } from './initialState';
import type { GameAction, GameState } from '../types/game';

const unique = <T,>(values: T[]) => [...new Set(values)];

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_NEW':
      return { ...initialState, currentScene: 'prologue', settings: state.settings };
    case 'CONTINUE':
      return { ...state, currentScene: action.scene ?? (state.currentScene === 'title' ? 'room' : state.currentScene) };
    case 'GO_SCENE':
      return { ...state, currentScene: action.scene };
    case 'SELECT_ITEM':
      return { ...state, selectedItemId: state.selectedItemId === action.itemId ? null : action.itemId };
    case 'CLEAR_SELECTION':
      return { ...state, selectedItemId: null };
    case 'COLLECT_ITEM': {
      if (state.collectedItems.includes(action.itemId)) return state;
      return {
        ...state,
        inventory: unique([...state.inventory, action.itemId]),
        collectedItems: unique([...state.collectedItems, action.itemId]),
      };
    }
    case 'USE_ITEM':
      return {
        ...state,
        inventory: action.consume ? state.inventory.filter((itemId) => itemId !== action.itemId) : state.inventory,
        selectedItemId: state.selectedItemId === action.itemId ? null : state.selectedItemId,
      };
    case 'SOLVE_PUZZLE':
      if (state.solvedPuzzles.includes(action.puzzleId)) return state;
      return { ...state, solvedPuzzles: [...state.solvedPuzzles, action.puzzleId] };
    case 'INSPECT':
      return { ...state, inspectedPoints: unique([...state.inspectedPoints, action.pointId]) };
    case 'SET_FLAG':
      return { ...state, flags: { ...state.flags, [action.key]: action.value } };
    case 'VIEW_HINT':
      return {
        ...state,
        viewedHints: {
          ...state.viewedHints,
          [action.puzzleId]: Math.max(state.viewedHints[action.puzzleId] ?? 0, action.level),
        },
      };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.settings } };
    case 'CLEAR_GAME':
      return { ...state, currentScene: 'ending', isCleared: true, selectedItemId: null };
    case 'RESET':
      return { ...initialState, settings: state.settings };
    default:
      return state;
  }
}
