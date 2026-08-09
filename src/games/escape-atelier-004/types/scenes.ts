export const STUDY_SCENE_IDS = [
  'title',
  'prologue',
  'study-main',
  'bookshelf',
  'bookshelf-left',
  'bookshelf-center',
  'bookshelf-right',
  'desk',
  'typewriter',
  'fireplace',
  'globe',
  'portrait',
  'side-table',
  'exit-door',
  'ending',
] as const;

export type StudySceneId = (typeof STUDY_SCENE_IDS)[number];

export type StudySceneDefinition = {
  id: StudySceneId;
  title?: string;
  imageKey?: string;
  backgroundAlt?: string;
  parentSceneId?: StudySceneId;
  hotspots?: HotspotDefinition[];
};

export type HotspotAction =
  | { type: 'show-message'; messageId: string }
  | { type: 'goto-scene'; sceneId: StudySceneId }
  | { type: 'acquire-item'; itemId: string }
  | { type: 'use-selected-item'; targetId: string }
  | { type: 'discover-clue'; clueId: string }
  | { type: 'record-investigation'; targetId: string }
  | { type: 'open-puzzle'; puzzleId: string }
  | { type: 'set-flag'; flagId: string; value: boolean };

export type HotspotDefinition = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  targetScene?: StudySceneId;
  clueIdOnInspect?: string;
  actions?: HotspotAction[];
};

export type StudyHotspot = HotspotDefinition;

const LEGACY_SCENE_ALIASES: Record<string, StudySceneId> = {
  study: 'study-main',
  door: 'exit-door',
};

export function normalizeStudySceneId(value: unknown, fallback: StudySceneId = 'title'): StudySceneId {
  if (typeof value !== 'string') return fallback;
  if (STUDY_SCENE_IDS.includes(value as StudySceneId)) return value as StudySceneId;
  return LEGACY_SCENE_ALIASES[value] ?? fallback;
}

