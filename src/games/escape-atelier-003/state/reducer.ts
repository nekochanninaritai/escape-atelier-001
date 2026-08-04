import { observatoryInitialState } from './initialState';
import type { ObservatoryAction, ObservatoryGameState } from '../types';

const unique = <T,>(values: T[]) => [...new Set(values)];

export function observatoryReducer(state: ObservatoryGameState, action: ObservatoryAction): ObservatoryGameState {
  switch (action.type) {
    case 'START_NEW':
      return { ...observatoryInitialState, currentScene: 'prologue', settings: state.settings };
    case 'CONTINUE':
      return { ...state, currentScene: state.currentScene === 'title' ? 'lower-main' : state.currentScene };
    case 'GO_SCENE':
      return {
        ...state,
        currentScene: action.scene,
        currentArea: action.area ?? state.currentArea,
        currentViewId: action.viewId ?? action.scene,
      };
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
    case 'SET_PLATE_STATE':
      return { ...state, puzzleStates: { ...state.puzzleStates, constellationPlate: action.state } };
    case 'SET_MOON_ORDER':
      return { ...state, puzzleStates: { ...state.puzzleStates, moonPhases: { order: action.order } } };
    case 'SET_GLOBE_POSITION':
      return { ...state, puzzleStates: { ...state.puzzleStates, celestialGlobe: { positionId: action.positionId } } };
    case 'SET_TELESCOPE_STATE':
      return { ...state, puzzleStates: { ...state.puzzleStates, telescope: action.state } };
    case 'SET_CONSTELLATION_LINES':
      return { ...state, puzzleStates: { ...state.puzzleStates, constellationLines: { selectedStarIds: action.selectedStarIds } } };
    case 'SET_DAWN_TIME_INPUT':
      return { ...state, puzzleStates: { ...state.puzzleStates, dawnTime: { input: action.input } } };
    case 'SET_TIME_PERIOD':
      return { ...state, timePeriod: action.period };
    case 'VIEW_HINT':
      return { ...state, viewedHints: { ...state.viewedHints, [action.puzzleId]: Math.max(state.viewedHints[action.puzzleId] ?? 0, action.level) } };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.settings } };
    case 'CLEAR_GAME':
      if (state.isCleared) return state;
      return { ...state, currentScene: 'ending', timePeriod: 'dawn', isCleared: true, selectedItemId: null, flags: { ...state.flags, skylightUnlocked: true } };
    case 'RESET':
      return { ...observatoryInitialState, settings: state.settings };
    default:
      return state;
  }
}
