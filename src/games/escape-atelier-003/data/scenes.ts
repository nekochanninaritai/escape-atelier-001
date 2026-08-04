import type { ObservatoryHotspot } from '../types';

export const lowerHotspots: ObservatoryHotspot[] = [
  { id: 'telescope', label: '大型望遠鏡', x: 15, y: 18, width: 31, height: 39, targetScene: 'telescope' },
  { id: 'celestial-globe', label: '天球儀', x: 68, y: 41, width: 23, height: 28, targetScene: 'celestial-globe' },
  { id: 'star-clock', label: '星時計', x: 42, y: 13, width: 18, height: 28, targetScene: 'star-clock' },
  { id: 'desk', label: '書き物机', x: 1, y: 55, width: 34, height: 35, targetScene: 'desk' },
  { id: 'constellation-wall', label: '星座図の壁', x: 68, y: 12, width: 27, height: 29, targetScene: 'constellation-wall' },
  { id: 'moon-model', label: '月の模型', x: 40, y: 61, width: 27, height: 21, targetScene: 'moon-model' },
  { id: 'staircase', label: '螺旋階段', x: 86, y: 7, width: 14, height: 73, targetScene: 'staircase' },
];

export const upperHotspots: ObservatoryHotspot[] = [
  { id: 'skylight', label: '天窓', x: 10, y: 0, width: 80, height: 27, targetScene: 'skylight' },
  { id: 'upper-telescope', label: '望遠鏡上部', x: 6, y: 24, width: 27, height: 36, targetScene: 'telescope' },
  { id: 'observation-window', label: '観測用の小窓', x: 77, y: 34, width: 18, height: 18, targetScene: 'constellation-wall' },
  { id: 'upper-clock', label: '星時計の上部機構', x: 41, y: 29, width: 19, height: 25, targetScene: 'star-clock' },
  { id: 'stairs-down', label: '下階へ戻る螺旋階段', x: 75, y: 55, width: 22, height: 34, targetScene: 'staircase' },
];

export const sceneCopy = {
  telescope: { title: '大型望遠鏡', description: '真鍮の筒は夜空を向いている。接眼部には小さなレンズが一枚足りない。' },
  'celestial-globe': { title: '天球儀', description: '銀の星が散った天球儀。中央に星座盤を差し込む溝がある。' },
  'star-clock': { title: '星時計', description: '止まった時計盤。内部では歯車が一つ欠けている。' },
  desk: { title: '書き物机', description: '古い日記には「月は欠けた闇から、細く、半ば、満ちた光へ」と記されている。' },
  'constellation-wall': { title: '星座図の壁', description: '星座図にはリラ、はくちょう、わしの名が淡く残っている。' },
  'moon-model': { title: '月の模型', description: '四つの月相を並べ替えられる模型だ。' },
  staircase: { title: '螺旋階段', description: '古い鉄の階段が、天文台の上階へ続いている。' },
  skylight: { title: '天窓', description: '閉ざされた天窓。装置には夜明けの時刻を示す小さな入力盤がある。' },
} as const;
