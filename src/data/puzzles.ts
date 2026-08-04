import type { PuzzleDefinition } from '../types/game';

export const puzzles: Record<string, PuzzleDefinition> = {
  sheetOrder: {
    id: 'sheetOrder',
    title: '破れた紙',
    prompt: '切れ端をつなぎ、一枚の紙にしましょう。',
    answer: ['sheetPiece1', 'sheetPiece2', 'sheetPiece3'],
    successMessage: '3枚の切れ端がぴったりとつながり、一枚の紙になった。',
    failureMessage: 'まだ一部が欠けている。ほかにも切れ端がありそうだ。',
  },
  clockMusicBox: {
    id: 'clockMusicBox',
    title: '時計とオルゴール',
    prompt: 'オルゴールの記号を時計の数字に置き換えてください。',
    answer: ['3', '1', '4'],
    successMessage: '楽譜に薄い金色の印が浮かび上がった。完成した楽譜を手に入れた。',
    failureMessage: 'その並びでは反応しない。時計盤の記号をもう一度見よう。',
  },
  pianoMelody: {
    id: 'pianoMelody',
    title: '夕暮れの旋律',
    prompt: '完成した楽譜の音符を左から読み、同じ順番で鍵盤を押してください。',
    answer: ['C', 'E', 'G', 'E', 'D'],
    successMessage: 'ピアノの奥で隠し引き出しが開いた。',
    failureMessage: '音が部屋に溶けて消えた。最初から弾き直そう。',
  },
};
