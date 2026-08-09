import type { QuarterRotation } from '../../../engine/phaser/types';

export const STUDY_PUZZLE_IDS = ['diary-repair', 'globe', 'typewriter', 'overlay-paper', 'bookshelf', 'portrait-time'] as const;

export type StudyPuzzleId = (typeof STUDY_PUZZLE_IDS)[number];

export type DiaryRepairState = {
  pageOrder: string[];
  pieces: Record<
    string,
    {
      x: number;
      y: number;
      rotation: QuarterRotation;
      placed: boolean;
    }
  >;
};

export type GlobeState = {
  positionId: string;
  selectedRouteIds: string[];
};

export type TypewriterPuzzleState = {
  input: string;
};

export type OverlayPaperState = {
  x: number;
  y: number;
  rotation: number;
  aligned: boolean;
  paperOffsetX: number;
  paperOffsetY: number;
};

export type BookshelfPuzzleState = {
  selectedBookId: string | null;
  openedPage: number | null;
};

export type FinalTimeState = {
  hour: number | null;
  minute: number | null;
};

export type StudyPuzzleStates = {
  diaryRepair: DiaryRepairState;
  globe: GlobeState;
  typewriter: TypewriterPuzzleState;
  overlayPaper: OverlayPaperState;
  bookshelf: BookshelfPuzzleState;
  portraitTime: FinalTimeState;
};

export type DiaryRestoreState = DiaryRepairState;
export type MemoryGlobeState = GlobeState;
export type PaperOverlayState = OverlayPaperState;

const LEGACY_PUZZLE_ALIASES: Record<string, StudyPuzzleId> = {
  diaryRestore: 'diary-repair',
  memoryGlobe: 'globe',
  paperOverlay: 'overlay-paper',
  typewriterCode: 'typewriter',
};

export function normalizeStudyPuzzleId(value: unknown): StudyPuzzleId | null {
  if (typeof value !== 'string') return null;
  if (STUDY_PUZZLE_IDS.includes(value as StudyPuzzleId)) return value as StudyPuzzleId;
  return LEGACY_PUZZLE_ALIASES[value] ?? null;
}

