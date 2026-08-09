export const diaryPageOrder = ['spring', 'summer', 'autumn', 'winter'] as const;
export const memoryRouteAnswer = ['library', 'garden', 'observatory', 'study'] as const;
export const typewriterAnswer = 'REMEMBER';

export const initialDiaryPageOrder = ['autumn', 'spring', 'winter', 'summer'];

export function isCorrectDiaryOrder(pageOrder: readonly string[]) {
  return pageOrder.length === diaryPageOrder.length && pageOrder.every((id, index) => id === diaryPageOrder[index]);
}

export function isCorrectMemoryRoute(routeIds: readonly string[]) {
  return routeIds.length === memoryRouteAnswer.length && routeIds.every((id, index) => id === memoryRouteAnswer[index]);
}

export function isPaperAligned(offsetX: number, offsetY: number, rotation: number) {
  return Math.abs(offsetX) <= 12 && Math.abs(offsetY) <= 12 && Math.abs(rotation) <= 8;
}

export function isCorrectTypewriterCode(input: string) {
  return input.trim().toUpperCase() === typewriterAnswer;
}
