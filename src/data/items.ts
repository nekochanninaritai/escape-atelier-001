import type { ItemDefinition } from '../types/game';

export const items: Record<string, ItemDefinition> = {
  sheetPiece1: {
    id: 'sheetPiece1',
    name: '楽譜の切れ端 A',
    description: '左上に月のしるしが描かれた楽譜の切れ端。',
    image: 'item-sheet-piece-01.webp',
  },
  sheetPiece2: {
    id: 'sheetPiece2',
    name: '楽譜の切れ端 B',
    description: '中央に小さな時計の絵がある楽譜の切れ端。',
    image: 'item-sheet-piece-02.webp',
  },
  sheetPiece3: {
    id: 'sheetPiece3',
    name: '楽譜の切れ端 C',
    description: '右下に扉の絵がある楽譜の切れ端。',
    image: 'item-sheet-piece-03.webp',
  },
  windingKey: {
    id: 'windingKey',
    name: 'オルゴールのゼンマイ',
    description: '真鍮色の小さなゼンマイ。オルゴールに合いそうだ。',
    image: 'item-winding-key.webp',
    usedDescription: 'オルゴールを動かすために使った。',
  },
  completedSheet: {
    id: 'completedSheet',
    name: '完成した楽譜',
    description: '欠けていた音が書き足された楽譜。短い旋律が読める。',
    image: 'item-completed-sheet.webp',
  },
  doorKey: {
    id: 'doorKey',
    name: '古い鍵',
    description: '出口の扉に合いそうな古い鍵。',
    image: 'item-door-key.webp',
  },
};
