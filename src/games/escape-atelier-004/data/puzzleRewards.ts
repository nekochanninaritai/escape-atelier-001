import type { StudyFlags, StudyItemId, StudyPuzzleId } from '../types';

export type PuzzleRewardDefinition = {
  puzzleId: StudyPuzzleId;
  acquireItemIds?: StudyItemId[];
  removeItemIds?: StudyItemId[];
  discoverClueIds?: string[];
  setFlags?: Partial<StudyFlags>;
  successMessageId?: string;
};

export const studyPuzzleRewards: Record<StudyPuzzleId, PuzzleRewardDefinition> = {
  'diary-repair': {
    puzzleId: 'diary-repair',
    removeItemIds: ['diary-piece-01', 'diary-piece-02', 'diary-piece-03'],
    discoverClueIds: ['diary-restored'],
    setFlags: {
      diaryRestored: true,
      globeUnlocked: true,
    },
    successMessageId: 'puzzle.diaryRepair.complete',
  },
  globe: {
    puzzleId: 'globe',
    setFlags: {
      globeSolved: true,
      memoryRouteAligned: true,
    },
    successMessageId: 'puzzle.globe.complete',
  },
  typewriter: {
    puzzleId: 'typewriter',
    acquireItemIds: ['typed-paper'],
    discoverClueIds: ['typed-paper'],
    setFlags: {
      typewriterSolved: true,
    },
    successMessageId: 'puzzle.typewriter.complete',
  },
  'overlay-paper': {
    puzzleId: 'overlay-paper',
    acquireItemIds: ['overlay-clue'],
    discoverClueIds: ['overlay-result'],
    setFlags: {
      overlaySolved: true,
      paperAligned: true,
    },
    successMessageId: 'puzzle.overlayPaper.complete',
  },
  bookshelf: {
    puzzleId: 'bookshelf',
    discoverClueIds: ['selected-book'],
    setFlags: {
      bookshelfClueFound: true,
      targetBookOpened: true,
    },
  },
  'portrait-time': {
    puzzleId: 'portrait-time',
    acquireItemIds: ['study-key'],
    discoverClueIds: ['final-time-clue'],
    setFlags: {
      portraitClueFound: true,
      finalTimeSolved: true,
      studyKeyFound: true,
    },
  },
};
