import type { GreenhouseHotspot, GreenhouseSceneId } from '../types';

export const greenhouseHotspots: GreenhouseHotspot[] = [
  { id: 'tree', label: '中央の大樹', x: 29, y: 18, width: 35, height: 34, targetScene: 'tree' },
  { id: 'pots', label: '植木鉢棚', x: 3, y: 30, width: 26, height: 26, targetScene: 'pots' },
  { id: 'fountain', label: '噴水', x: 36, y: 55, width: 28, height: 18, targetScene: 'fountain' },
  { id: 'workbench', label: '作業机', x: 0, y: 68, width: 34, height: 23, targetScene: 'workbench' },
  { id: 'mirrorDevice', label: '鏡の装置', x: 68, y: 42, width: 27, height: 26, targetScene: 'mirrorDevice' },
  { id: 'door', label: 'ガラス扉', x: 70, y: 24, width: 23, height: 23, targetScene: 'door' },
  { id: 'statue', label: '蔦に覆われた石像', x: 69, y: 70, width: 28, height: 24, targetScene: 'statue' },
];

export const sceneCopy: Record<Exclude<GreenhouseSceneId, 'title' | 'prologue' | 'greenhouse' | 'ending'>, { title: string; description: string }> = {
  tree: { title: '中央の大樹', description: '夕暮れの光を失い、枝先の花は固く閉じている。' },
  pots: { title: '植木鉢棚', description: '大きさも葉の形も違う鉢が並ぶ棚。棚板には「芽から花へ」と書かれた古い成長記録が残っている。土はまだ柔らかい。' },
  fountain: { title: '噴水', description: '水面は静かだが、奥からかすかな水音が聞こえる。' },
  workbench: { title: '作業机', description: '園芸道具と古い陶器の欠片が散らばっている。' },
  mirrorDevice: { title: '鏡の装置', description: '真鍮の支柱が夕日の角度を待っている。' },
  door: { title: 'ガラス扉', description: '蝶の形をした鍵穴がある、重い温室の扉。' },
  statue: { title: '蔦に覆われた石像', description: '庭師のような石像。足元の蔦が何かを隠している。' },
};
