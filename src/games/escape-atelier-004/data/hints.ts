import type { StudyPuzzleId } from '../types';

export const studyHints: Record<StudyPuzzleId, readonly string[]> = {
  diaryRestore: [
    '日記は季節の記憶として並んでいる。',
    '肖像画の言葉は、春から冬へ戻る約束を示している。',
    '春、夏、秋、冬の順に日記を復元する。',
  ],
  memoryGlobe: [
    '地球儀の航路は、これまで巡った部屋の記憶とつながっている。',
    '音楽室、温室、天文台、書斎へ帰る流れを考える。',
    'library、garden、observatory、study の順に航路を選ぶ。',
  ],
  paperOverlay: [
    '半透明の紙は手紙に重ねる。',
    '赤い線が署名の下線と重なる位置を探す。',
    '中心に寄せ、傾きをほぼ戻すと文字が読める。',
  ],
  typewriterCode: [
    '復元した記憶は英単語としてタイプライターに残る。',
    '手紙と日記は「忘れないこと」より「思い出すこと」を示している。',
    'REMEMBER と入力する。',
  ],
};
