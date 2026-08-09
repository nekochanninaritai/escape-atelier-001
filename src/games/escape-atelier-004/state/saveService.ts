import { STUDY_SAVE_KEY, STUDY_SAVE_VERSION } from '../gameConfig';
import { diaryPageOrder, initialDiaryPageOrder, memoryRouteAnswer } from '../data/puzzles';
import type { StudyGameState, StudyItemId, StudyPuzzleId, StudySceneId } from '../types';
import { studyInitialState } from './initialState';

const scenes: StudySceneId[] = ['title', 'prologue', 'study', 'bookshelf', 'desk', 'typewriter', 'fireplace', 'globe', 'portrait', 'side-table', 'door', 'ending'];
const items: StudyItemId[] = ['diaryPage', 'letterFragment', 'inkRibbon', 'transparentPaper', 'memoryKey'];
const puzzles: StudyPuzzleId[] = ['diaryRestore', 'memoryGlobe', 'paperOverlay', 'typewriterCode'];

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const filterIds = <T extends string>(value: unknown, allowed: readonly T[]) => (Array.isArray(value) ? value.filter((id): id is T => allowed.includes(id as T)) : []);
const clampNumber = (value: unknown, min: number, max: number, fallback: number) => (typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback);

function readFlags(value: unknown): StudyGameState['flags'] {
  if (!isRecord(value)) return studyInitialState.flags;
  return Object.fromEntries(
    Object.entries(studyInitialState.flags).map(([key, fallback]) => [key, typeof value[key] === 'boolean' ? value[key] : fallback]),
  ) as StudyGameState['flags'];
}

export function loadStudyState(): StudyGameState {
  try {
    const raw = window.localStorage.getItem(STUDY_SAVE_KEY);
    if (!raw) return studyInitialState;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== STUDY_SAVE_VERSION) return studyInitialState;
    const puzzleStates = isRecord(parsed.puzzleStates) ? parsed.puzzleStates : {};
    const diary = isRecord(puzzleStates.diaryRestore) ? puzzleStates.diaryRestore : {};
    const globe = isRecord(puzzleStates.memoryGlobe) ? puzzleStates.memoryGlobe : {};
    const paper = isRecord(puzzleStates.paperOverlay) ? puzzleStates.paperOverlay : {};
    const typewriter = isRecord(puzzleStates.typewriterCode) ? puzzleStates.typewriterCode : {};

    return {
      ...studyInitialState,
      currentScene: scenes.includes(parsed.currentScene as StudySceneId) ? (parsed.currentScene as StudySceneId) : 'title',
      inventory: filterIds(parsed.inventory, items),
      selectedItemId: items.includes(parsed.selectedItemId as StudyItemId) ? (parsed.selectedItemId as StudyItemId) : null,
      collectedItems: filterIds(parsed.collectedItems, items),
      usedItems: filterIds(parsed.usedItems, items),
      inspectedPoints: Array.isArray(parsed.inspectedPoints) ? parsed.inspectedPoints.filter((id): id is string => typeof id === 'string') : [],
      solvedPuzzles: filterIds(parsed.solvedPuzzles, puzzles),
      flags: readFlags(parsed.flags),
      puzzleStates: {
        diaryRestore: {
          pageOrder: filterIds(diary.pageOrder, diaryPageOrder).length === diaryPageOrder.length ? filterIds(diary.pageOrder, diaryPageOrder) : [...initialDiaryPageOrder],
        },
        memoryGlobe: { selectedRouteIds: filterIds(globe.selectedRouteIds, memoryRouteAnswer) },
        paperOverlay: {
          paperOffsetX: clampNumber(paper.paperOffsetX, -160, 160, studyInitialState.puzzleStates.paperOverlay.paperOffsetX),
          paperOffsetY: clampNumber(paper.paperOffsetY, -160, 160, studyInitialState.puzzleStates.paperOverlay.paperOffsetY),
          rotation: clampNumber(paper.rotation, -45, 45, studyInitialState.puzzleStates.paperOverlay.rotation),
        },
        typewriterCode: { input: typeof typewriter.input === 'string' ? typewriter.input.slice(0, 16) : '' },
      },
      viewedHints: isRecord(parsed.viewedHints) ? (Object.fromEntries(Object.entries(parsed.viewedHints).filter(([, value]) => typeof value === 'number')) as Record<string, number>) : {},
      settings: isRecord(parsed.settings) ? { ...studyInitialState.settings, ...parsed.settings } : studyInitialState.settings,
      isCleared: typeof parsed.isCleared === 'boolean' ? parsed.isCleared : false,
    };
  } catch {
    return studyInitialState;
  }
}

export function saveStudyState(state: StudyGameState) {
  try {
    window.localStorage.setItem(STUDY_SAVE_KEY, JSON.stringify(state));
  } catch {
    // Storage failures should not stop play.
  }
}

export function hasStudySaveData() {
  try {
    return window.localStorage.getItem(STUDY_SAVE_KEY) !== null;
  } catch {
    return false;
  }
}

export function clearStudySaveData() {
  try {
    window.localStorage.removeItem(STUDY_SAVE_KEY);
  } catch {
    // Storage failures should not stop play.
  }
}
