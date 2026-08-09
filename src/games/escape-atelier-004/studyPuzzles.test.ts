import { describe, expect, it } from 'vitest';
import {
  BOOK_CLUE,
  CIPHER_SHIFT,
  DIARY_PIECES,
  TYPEWRITER_ANSWER,
  TYPEWRITER_ENCODED_TEXT,
  decodeCipher,
  encodeCipher,
  expandGlobeSequence,
  GLOBE_DIRECTION_SEQUENCE,
  isCorrectBook,
  isCorrectFinalTime,
  isCorrectPage,
  isDiaryComplete,
  isGlobeSequenceCorrect,
  isOverlayAligned,
  isTypewriterAnswerCorrect,
  resolveBookId,
} from './data/puzzles';

describe('Escape Atelier #004 puzzle logic', () => {
  it('checks diary piece placement and completion', () => {
    const pieces = Object.fromEntries(
      DIARY_PIECES.map((piece) => [
        piece.id,
        { x: piece.targetX, y: piece.targetY, rotation: piece.targetRotation, placed: true },
      ]),
    );
    expect(isDiaryComplete(pieces)).toBe(true);
    expect(isDiaryComplete({ ...pieces, spring: { ...pieces.spring, rotation: 90 } })).toBe(false);
  });

  it('expands and checks globe directions', () => {
    expect(expandGlobeSequence(GLOBE_DIRECTION_SEQUENCE)).toEqual(['north', 'north', 'east', 'south', 'south', 'south', 'west']);
    expect(isGlobeSequenceCorrect(['north', 'north', 'east', 'south', 'south', 'south', 'west'])).toBe(true);
    expect(isGlobeSequenceCorrect(['north', 'east', 'south', 'west'])).toBe(false);
  });

  it('encodes and decodes the typewriter answer', () => {
    expect(encodeCipher(TYPEWRITER_ANSWER, CIPHER_SHIFT)).toBe(TYPEWRITER_ENCODED_TEXT);
    expect(decodeCipher(TYPEWRITER_ENCODED_TEXT, CIPHER_SHIFT)).toBe(TYPEWRITER_ANSWER);
    expect(isTypewriterAnswerCorrect(' memory ')).toBe(true);
  });

  it('checks overlay alignment', () => {
    expect(isOverlayAligned(0, 0, 0)).toBe(true);
    expect(isOverlayAligned(24, 0, 0)).toBe(false);
    expect(isOverlayAligned(0, 0, 18)).toBe(false);
  });

  it('resolves the target book and page', () => {
    expect(resolveBookId(BOOK_CLUE.bookNumber)).toBe('book-07');
    expect(isCorrectBook('book-07')).toBe(true);
    expect(isCorrectBook('book-05')).toBe(false);
    expect(isCorrectPage(23)).toBe(true);
    expect(isCorrectPage(22)).toBe(false);
  });

  it('checks the final portrait time', () => {
    expect(isCorrectFinalTime(7, 15)).toBe(true);
    expect(isCorrectFinalTime(7, 10)).toBe(false);
    expect(isCorrectFinalTime(19, 15)).toBe(false);
  });
});
