import type { ObservatoryHotspot } from '../types';

export const lowerHotspots: ObservatoryHotspot[] = [
  { id: 'telescope', label: '大型望遠鏡', x: 8, y: 23, width: 28, height: 33, targetScene: 'telescope' },
  { id: 'celestial-globe', label: '天球儀', x: 58, y: 32, width: 25, height: 24, targetScene: 'celestial-globe' },
  { id: 'star-clock', label: '星時計', x: 38, y: 15, width: 20, height: 28, targetScene: 'star-clock' },
  { id: 'desk', label: '書き物机', x: 8, y: 62, width: 28, height: 24, targetScene: 'desk' },
  { id: 'constellation-wall', label: '星座図の壁', x: 66, y: 8, width: 25, height: 22, targetScene: 'constellation-wall' },
  { id: 'moon-model', label: '月の模型', x: 41, y: 56, width: 23, height: 22, targetScene: 'moon-model' },
  { id: 'staircase', label: '螺旋階段', x: 72, y: 56, width: 24, height: 34, targetScene: 'staircase' },
];

export const upperHotspots: ObservatoryHotspot[] = [
  { id: 'skylight', label: '天窓', x: 28, y: 8, width: 42, height: 28, targetScene: 'skylight' },
  { id: 'upper-telescope', label: '望遠鏡上部', x: 8, y: 38, width: 30, height: 24, targetScene: 'telescope' },
  { id: 'observation-window', label: '観測用の小窓', x: 62, y: 38, width: 26, height: 22, targetScene: 'constellation-wall' },
  { id: 'upper-clock', label: '星時計の上部機構', x: 39, y: 41, width: 21, height: 20, targetScene: 'star-clock' },
  { id: 'stairs-down', label: '下階へ戻る螺旋階段', x: 68, y: 65, width: 27, height: 26, targetScene: 'staircase' },
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
