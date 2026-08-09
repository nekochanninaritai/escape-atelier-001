import { studyItemImages } from './imageAssets';
import type { StudyItemId } from '../types';

export type StudyItemDefinition = {
  id: StudyItemId;
  name: string;
  description: string;
  image: string;
  alt: string;
};

export const studyItems: Record<StudyItemId, StudyItemDefinition> = {
  diaryPage: {
    id: 'diaryPage',
    name: '日記のページ',
    description: 'ところどころインクが薄れた日記のページ。順番を取り戻せば、書斎の記憶が少し戻りそうだ。',
    image: studyItemImages.diaryPage,
    alt: '古い日記のページ',
  },
  letterFragment: {
    id: 'letterFragment',
    name: '手紙の切れ端',
    description: '署名だけが残った手紙の断片。暖炉の灰の中から見つかった。',
    image: studyItemImages.letterFragment,
    alt: '手紙の切れ端',
  },
  inkRibbon: {
    id: 'inkRibbon',
    name: 'インクリボン',
    description: '乾きかけたタイプライター用のリボン。まだ少しだけ文字を打てそうだ。',
    image: studyItemImages.inkRibbon,
    alt: '古いインクリボン',
  },
  transparentPaper: {
    id: 'transparentPaper',
    name: '半透明の紙',
    description: '薄い紙に、赤い線と小さなしるしが描かれている。何かに重ねるためのものらしい。',
    image: studyItemImages.transparentPaper,
    alt: '半透明の紙',
  },
  memoryKey: {
    id: 'memoryKey',
    name: '記憶の鍵',
    description: '真鍮の小さな鍵。持つと、誰かが大切にしていた本の匂いがする。',
    image: studyItemImages.memoryKey,
    alt: '真鍮の鍵',
  },
};
