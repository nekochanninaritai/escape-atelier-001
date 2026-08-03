import type { PuzzleId } from '../types/game';

export const hints: Record<PuzzleId, string[]> = {
  sheetOrder: [
    '机、本棚、ピアノの周りを調べてみましょう。',
    '切れ端に描かれた小さな絵は、左から右へ時間が進むようです。',
    '月、時計、扉の順に並べます。',
  ],
  clockMusicBox: [
    '古時計と、ゼンマイを入れたオルゴールを見比べましょう。',
    'オルゴールの記号は時計盤の位置を示しています。',
    '答えは 314 です。',
  ],
  pianoMelody: [
    '完成した楽譜を詳しく見ましょう。',
    '書き足された音名を、そのままピアノで押します。',
    'C、E、G、E、D の順に押します。',
  ],
};
