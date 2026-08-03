import type { PuzzleDefinition } from '../types/game';

export const puzzles: Record<string, PuzzleDefinition> = {
  sheetOrder: {
    id: 'sheetOrder',
    title: '破れた楽譜',
    prompt: '切れ端を物語の流れになる順番で選んでください。',
    answer: ['sheetPiece1', 'sheetPiece2', 'sheetPiece3'],
    successMessage: '切れ端がぴたりと重なり、机の奥で小さな音がした。',
    failureMessage: '順番が違うようだ。絵柄の流れを見直してみよう。',
  },
  clockMusicBox: {
    id: 'clockMusicBox',
    title: '時計とオルゴール',
    prompt: 'オルゴールの記号を時計の数字に置き換えてください。',
    answer: ['3', '1', '4'],
    successMessage: '楽譜の空白に、淡い金色のインクで音が浮かび上がった。',
    failureMessage: 'その並びでは反応しない。時計盤の記号をもう一度見よう。',
  },
  pianoMelody: {
    id: 'pianoMelody',
    title: '夕暮れの旋律',
    prompt: '完成した楽譜の順に鍵盤を押してください。',
    answer: ['C', 'E', 'G', 'E', 'D'],
    successMessage: 'ピアノの奥で隠し引き出しが開いた。',
    failureMessage: '音が部屋に溶けて消えた。最初から弾き直そう。',
  },
};
