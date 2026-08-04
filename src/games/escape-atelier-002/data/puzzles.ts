export const flowerColorAnswer = ['blue', 'white', 'red', 'yellow'] as const;

export const flowerColors = [
  { id: 'blue', name: '青', symbol: '雫', color: '#6fa7d7' },
  { id: 'white', name: '白', symbol: '星', color: '#fff8e9' },
  { id: 'red', name: '赤', symbol: '実', color: '#c7675b' },
  { id: 'yellow', name: '黄', symbol: '月', color: '#e0b85d' },
] as const;

export const correctPotOrder = ['pot-short', 'pot-round', 'pot-long', 'pot-flower'] as const;
export const initialPotOrder = ['pot-round', 'pot-long', 'pot-short', 'pot-flower'] as const;

export const mirrorDefinitions = [
  { id: 'mirror-a', label: '左上の鏡', correctAngle: 45 },
  { id: 'mirror-b', label: '棚横の鏡', correctAngle: 135 },
  { id: 'mirror-c', label: '小さな鏡', correctAngle: 45 },
] as const;

export const initialMirrorAngles = Object.fromEntries(mirrorDefinitions.map((mirror) => [mirror.id, 0]));

export function isCorrectFlowerSequence(input: string[], answer: readonly string[] = flowerColorAnswer) {
  return input.length === answer.length && input.every((id, index) => id === answer[index]);
}

export function isCorrectPotOrder(currentOrder: string[], answer: readonly string[] = correctPotOrder) {
  return currentOrder.length === answer.length && currentOrder.every((id, index) => id === answer[index]);
}

export function areMirrorAnglesSolved(angles: Record<string, number>) {
  return mirrorDefinitions.every((mirror) => angles[mirror.id] === mirror.correctAngle);
}

export function mirrorHintText() {
  return mirrorDefinitions.map((mirror) => `${mirror.label}: ${mirror.correctAngle}度`).join(' / ');
}
