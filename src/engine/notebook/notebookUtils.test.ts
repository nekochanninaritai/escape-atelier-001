import { describe, expect, it } from 'vitest';
import { discoverClue, getCluesByCategory, getCluesRelatedToPuzzle, getUnreadClueCount, markClueAsRead, normalizeNotebook, recordInvestigation } from './notebookUtils';
import type { ClueDefinition, InvestigationTargetDefinition } from './types';

const clues: Record<string, ClueDefinition> = {
  letter: { id: 'letter', title: 'Letter', summary: 'A letter.', category: 'document', relatedPuzzleIds: ['door'], sortOrder: 2 },
  code: { id: 'code', title: 'Code', summary: 'A code.', category: 'code', relatedPuzzleIds: ['door'], sortOrder: 1 },
};

const targets: Record<string, InvestigationTargetDefinition> = {
  desk: { id: 'desk', label: 'Desk' },
};

describe('notebook utilities', () => {
  it('discovers clues once and starts them unread', () => {
    const empty = normalizeNotebook([], [], clues, targets);
    const once = discoverClue(empty, clues, 'letter').data;
    const twice = discoverClue(once, clues, 'letter');
    expect(once.clues).toHaveLength(1);
    expect(once.clues[0].isRead).toBe(false);
    expect(twice.changed).toBe(false);
  });

  it('ignores invalid clue ids during normalization and read', () => {
    const data = normalizeNotebook([{ clueId: 'missing', isRead: true }, { clueId: 'letter', isRead: false }], [], clues, targets);
    const readMissing = markClueAsRead(data, 'missing');
    expect(data.clues.map((entry) => entry.clueId)).toEqual(['letter']);
    expect(readMissing.changed).toBe(false);
  });

  it('marks discovered clues read and counts unread clues', () => {
    const withLetter = discoverClue(normalizeNotebook([], [], clues), clues, 'letter').data;
    const withCode = discoverClue(withLetter, clues, 'code').data;
    const read = markClueAsRead(withCode, 'letter').data;
    expect(getUnreadClueCount(read)).toBe(1);
  });

  it('filters discovered clues by category and related puzzle', () => {
    const data = normalizeNotebook([{ clueId: 'letter', isRead: false }, { clueId: 'code', isRead: false }], [], clues);
    expect(getCluesByCategory(data, clues, 'code').map((entry) => entry.definition.id)).toEqual(['code']);
    expect(getCluesRelatedToPuzzle(data, clues, 'door').map((entry) => entry.definition.id)).toEqual(['code', 'letter']);
  });

  it('records investigation targets without accepting invalid targets', () => {
    const empty = normalizeNotebook([], [], clues, targets);
    const once = recordInvestigation(empty, targets, 'desk', 'Looked at desk.').data;
    const twice = recordInvestigation(once, targets, 'desk', 'Looked again.').data;
    const invalid = recordInvestigation(twice, targets, 'missing');
    expect(twice.investigationLog[0].count).toBe(2);
    expect(twice.investigationLog[0].latestMessage).toBe('Looked again.');
    expect(invalid.changed).toBe(false);
  });
});
