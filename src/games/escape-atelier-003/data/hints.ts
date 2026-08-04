import { dawnTimeAnswer, correctGlobePosition } from './puzzles';
import type { ObservatoryPuzzleId } from '../types';

export const observatoryHints: Record<ObservatoryPuzzleId, readonly string[]> = {
  constellationPlate: ['星座盤の破片をすべて探そう。', '机、星座図、螺旋階段の周辺を調べよう。', '破片は位置だけでなく、90度単位の向きも合わせよう。'],
  moonPhases: ['机の日記と月の模型を見比べよう。', '月が満ちていく順番を考えよう。', '新月、三日月、半月、満月の順番。'],
  celestialGlobe: ['修復した星座盤に描かれた星を確認しよう。', '月の位置と星座の向きを、日記の記録へ合わせよう。', `天球儀を ${correctGlobePosition} の位置へ合わせよう。`],
  telescope: ['少し明るく瞬く星を探そう。', '星座盤に記された3つの星を観測しよう。', 'リラは左上、はくちょうは中央右、わしは右上にある。'],
  constellationLines: ['星の記録紙にある順番を確認しよう。', '観測した星を、記録された順に選ぼう。', 'リラ、はくちょう、わしの順番で結ぼう。'],
  dawnTime: ['動き出した星時計を確認しよう。', '星時計が示す夜明けの時刻を、天窓へ入力しよう。', `${dawnTimeAnswer}。`],
};
