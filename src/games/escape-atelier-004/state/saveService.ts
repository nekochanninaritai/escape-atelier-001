import { normalizeInventory } from '../../../engine/inventory/inventoryUtils';
import type { InventoryEntry } from '../../../engine/inventory/types';
import { normalizeNotebook } from '../../../engine/notebook/notebookUtils';
import type { ClueState, InvestigationLogEntry } from '../../../engine/notebook/types';
import { normalizeQuarterRotation } from '../../../engine/phaser/utils/rotation';
import { STUDY_SAVE_KEY, STUDY_SAVE_VERSION } from '../gameConfig';
import { studyClues } from '../data/clues';
import { studyInvestigationTargets } from '../data/investigationTargets';
import { diaryPageOrder, initialDiaryPageOrder, memoryRouteAnswer } from '../data/puzzles';
import { studyItems } from '../data/items';
import type { StudyFlags, StudyGameState, StudyPuzzleId } from '../types';
import { isStudyItemId, normalizeStudyPuzzleId, normalizeStudySceneId } from '../types';
import { createInitialStudyGameState, studyInitialState } from './initialState';

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const unique = <T,>(values: readonly T[]) => [...new Set(values)];
const clampNumber = (value: unknown, min: number, max: number, fallback: number) => (typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback);

export function serializeStudyState(state: StudyGameState): string {
  return JSON.stringify({ ...state, version: STUDY_SAVE_VERSION });
}

export function parseStudyState(raw: string | null): StudyGameState {
  if (!raw) return createInitialStudyGameState();
  try {
    return normalizeStudyState(JSON.parse(raw));
  } catch {
    return createInitialStudyGameState();
  }
}

export function normalizeStudyState(value: unknown): StudyGameState {
  const initial = createInitialStudyGameState();
  if (!isRecord(value)) return initial;
  const parsedVersion = typeof value.version === 'number' && Number.isFinite(value.version) ? value.version : 1;
  if (parsedVersion < 1 || parsedVersion > STUDY_SAVE_VERSION) return initial;

  const normalizedInventory = normalizeInventory(
    readInventoryEntries(value.inventory),
    studyItems,
    typeof value.selectedItemId === 'string' ? value.selectedItemId : null,
    isRecord(value.itemStates) ? Object.fromEntries(Object.entries(value.itemStates).filter(([, stateId]) => typeof stateId === 'string')) as Record<string, string> : {},
    readStringList(value.collectedItems),
    readStringList(value.usedItems),
  );

  const rawNotebook = isRecord(value.notebook) ? value.notebook : {};
  const rawInvestigationLog = isRecord(value.investigationLog) ? value.investigationLog : {};
  const normalizedNotebook = normalizeNotebook(
    readClueStates(rawNotebook.clues),
    readInvestigationEntries(rawInvestigationLog.entries),
    studyClues,
    studyInvestigationTargets,
  );

  const flags = normalizeFlags(value.flags, value.isCleared === true, normalizedInventory.collectedItems);

  return {
    ...initial,
    version: STUDY_SAVE_VERSION,
    currentScene: normalizeStudySceneId(value.currentScene),
    inventory: normalizedInventory.inventory,
    selectedItemId: normalizedInventory.selectedItemId && isStudyItemId(normalizedInventory.selectedItemId) ? normalizedInventory.selectedItemId : null,
    itemStates: normalizedInventory.itemStates,
    collectedItems: normalizedInventory.collectedItems.filter(isStudyItemId),
    usedItems: normalizedInventory.usedItems.filter(isStudyItemId),
    completedCombineRules: unique(readStringList(value.completedCombineRules)),
    completedUseRules: unique(readStringList(value.completedUseRules)),
    completedInteractions: unique(readStringList(value.completedInteractions)),
    inspectedPoints: unique(readStringList(value.inspectedPoints)),
    solvedPuzzles: normalizePuzzleIds(value.solvedPuzzles),
    flags,
    puzzleStates: normalizePuzzleStates(value.puzzleStates),
    viewedHints: normalizeViewedHints(value.viewedHints),
    notebook: { clues: normalizedNotebook.clues },
    investigationLog: { entries: normalizedNotebook.investigationLog },
    settings: normalizeSettings(value.settings),
    isCleared: value.isCleared === true,
  };
}

export function loadStudyState(): StudyGameState {
  try {
    return parseStudyState(window.localStorage.getItem(STUDY_SAVE_KEY));
  } catch {
    return createInitialStudyGameState();
  }
}

function normalizeFlags(value: unknown, isCleared: boolean, collectedItems: readonly string[]): StudyFlags {
  const initial = studyInitialState.flags;
  const source = isRecord(value) ? value : {};
  const next = Object.fromEntries(
    Object.entries(initial).map(([key, fallback]) => [key, typeof source[key] === 'boolean' ? source[key] : fallback]),
  ) as StudyFlags;
  next.globeSolved = next.globeSolved || next.memoryRouteAligned;
  next.overlaySolved = next.overlaySolved || next.paperAligned;
  next.exitDoorUnlocked = next.exitDoorUnlocked || next.doorUnlocked || isCleared;
  next.doorUnlocked = next.doorUnlocked || next.exitDoorUnlocked;
  next.diaryPiecesCollected = next.diaryPiecesCollected || ['diary-piece-01', 'diary-piece-02', 'diary-piece-03'].every((itemId) => collectedItems.includes(itemId));
  return next;
}

