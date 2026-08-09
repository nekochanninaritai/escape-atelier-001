export const STUDY_SAVE_VERSION = 1;
export const STUDY_SAVE_KEY = 'escape-atelier-004-save';
export const DEBUG_STUDY_HOTSPOTS = import.meta.env.VITE_DEBUG_HOTSPOTS === 'true';

export const studyGameConfig = {
  seriesName: 'Escape Atelier',
  episode: '#004',
  title: '忘れられた書斎からの脱出',
  theme: '本・記憶',
  difficulty: '4 / 5',
  playTime: '40-60分',
  saveKey: STUDY_SAVE_KEY,
  saveVersion: STUDY_SAVE_VERSION,
  startScene: 'title',
  clearScene: 'ending',
  assets: {
    images: [
      'title-bg.webp',
      'study-main.webp',
      'study-bookshelf.webp',
      'study-desk.webp',
      'study-typewriter.webp',
      'study-fireplace.webp',
      'study-globe.webp',
      'study-portrait.webp',
      'study-side-table.webp',
      'study-door.webp',
      'ending-bg.webp',
    ],
    audio: [],
  },
} as const;
