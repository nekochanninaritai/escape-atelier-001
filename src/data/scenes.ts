import type { Hotspot } from '../types/game';

export const roomHotspots: Hotspot[] = [
  { id: 'piano', label: 'ピアノ', x: 8, y: 46, width: 39, height: 26, targetScene: 'piano' },
  { id: 'bookshelf', label: '本棚', x: 57, y: 18, width: 27, height: 35, targetScene: 'bookshelf' },
  { id: 'clock', label: '古時計', x: 43, y: 19, width: 13, height: 40, targetScene: 'clock' },
  { id: 'desk', label: '机', x: 52, y: 61, width: 29, height: 18, targetScene: 'desk' },
  { id: 'musicBox', label: 'オルゴール', x: 64, y: 54, width: 17, height: 10, targetScene: 'musicBox' },
  { id: 'door', label: '出口の扉', x: 84, y: 22, width: 13, height: 54, targetScene: 'door' },
];
