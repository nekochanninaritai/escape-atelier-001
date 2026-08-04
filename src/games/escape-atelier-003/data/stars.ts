export type StarTarget = {
  id: string;
  name: string;
  x: number;
  y: number;
  required: boolean;
  glowStrength: number;
};

export const telescopeStars: StarTarget[] = [
  { id: 'star-lyra', name: 'リラ', x: 230, y: 180, required: true, glowStrength: 1.1 },
  { id: 'star-cygnus', name: 'はくちょう', x: 430, y: 285, required: true, glowStrength: 1.08 },
  { id: 'star-aquila', name: 'わし', x: 560, y: 140, required: true, glowStrength: 1.12 },
  { id: 'star-orion', name: 'オリオン', x: 120, y: 330, required: false, glowStrength: 0.75 },
  { id: 'star-cassiopeia', name: 'カシオペヤ', x: 630, y: 380, required: false, glowStrength: 0.7 },
  { id: 'star-vega', name: 'ヴェガ', x: 360, y: 92, required: false, glowStrength: 0.72 },
];

export const requiredObservedStarIds = ['star-lyra', 'star-cygnus', 'star-aquila'] as const;
export const correctConstellationOrder = ['star-lyra', 'star-cygnus', 'star-aquila'];

export function isRequiredStar(starId: string): boolean {
  return requiredObservedStarIds.includes(starId as (typeof requiredObservedStarIds)[number]);
}

export function isCorrectConstellationOrder(selectedStarIds: string[], correctStarIds = correctConstellationOrder): boolean {
  return selectedStarIds.length === correctStarIds.length && selectedStarIds.every((starId, index) => starId === correctStarIds[index]);
}

export function addObservedStar(observedStarIds: string[], starId: string): string[] {
  if (!isRequiredStar(starId) || observedStarIds.includes(starId)) return observedStarIds;
  return [...observedStarIds, starId];
}
