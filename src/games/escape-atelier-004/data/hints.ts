import { BOOK_CLUE, FINAL_TIME, TYPEWRITER_ENCODED_TEXT } from './puzzles';
import type { StudyPuzzleId } from '../types';

export const studyHints: Record<StudyPuzzleId, readonly string[]> = {
  'diary-repair': [
    '日記の破れたページを3枚集めてから、本棚で復元する。',
    '紙片はドラッグで動かし、タップで90度ずつ回転できる。',
    '左から春、夏、秋の流れにそろえる。',
  ],
  globe: [
    '開封した手紙に方角と回数が書かれている。',
    'N 2 は north を2回入力するという意味。',
    'N N E S S S W の順に地球儀へ入力する。',
  ],
  typewriter: [
    `暗号表の端にある ${TYPEWRITER_ENCODED_TEXT} を読む。`,
    '暗号表は文字を8つ戻す換字表。',
    'MEMORY と入力する。',
  ],
  'overlay-paper': [
    'タイプライターの紙と半透明の紙が必要。',
    '赤い線が欠けた文字の上に重なる位置を探す。',
    '中央付近で傾きをほぼ戻すと BOOK/PAGE が読める。',
  ],
  bookshelf: [
    `重なった手掛かりは BOOK ${BOOK_CLUE.bookNumber} / PAGE ${BOOK_CLUE.page}。`,
    '本棚で7番の本を選び、23ページを開く。',
    '開いたページの文は肖像画の時刻を示す。',
  ],
  'portrait-time': [
    '本棚のページに「七時十五分」とある。',
    '肖像画の裏の時刻をその時間に合わせる。',
    `${String(FINAL_TIME.hour).padStart(2, '0')}:${String(FINAL_TIME.minute).padStart(2, '0')} に合わせる。`,
  ],
};
