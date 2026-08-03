import type { ItemDefinition } from '../types/game';
import { imageAssets } from './imageAssets';

export const items: Record<string, ItemDefinition> = {
  sheetPiece1: {
    id: 'sheetPiece1',
    name: '楽譜の切れ端 A',
    description: '左上に月のしるしが描かれた楽譜の切れ端。',
    image: imageAssets.items.sheetPiece01,
    alt: '古びた楽譜の左側の切れ端',
  },
  sheetPiece2: {
    id: 'sheetPiece2',
    name: '楽譜の切れ端 B',
    description: '中央に小さな時計の絵がある楽譜の切れ端。',
    image: imageAssets.items.sheetPiece02,
    alt: '古びた楽譜の中央の切れ端',
  },
  sheetPiece3: {
    id: 'sheetPiece3',
    name: '楽譜の切れ端 C',
    description: '右下に扉の絵がある楽譜の切れ端。',
    image: imageAssets.items.sheetPiece03,
    alt: '古びた楽譜の右側の切れ端',
  },
  windingKey: {
    id: 'windingKey',
    name: 'オルゴールのゼンマイ',
    description: '真鍮色の小さなゼンマイ。オルゴールに合いそうだ。',
    image: imageAssets.items.windingKey,
    alt: 'アンティークゴールドの小さなオルゴール用ゼンマイ',
    usedDescription: 'オルゴールを動かすために使った。',
  },
  completedSheet: {
    id: 'completedSheet',
    name: '完成した楽譜',
    description: '欠けていた音が書き足された楽譜。短い旋律が読める。',
    image: imageAssets.items.completedSheet,
    alt: '完成した古い楽譜',
  },
  doorKey: {
    id: 'doorKey',
    name: '古い鍵',
    description: '出口の扉に合いそうな古い鍵。',
    image: imageAssets.items.doorKey,
    alt: '重厚なアンティークゴールドの古い鍵',
  },
};
