import { greenhouseInitialState } from './initialState';
import type { GreenhouseAction, GreenhouseGameState } from '../types';

const unique = <T,>(values: T[]) => [...new Set(values)];

export function greenhouseReducer(state: GreenhouseGameState, action: GreenhouseAction): GreenhouseGameState {
  switch (action.type) {
    case 'START_NEW':
      return { ...greenhouseInitialState, currentScene: 'prologue', settings: state.settings };
    case 'CONTINUE':
      return { ...state, currentScene: state.currentScene === 'title' ? 'greenhouse' : state.currentScene };
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
    case 'REMOVE_ITEMS':
      return { ...state, inventory: state.inventory.filter((itemId) => !action.itemIds.includes(itemId)), usedItems: unique([...state.usedItems, ...action.itemIds]) };
    case 'SOLVE_PUZZLE':
      return state.solvedPuzzles.includes(action.puzzleId) ? state : { ...state, solvedPuzzles: [...state.solvedPuzzles, action.puzzleId] };
    case 'INSPECT':
      return { ...state, inspectedPoints: unique([...state.inspectedPoints, action.pointId]) };
    case 'SET_FLAG':
      return { ...state, flags: { ...state.flags, [action.key]: action.value } };
    case 'SET_WATERING_CAN_STATE':
      return { ...state, puzzleStates: { ...state.puzzleStates, wateringCan: action.state } };
    case 'SET_FLOWER_INPUT':
      return { ...state, puzzleStates: { ...state.puzzleStates, flowerColors: { currentInput: action.input } } };
    case 'SET_POT_ORDER':
      return { ...state, puzzleStates: { ...state.puzzleStates, plantPots: { order: action.order } } };
    case 'SET_MIRROR_ANGLES':
      return { ...state, puzzleStates: { ...state.puzzleStates, mirrors: { angles: action.angles } } };
    case 'VIEW_HINT':
      return { ...state, viewedHints: { ...state.viewedHints, [action.puzzleId]: Math.max(state.viewedHints[action.puzzleId] ?? 0, action.level) } };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.settings } };
    case 'CLEAR_GAME':
      return { ...state, currentScene: 'ending', isCleared: true, selectedItemId: null, flags: { ...state.flags, doorUnlocked: true } };
    case 'RESET':
      return { ...greenhouseInitialState, settings: state.settings };
    default:
      return state;
  }
}