function normalizePuzzleStates(value: unknown): StudyGameState['puzzleStates'] {
  const initial = createInitialStudyGameState().puzzleStates;
  const puzzleStates = isRecord(value) ? value : {};
  const diary = readRecordFromAliases(puzzleStates, ['diaryRepair', 'diaryRestore']);
  const globe = readRecordFromAliases(puzzleStates, ['globe', 'memoryGlobe']);
  const overlay = readRecordFromAliases(puzzleStates, ['overlayPaper', 'paperOverlay']);
  const typewriter = readRecordFromAliases(puzzleStates, ['typewriter', 'typewriterCode']);
  const bookshelf = readRecordFromAliases(puzzleStates, ['bookshelf']);
  const portraitTime = readRecordFromAliases(puzzleStates, ['portraitTime', 'finalTime']);

  const pageOrder = filterIds(diary.pageOrder, diaryPageOrder);
  const paperOffsetX = clampNumber(overlay.paperOffsetX ?? overlay.x, -160, 160, initial.overlayPaper.paperOffsetX);
  const paperOffsetY = clampNumber(overlay.paperOffsetY ?? overlay.y, -160, 160, initial.overlayPaper.paperOffsetY);

  return {
    diaryRepair: {
      pageOrder: pageOrder.length === diaryPageOrder.length ? pageOrder : [...initialDiaryPageOrder],
      pieces: normalizeDiaryPieces(diary.pieces),
    },
    globe: {
      positionId: typeof globe.positionId === 'string' ? globe.positionId.slice(0, 40) : initial.globe.positionId,
      selectedRouteIds: filterIds(globe.selectedRouteIds, memoryRouteAnswer),
    },
    overlayPaper: {
      paperOffsetX,
      paperOffsetY,
      x: paperOffsetX,
      y: paperOffsetY,
      rotation: clampNumber(overlay.rotation, -45, 45, initial.overlayPaper.rotation),
      aligned: overlay.aligned === true,
    },
    typewriter: {
      input: typeof typewriter.input === 'string' ? typewriter.input.slice(0, 16) : '',
    },
    bookshelf: {
      selectedBookId: typeof bookshelf.selectedBookId === 'string' ? bookshelf.selectedBookId.slice(0, 40) : null,
      openedPage: typeof bookshelf.openedPage === 'number' && Number.isInteger(bookshelf.openedPage) ? bookshelf.openedPage : null,
    },
    portraitTime: {
      hour: clampNullableInteger(portraitTime.hour, 0, 23),
      minute: clampNullableInteger(portraitTime.minute, 0, 59),
    },
  };
}

function normalizeDiaryPieces(value: unknown): StudyGameState['puzzleStates']['diaryRepair']['pieces'] {
  const initial = createInitialStudyGameState().puzzleStates.diaryRepair.pieces;
  if (!isRecord(value)) return initial;
  return Object.fromEntries(
    Object.entries(initial).map(([pieceId, fallback]) => {
      const piece = isRecord(value[pieceId]) ? value[pieceId] : {};
      return [
        pieceId,
        {
          x: clampNumber(piece.x, 0, 720, fallback.x),
          y: clampNumber(piece.y, 0, 520, fallback.y),
          rotation: typeof piece.rotation === 'number' ? normalizeQuarterRotation(piece.rotation) : fallback.rotation,
          placed: piece.placed === true,
        },
      ];
    }),
  );
}

function normalizeSettings(value: unknown): StudyGameState['settings'] {
  const fallback = studyInitialState.settings;
  if (!isRecord(value)) return fallback;
  return {
    bgmEnabled: typeof value.bgmEnabled === 'boolean' ? value.bgmEnabled : fallback.bgmEnabled,
    seEnabled: typeof value.seEnabled === 'boolean' ? value.seEnabled : fallback.seEnabled,
    bgmVolume: clampNumber(value.bgmVolume, 0, 1, fallback.bgmVolume),
    seVolume: clampNumber(value.seVolume, 0, 1, fallback.seVolume),
  };
}

function normalizeViewedHints(value: unknown): Record<string, number> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    Object.entries(value).flatMap(([puzzleId, level]) => {
      const normalizedPuzzleId = normalizeStudyPuzzleId(puzzleId);
      return normalizedPuzzleId && typeof level === 'number' && Number.isFinite(level) ? [[normalizedPuzzleId, Math.max(0, Math.floor(level))]] : [];
    }),
  );
}

function normalizePuzzleIds(value: unknown): StudyPuzzleId[] {
  return unique(readStringList(value).flatMap((puzzleId) => normalizeStudyPuzzleId(puzzleId) ?? []));
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
      targetId: entry.targetId === 'door' ? 'exit-door' : entry.targetId,
      inspectedAt: typeof entry.inspectedAt === 'number' ? entry.inspectedAt : undefined,
      count: typeof entry.count === 'number' ? entry.count : 1,
      latestMessage: typeof entry.latestMessage === 'string' ? entry.latestMessage : undefined,
    }];
  });
}

function readStringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : [];
}

function readRecordFromAliases(source: Record<string, unknown>, keys: readonly string[]): Record<string, unknown> {
  const match = keys.find((key) => isRecord(source[key]));
  return match && isRecord(source[match]) ? source[match] : {};
}

function filterIds<T extends string>(value: unknown, allowed: readonly T[]): T[] {
  return readStringList(value).filter((id): id is T => allowed.includes(id as T));
}

function clampNullableInteger(value: unknown, min: number, max: number): number | null {
  if (typeof value !== 'number' || !Number.isInteger(value)) return null;
  return Math.min(max, Math.max(min, value));
}

export function saveStudyState(state: StudyGameState) {
  try {
    window.localStorage.setItem(STUDY_SAVE_KEY, serializeStudyState(state));
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
