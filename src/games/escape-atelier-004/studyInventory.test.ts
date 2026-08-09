import { describe, expect, it } from 'vitest';
import { studyInitialState } from './state/initialState';
import { studyReducer } from './state/reducer';

describe('Escape Atelier #004 inventory state', () => {
  it('prevents duplicate rewards', () => {
    const once = studyReducer(studyInitialState, { type: 'ACQUIRE_ITEM', itemId: 'paper-knife' });
    const twice = studyReducer(once, { type: 'ACQUIRE_ITEM', itemId: 'paper-knife' });
    expect(twice.inventory.map((item) => item.itemId)).toEqual(['paper-knife']);
    expect(twice.collectedItems).toEqual(['paper-knife']);
  });

  it('uses fireplace rules to transform a sealed letter', () => {
    const withLetter = studyReducer(studyInitialState, { type: 'ACQUIRE_ITEM', itemId: 'sealed-letter' });
    const heated = studyReducer(withLetter, { type: 'USE_ITEM_ON_TARGET', itemId: 'sealed-letter', targetId: 'fireplace' });
    const heatedAgain = studyReducer(heated, { type: 'USE_ITEM_ON_TARGET', itemId: 'sealed-letter', targetId: 'fireplace' });
    expect(heated.inventory.map((item) => item.itemId)).toEqual(['heated-letter']);
    expect(heated.flags.letterHeated).toBe(true);
    expect(heated.completedUseRules).toEqual(['warm-sealed-letter']);
    expect(heatedAgain.inventory.map((item) => item.itemId)).toEqual(['heated-letter']);
  });

  it('combines heated letter and paper knife in either order', () => {
    const withLetter = studyReducer(studyInitialState, { type: 'ACQUIRE_ITEM', itemId: 'heated-letter' });
    const withKnife = studyReducer(withLetter, { type: 'ACQUIRE_ITEM', itemId: 'paper-knife' });
    const opened = studyReducer(withKnife, { type: 'COMBINE_ITEMS', firstItemId: 'paper-knife', secondItemId: 'heated-letter' });
    const duplicate = studyReducer(opened, { type: 'COMBINE_ITEMS', firstItemId: 'paper-knife', secondItemId: 'opened-letter' });
    expect(opened.inventory.map((item) => item.itemId)).toEqual(['paper-knife', 'opened-letter']);
    expect(opened.flags.letterOpened).toBe(true);
    expect(opened.completedCombineRules).toEqual(['open-heated-letter']);
    expect(duplicate.inventory.map((item) => item.itemId)).toEqual(['paper-knife', 'opened-letter']);
  });

  it('clears selected item when the selected item is transformed', () => {
    const withLetter = studyReducer(studyInitialState, { type: 'ACQUIRE_ITEM', itemId: 'sealed-letter' });
    const selected = studyReducer(withLetter, { type: 'SELECT_ITEM', itemId: 'sealed-letter' });
    const heated = studyReducer(selected, { type: 'USE_ITEM_ON_TARGET', itemId: 'sealed-letter', targetId: 'fireplace' });
    expect(heated.selectedItemId).toBeNull();
  });

  it('discovers clues once and marks them read', () => {
    const discovered = studyReducer(studyInitialState, { type: 'DISCOVER_CLUE', clueId: 'opened-letter-directions' });
    const duplicated = studyReducer(discovered, { type: 'DISCOVER_CLUE', clueId: 'opened-letter-directions' });
    const read = studyReducer(duplicated, { type: 'MARK_CLUE_READ', clueId: 'opened-letter-directions' });
    expect(duplicated.notebook.clues).toHaveLength(1);
    expect(read.notebook.clues[0].isRead).toBe(true);
  });

  it('records investigation targets without duplicate target rows', () => {
    const once = studyReducer(studyInitialState, { type: 'RECORD_INVESTIGATION', targetId: 'bookshelf', message: 'Checked.' });
    const twice = studyReducer(once, { type: 'RECORD_INVESTIGATION', targetId: 'bookshelf', message: 'Checked again.' });
    expect(twice.investigationLog.entries).toHaveLength(1);
    expect(twice.investigationLog.entries[0].count).toBe(2);
    expect(twice.investigationLog.entries[0].latestMessage).toBe('Checked again.');
  });

  it('ignores invalid clue and investigation ids', () => {
    const clue = studyReducer(studyInitialState, { type: 'DISCOVER_CLUE', clueId: 'missing' });
    const log = studyReducer(studyInitialState, { type: 'RECORD_INVESTIGATION', targetId: 'missing' });
    expect(clue.notebook.clues).toEqual([]);
    expect(log.investigationLog.entries).toEqual([]);
  });
});
