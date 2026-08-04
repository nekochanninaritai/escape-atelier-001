import type { Hotspot } from '../types/game';

export const roomHotspots: Hotspot[] = [
  { id: 'piano', label: 'ピアノ', x: 0, y: 51, width: 47, height: 22, targetScene: 'piano' },
  { id: 'bookshelf', label: '本棚', x: 51, y: 27, width: 27, height: 34, targetScene: 'bookshelf' },
  { id: 'clock', label: '古時計', x: 36.5, y: 25.5, width: 12, height: 24.5, targetScene: 'clock' },
  { id: 'desk', label: '机', x: 47, y: 62.5, width: 41, height: 16, targetScene: 'desk' },
  { id: 'musicBox', label: 'オルゴール', x: 79.5, y: 56, width: 13, height: 5.5, targetScene: 'musicBox' },
  { id: 'door', label: '出口の扉', x: 84, y: 28, width: 14, height: 27, targetScene: 'door' },
  { id: 'globe', label: '地球儀', x: 58.5, y: 45.8, width: 11.5, height: 9.2, targetScene: 'globe' },
];
