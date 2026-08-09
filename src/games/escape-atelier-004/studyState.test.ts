import { describe, expect, it } from 'vitest';
import { evaluateCondition, evaluateConditions } from './state/conditions';
import { createInitialStudyGameState } from './state/initialState';
import { applyPuzzleReward } from './state/puzzleRewards';
import { normalizeStudyState, parseStudyState, serializeStudyState } from './state/saveService';

describe('Escape Atelier #004 game state foundation', () => {
  it('creates independent initial states', () => {
    const first = createInitialStudyGameState();
    const second = createInitialStudyGameState();
    first.puzzleStates.diaryRepair.pageOrder.reverse();
    first.flags.diaryRestored = true;
    expect(second.puzzleStates.diaryRepair.pageOrder).toEqual(['autumn', 'spring', 'winter', 'summer']);
    expect(second.flags.diaryRestored).toBe(false);
  });

  it('normalizes missing and legacy save fields without losing valid progress', () => {
    const state = normalizeStudyState({
      version: 2,
      currentScene: 'door',
      inventory: ['sealed-letter', 'missing-item', { itemId: 'paper-knife', acquiredAt: 12 }],
      selectedItemId: 'missing-item',
      solvedPuzzles: ['diaryRestore', 'paperOverlay', 'unknown'],
      flags: { doorUnlocked: true, paperAligned: true },
      puzzleStates: {
        diaryRestore: { pageOrder: ['spring', 'summer', 'autumn', 'winter'] },
        memoryGlobe: { selectedRouteIds: ['library', 'missing', 'study'] },
        paperOverlay: { paperOffsetX: 999, paperOffsetY: -999, rotation: 80 },
        typewriterCode: { input: 'REMEMBER-TOO-LONG' },
      },
      notebook: { clues: [{ clueId: 'sealed-letter', isRead: false }, { clueId: 'missing', isRead: true }] },
      investigationLog: { entries: [{ targetId: 'door', count: 2 }] },
      viewedHints: { diaryRestore: 2, missing: 9 },
    });

    expect(state.currentScene).toBe('exit-door');
    expect(state.inventory.map((item) => item.itemId)).toEqual(['sealed-letter', 'paper-knife']);
    expect(state.selectedItemId).toBeNull();
    expect(state.solvedPuzzles).toEqual(['diary-repair', 'overlay-paper']);
    expect(state.flags.exitDoorUnlocked).toBe(true);
    expect(state.flags.overlaySolved).toBe(true);
    expect(state.puzzleStates.overlayPaper.paperOffsetX).toBe(160);
    expect(state.puzzleStates.overlayPaper.paperOffsetY).toBe(-160);
    expect(state.puzzleStates.overlayPaper.rotation).toBe(45);
    expect(state.puzzleStates.typewriter.input).toHaveLength(16);
    expect(state.notebook.clues.map((clue) => clue.clueId)).toEqual(['sealed-letter']);
    expect(state.investigationLog.entries[0].targetId).toBe('exit-door');
    expect(state.viewedHints).toEqual({ 'diary-repair': 2 });
  });

  it('round trips serialized state through parser normalization', () => {
    const solved = applyPuzzleReward(createInitialStudyGameState(), 'typewriter').state;
    const restored = parseStudyState(serializeStudyState(solved));
    expect(restored.version).toBe(3);
    expect(restored.solvedPuzzles).toEqual(['typewriter']);
    expect(restored.collectedItems).toEqual(['typed-paper']);
    expect(restored.flags.typewriterSolved).toBe(true);
    expect(restored.flags.exitDoorUnlocked).toBe(false);
  });

  it('falls back to a playable initial state for broken save values', () => {
    expect(parseStudyState('{broken').currentScene).toBe('title');
    expect(normalizeStudyState(null).currentScene).toBe('title');
    expect(normalizeStudyState({ version: 999, currentScene: 'exit-door' }).currentScene).toBe('title');
  });

  it('evaluates conditions against React-owned game state', () => {
    const rewarded = applyPuzzleReward(createInitialStudyGameState(), 'diary-repair').state;
    expect(evaluateCondition({ type: 'puzzle-solved', puzzleId: 'diary-repair' }, rewarded)).toBe(true);
    expect(evaluateCondition({ type: 'flag', flagId: 'diaryRestored', value: true }, rewarded)).toBe(true);
    expect(evaluateConditions([{ type: 'clue-discovered', clueId: 'diary-restored' }, { type: 'scene', sceneId: 'title' }], rewarded)).toBe(true);
  });

  it('applies puzzle rewards once', () => {
    const first = applyPuzzleReward(createInitialStudyGameState(), 'overlay-paper');
    const second = applyPuzzleReward(first.state, 'overlay-paper');
    expect(first.changed).toBe(true);
    expect(second.changed).toBe(false);
    expect(second.state.solvedPuzzles).toEqual(['overlay-paper']);
    expect(second.state.collectedItems).toEqual(['overlay-clue']);
    expect(second.state.notebook.clues.map((clue) => clue.clueId)).toEqual(['overlay-result']);
  });

  it('connects the main puzzle reward chain through the study key', () => {
    const diary = applyPuzzleReward(createInitialStudyGameState(), 'diary-repair').state;
    const globe = applyPuzzleReward(diary, 'globe').state;
    const typewriter = applyPuzzleReward(globe, 'typewriter').state;
    const overlay = applyPuzzleReward(typewriter, 'overlay-paper').state;
    const bookshelf = applyPuzzleReward(overlay, 'bookshelf').state;
    const portrait = applyPuzzleReward(bookshelf, 'portrait-time').state;
    const duplicatePortrait = applyPuzzleReward(portrait, 'portrait-time').state;

    expect(portrait.solvedPuzzles).toEqual(['diary-repair', 'globe', 'typewriter', 'overlay-paper', 'bookshelf', 'portrait-time']);
    expect(portrait.collectedItems).toEqual(['typed-paper', 'overlay-clue', 'study-key']);
    expect(portrait.flags.studyKeyFound).toBe(true);
    expect(portrait.flags.finalTimeSolved).toBe(true);
    expect(duplicatePortrait.collectedItems).toEqual(portrait.collectedItems);
  });
});
