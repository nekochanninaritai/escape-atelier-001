import { normalizeInventory } from '../../../engine/inventory/inventoryUtils';
import type { InventoryEntry } from '../../../engine/inventory/types';
import { normalizeNotebook } from '../../../engine/notebook/notebookUtils';
import type { ClueState, InvestigationLogEntry } from '../../../engine/notebook/types';
import { STUDY_SAVE_KEY, STUDY_SAVE_VERSION } from '../gameConfig';
import { studyClues } from '../data/clues';
import { studyInvestigationTargets } from '../data/investigationTargets';
import { diaryPageOrder, initialDiaryPageOrder, memoryRouteAnswer } from '../data/puzzles';
import { studyItems } from '../data/items';
import type { StudyGameState, StudyPuzzleId, StudySceneId } from '../types';
import { isStudyItemId } from '../types';
import { studyInitialState } from './initialState';

const scenes: StudySceneId[] = ['title', 'prologue', 'study', 'bookshelf', 'desk', 'typewriter', 'fireplace', 'globe', 'portrait', 'side-table', 'door', 'ending'];
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

function readInventoryEntries(value: unknown): InventoryEntry[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry): InventoryEntry[] => {
    if (typeof entry === 'string') return [entry];
    if (!isRecord(entry) || typeof entry.itemId !== 'string') return [];
    return [{
      itemId: entry.itemId,
      stateId: typeof entry.stateId === 'string' ? entry.stateId : undefined,
      acquiredAt: typeof entry.acquiredAt === 'number' ? entry.acquiredAt : undefined,
      isUsed: entry.isUsed === true,
    }];
  });
}

export function loadStudyState(): StudyGameState {
  try {
    const raw = window.localStorage.getItem(STUDY_SAVE_KEY);
    if (!raw) return studyInitialState;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || typeof parsed.version !== 'number' || parsed.version < 1 || parsed.version > STUDY_SAVE_VERSION) return studyInitialState;
    const puzzleStates = isRecord(parsed.puzzleStates) ? parsed.puzzleStates : {};
    const diary = isRecord(puzzleStates.diaryRestore) ? puzzleStates.diaryRestore : {};
    const globe = isRecord(puzzleStates.memoryGlobe) ? puzzleStates.memoryGlobe : {};
    const paper = isRecord(puzzleStates.paperOverlay) ? puzzleStates.paperOverlay : {};
    const typewriter = isRecord(puzzleStates.typewriterCode) ? puzzleStates.typewriterCode : {};
    const normalizedInventory = normalizeInventory(
      readInventoryEntries(parsed.inventory),
      studyItems,
      typeof parsed.selectedItemId === 'string' ? parsed.selectedItemId : null,
      isRecord(parsed.itemStates) ? Object.fromEntries(Object.entries(parsed.itemStates).filter(([, stateId]) => typeof stateId === 'string')) as Record<string, string> : {},
      Array.isArray(parsed.collectedItems) ? parsed.collectedItems.filter((itemId): itemId is string => typeof itemId === 'string') : [],
      Array.isArray(parsed.usedItems) ? parsed.usedItems.filter((itemId): itemId is string => typeof itemId === 'string') : [],
    );
    const rawNotebook = isRecord(parsed.notebook) ? parsed.notebook : {};
    const rawInvestigationLog = isRecord(parsed.investigationLog) ? parsed.investigationLog : {};
    const normalizedNotebook = normalizeNotebook(
      readClueStates(rawNotebook.clues),
      readInvestigationEntries(rawInvestigationLog.entries),
      studyClues,
      studyInvestigationTargets,
    );

    return {
      ...studyInitialState,
      currentScene: scenes.includes(parsed.currentScene as StudySceneId) ? (parsed.currentScene as StudySceneId) : 'title',
      inventory: normalizedInventory.inventory,
      selectedItemId: normalizedInventory.selectedItemId && isStudyItemId(normalizedInventory.selectedItemId) ? normalizedInventory.selectedItemId : null,
      itemStates: normalizedInventory.itemStates,
      collectedItems: normalizedInventory.collectedItems.filter(isStudyItemId),
      usedItems: normalizedInventory.usedItems.filter(isStudyItemId),
      completedCombineRules: Array.isArray(parsed.completedCombineRules) ? parsed.completedCombineRules.filter((id): id is string => typeof id === 'string') : [],
      completedUseRules: Array.isArray(parsed.completedUseRules) ? parsed.completedUseRules.filter((id): id is string => typeof id === 'string') : [],
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
      notebook: { clues: normalizedNotebook.clues },
      investigationLog: { entries: normalizedNotebook.investigationLog },
      settings: isRecord(parsed.settings) ? { ...studyInitialState.settings, ...parsed.settings } : studyInitialState.settings,
      isCleared: typeof parsed.isCleared === 'boolean' ? parsed.isCleared : false,
    };
  } catch {
    return studyInitialState;
  }
}

function readClueStates(value: unknown): ClueState[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry): ClueState[] => {
    if (!isRecord(entry) || typeof entry.clueId !== 'string') return [];
    return [{ clueId: entry.clueId, discoveredAt: typeof entry.discoveredAt === 'number' ? entry.discoveredAt : undefined, isRead: entry.isRead === true }];
  });
}

function readInvestigationEntries(value: unknown): InvestigationLogEntry[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry): InvestigationLogEntry[] => {
    if (!isRecord(entry) || typeof entry.targetId !== 'string') return [];
    return [{
      targetId: entry.targetId,
      inspectedAt: typeof entry.inspectedAt === 'number' ? entry.inspectedAt : undefined,
      count: typeof entry.count === 'number' ? entry.count : 1,
      latestMessage: typeof entry.latestMessage === 'string' ? entry.latestMessage : undefined,
    }];
  });
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
