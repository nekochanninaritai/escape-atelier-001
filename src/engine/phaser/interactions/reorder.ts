export function moveArrayItem<T>(items: readonly T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex === toIndex) return [...items];
  if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length) return [...items];

  const next = [...items];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

export function isCorrectOrder<T>(currentOrder: readonly T[], answerOrder: readonly T[]): boolean {
  return currentOrder.length === answerOrder.length && currentOrder.every((item, index) => Object.is(item, answerOrder[index]));
}
