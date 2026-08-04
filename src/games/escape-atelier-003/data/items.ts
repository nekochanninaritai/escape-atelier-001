import { observatoryItemImages } from './imageAssets';
import type { ObservatoryItemId } from '../types';

export const observatoryItems: Record<ObservatoryItemId, { name: string; description: string; image: string }> = {
  platePiece1: { name: '星座盤の破片1', description: '真鍮の円盤の一部。机の下で見つけた。', image: observatoryItemImages.platePiece1 },
  platePiece2: { name: '星座盤の破片2', description: '銀の星が刻まれた破片。', image: observatoryItemImages.platePiece2 },
  platePiece3: { name: '星座盤の破片3', description: '螺旋階段の踊り場に落ちていた破片。', image: observatoryItemImages.platePiece3 },
  constellationPlate: { name: '修復した星座盤', description: '三つの破片が揃い、星の道筋が読める。', image: observatoryItemImages.constellationPlate },
  brassGear: { name: '真鍮の歯車', description: '星時計に合いそうな重い歯車。', image: observatoryItemImages.brassGear },
  smallLens: { name: '小さなレンズ', description: '望遠鏡の欠けた光学部品。', image: observatoryItemImages.smallLens },
  starRecord: { name: '星の記録紙', description: '観測した三つの星が順番に記されている。', image: observatoryItemImages.starRecord },
  dawnKey: { name: '夜明けの鍵', description: '星形の鍵穴に合う、淡く温かい鍵。', image: observatoryItemImages.dawnKey },
};
