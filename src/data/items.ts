import type { ItemDefinition } from '../types/game';
import { imageAssets } from './imageAssets';

export const items: Record<string, ItemDefinition> = {
  sheetPiece1: {
    id: 'sheetPiece1',
    name: '楽譜の切れ端A',
    description: '五線譜の一部が描かれている。ほかの切れ端とつながりそうだ。',
    image: imageAssets.items.sheetPiece01,
    alt: '古びた紙の左側の切れ端',
  },
  sheetPiece2: {
    id: 'sheetPiece2',
    name: '楽譜の切れ端B',
    description: '五線譜の一部が描かれている。ほかの切れ端とつながりそうだ。',
    image: imageAssets.items.sheetPiece02,
    alt: '古びた紙の中央の切れ端',
  },
  sheetPiece3: {
    id: 'sheetPiece3',
    name: '楽譜の切れ端C',
    description: '五線譜の一部が描かれている。ほかの切れ端とつながりそうだ。',
    image: imageAssets.items.sheetPiece03,
    alt: '古びた紙の右側の切れ端',
  },
  combinedPaper: {
    id: 'combinedPaper',
    name: 'つなぎ合わせた紙',
    description: '3枚の切れ端が一枚につながっている。裏側も確認できそうだ。',
    image: imageAssets.items.combinedPaperFront,
    alt: '3枚の切れ端をつなぎ合わせた古い紙',
  },
  windingKey: {
    id: 'windingKey',
    name: 'ゼンマイ',
    description: '真鍮色の小さなゼンマイ。オルゴールに合いそうだ。',
    image: imageAssets.items.windingKey,
    alt: 'アンティークゴールドの小さなオルゴール用ゼンマイ',
    usedDescription: 'オルゴールを動かすために使った。',
  },
  completedSheet: {
    id: 'completedSheet',
    name: '完成した楽譜',
    description: '音符が左から順番に並んでいる。ピアノで演奏できそうだ。',
    image: imageAssets.items.completedSheet,
    alt: '五線譜に音符が左から順番に並んだ完成した楽譜',
  },
  doorKey: {
    id: 'doorKey',
    name: '古い鍵',
    description: '出口の扉に合いそうな古い鍵。',
    image: imageAssets.items.doorKey,
    alt: '重厚なアンティークゴールドの古い鍵',
  },
};
