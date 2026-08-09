export function addSelection<T>(selected: readonly T[], item: T, maxLength = Number.POSITIVE_INFINITY): T[] {
  if (selected.some((entry) => Object.is(entry, item)) || selected.length >= maxLength) return [...selected];
  return [...selected, item];
}

export function removeSelection<T>(selected: readonly T[], item: T): T[] {
  return selected.filter((entry) => !Object.is(entry, item));
}

export function toggleSelection<T>(selected: readonly T[], item: T, maxLength = Number.POSITIVE_INFINITY): T[] {
  return selected.some((entry) => Object.is(entry, item)) ? removeSelection(selected, item) : addSelection(selected, item, maxLength);
}

export function clearSelection<T>(): T[] {
  return [];
}
