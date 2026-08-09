import type { QuarterRotation } from '../../../engine/phaser/types';
import { canSnapPiece } from '../../../engine/phaser/interactions/snap';
import { isOverlayAligned as isOverlayAlignedBase } from '../../../engine/phaser/interactions/overlay';
import { isCorrectOrder } from '../../../engine/phaser/interactions/reorder';
import { isRotationAligned } from '../../../engine/phaser/utils/rotation';

export const diaryPageOrder = ['spring', 'summer', 'autumn', 'winter'] as const;
export const initialDiaryPageOrder = ['autumn', 'spring', 'winter', 'summer'];

export const DIARY_PIECES = [
  { id: 'spring', itemId: 'diary-piece-01', targetX: 210, targetY: 348, targetRotation: 0 },
  { id: 'summer', itemId: 'diary-piece-02', targetX: 360, targetY: 348, targetRotation: 90 },
  { id: 'autumn', itemId: 'diary-piece-03', targetX: 510, targetY: 348, targetRotation: 0 },
] as const;

export type DiaryPieceId = (typeof DIARY_PIECES)[number]['id'];

export const GLOBE_DIRECTION_SEQUENCE = [
  { direction: 'north', count: 2 },
  { direction: 'east', count: 1 },
  { direction: 'south', count: 3 },
  { direction: 'west', count: 1 },
] as const;

export const globeDirectionAnswer = expandGlobeSequence(GLOBE_DIRECTION_SEQUENCE);
export const memoryRouteAnswer = globeDirectionAnswer;

export const CIPHER_SHIFT = 8;
export const TYPEWRITER_ANSWER = 'MEMORY';
export const typewriterAnswer = TYPEWRITER_ANSWER;
export const TYPEWRITER_ENCODED_TEXT = encodeCipher(TYPEWRITER_ANSWER, CIPHER_SHIFT);

export const OVERLAY_TARGET = {
  x: 0,
  y: 0,
  rotation: 0,
  positionTolerance: 12,
  rotationTolerance: 8,
};

export const BOOK_CLUE = {
  bookNumber: 7,
  bookId: 'book-07',
  page: 23,
  phrase: '肖像画の時刻は、七時十五分。忘れても、帰れる。',
};

export const FINAL_TIME = {
  hour: 7,
  minute: 15,
};

export function isCorrectDiaryOrder(pageOrder: readonly string[]) {
  return isCorrectOrder(pageOrder, diaryPageOrder);
}

export function isDiaryPieceCorrect(piece: { x: number; y: number; rotation: number }, target: (typeof DIARY_PIECES)[number]) {
  return canSnapPiece({
    currentPosition: { x: piece.x, y: piece.y },
    targetPosition: { x: target.targetX, y: target.targetY },
    positionTolerance: 34,
    currentRotation: piece.rotation,
    targetRotation: target.targetRotation,
    rotationTolerance: 1,
  });
}

export function isDiaryComplete(pieces: Record<string, { x: number; y: number; rotation: number; placed: boolean }>) {
  return DIARY_PIECES.every((target) => {
    const piece = pieces[target.id];
    return piece && piece.placed && isDiaryPieceCorrect(piece, target);
  });
}

export function expandGlobeSequence(sequence: readonly { direction: string; count: number }[]) {
  return sequence.flatMap((entry) => Array.from({ length: entry.count }, () => entry.direction));
}

export function isGlobeSequenceCorrect(routeIds: readonly string[]) {
  return isCorrectOrder(routeIds, globeDirectionAnswer);
}

export function isCorrectMemoryRoute(routeIds: readonly string[]) {
  return isGlobeSequenceCorrect(routeIds);
}

export function encodeCipher(text: string, shift: number) {
  return text.toUpperCase().replace(/[A-Z]/g, (char) => {
    const code = char.charCodeAt(0) - 65;
    return String.fromCharCode(((code + shift) % 26) + 65);
  });
}

export function decodeCipher(text: string, shift: number) {
  return encodeCipher(text, 26 - (shift % 26));
}

export function isTypewriterAnswerCorrect(input: string) {
  return input.trim().toUpperCase() === TYPEWRITER_ANSWER;
}

export function isCorrectTypewriterCode(input: string) {
  return isTypewriterAnswerCorrect(input);
}

export function isOverlayAligned(x: number, y: number, rotation: number) {
  return isOverlayAlignedBase({
    currentPosition: { x, y },
    targetPosition: { x: OVERLAY_TARGET.x, y: OVERLAY_TARGET.y },
    positionTolerance: OVERLAY_TARGET.positionTolerance,
    currentRotation: rotation,
    targetRotation: OVERLAY_TARGET.rotation,
    rotationTolerance: OVERLAY_TARGET.rotationTolerance,
  });
}

export function isPaperAligned(offsetX: number, offsetY: number, rotation: number) {
  return isOverlayAligned(offsetX, offsetY, rotation);
}

export function resolveBookId(bookNumber: number) {
  return `book-${String(bookNumber).padStart(2, '0')}`;
}

export function isCorrectBook(bookId: string | null) {
  return bookId === BOOK_CLUE.bookId;
}

export function isCorrectPage(page: number | null) {
  return page === BOOK_CLUE.page;
}

export function isCorrectFinalTime(hour: number | null, minute: number | null) {
  return hour === FINAL_TIME.hour && minute === FINAL_TIME.minute;
}

export function normalizeFinalMinute(value: number): number {
  return Math.max(0, Math.min(59, Math.round(value)));
}

export function normalizeFinalHour(value: number): number {
  return Math.max(0, Math.min(23, Math.round(value)));
}

export function coerceQuarterRotation(value: number): QuarterRotation {
  if (isRotationAligned(value, 0, 1)) return 0;
  if (isRotationAligned(value, 90, 1)) return 90;
  if (isRotationAligned(value, 180, 1)) return 180;
  return 270;
}
