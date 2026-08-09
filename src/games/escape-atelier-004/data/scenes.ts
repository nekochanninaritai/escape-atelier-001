import type { StudyHotspot, StudySceneDefinition, StudySceneId } from '../types';

export const studyHotspots: StudyHotspot[] = [
  { id: 'bookshelf', label: '大きな本棚', x: 26, y: 13, width: 40, height: 60, targetScene: 'bookshelf' },
  { id: 'desk', label: '書斎机', x: 0, y: 54, width: 30, height: 39, targetScene: 'desk' },
  { id: 'typewriter', label: 'タイプライター', x: 3, y: 47, width: 18, height: 16, targetScene: 'typewriter' },
  { id: 'fireplace', label: '暖炉', x: 62, y: 45, width: 20, height: 36, targetScene: 'fireplace' },
  { id: 'globe', label: '地球儀', x: 22, y: 42, width: 14, height: 22, targetScene: 'globe' },
  { id: 'portrait', label: '肖像画', x: 66, y: 15, width: 18, height: 29, targetScene: 'portrait' },
  { id: 'side-table', label: 'サイドテーブル', x: 88, y: 59, width: 12, height: 35, targetScene: 'side-table' },
  { id: 'exit-door', label: '出口の扉', x: 83, y: 21, width: 15, height: 48, targetScene: 'exit-door' },
];

export const studySceneDefinitions: Record<StudySceneId, StudySceneDefinition> = {
  title: { id: 'title', title: 'タイトル', imageKey: 'title', backgroundAlt: '忘れられた書斎' },
  prologue: { id: 'prologue', title: 'プロローグ', imageKey: 'title', backgroundAlt: '忘れられた書斎' },
  'study-main': { id: 'study-main', title: '忘れられた書斎', imageKey: 'main', backgroundAlt: '忘れられた書斎', hotspots: studyHotspots },
  bookshelf: { id: 'bookshelf', title: '大きな本棚', imageKey: 'bookshelf', parentSceneId: 'study-main', backgroundAlt: '大きな本棚' },
  'bookshelf-left': { id: 'bookshelf-left', title: '本棚の左側', imageKey: 'bookshelf', parentSceneId: 'bookshelf', backgroundAlt: '本棚の左側' },
  'bookshelf-center': { id: 'bookshelf-center', title: '本棚の中央', imageKey: 'bookshelf', parentSceneId: 'bookshelf', backgroundAlt: '本棚の中央' },
  'bookshelf-right': { id: 'bookshelf-right', title: '本棚の右側', imageKey: 'bookshelf', parentSceneId: 'bookshelf', backgroundAlt: '本棚の右側' },
  desk: { id: 'desk', title: '書斎机', imageKey: 'desk', parentSceneId: 'study-main', backgroundAlt: '書斎机' },
  typewriter: { id: 'typewriter', title: 'タイプライター', imageKey: 'typewriter', parentSceneId: 'study-main', backgroundAlt: 'タイプライター' },
  fireplace: { id: 'fireplace', title: '暖炉', imageKey: 'fireplace', parentSceneId: 'study-main', backgroundAlt: '暖炉' },
  globe: { id: 'globe', title: '地球儀', imageKey: 'globe', parentSceneId: 'study-main', backgroundAlt: '地球儀' },
  portrait: { id: 'portrait', title: '肖像画', imageKey: 'portrait', parentSceneId: 'study-main', backgroundAlt: '肖像画' },
  'side-table': { id: 'side-table', title: 'サイドテーブル', imageKey: 'sideTable', parentSceneId: 'study-main', backgroundAlt: 'サイドテーブル' },
  'exit-door': { id: 'exit-door', title: '出口の扉', imageKey: 'door', parentSceneId: 'study-main', backgroundAlt: '出口の扉' },
  ending: { id: 'ending', title: 'エンディング', imageKey: 'ending', backgroundAlt: '忘れられた書斎' },
};

export const sceneCopy: Record<Exclude<StudySceneId, 'title' | 'prologue' | 'study-main' | 'ending' | 'bookshelf-left' | 'bookshelf-center' | 'bookshelf-right'>, { title: string; description: string }> = {
  bookshelf: {
    title: '大きな本棚',
    description: '革表紙の本が、赤からアイボリーへ少しずつ移ろうように並んでいる。何冊かだけ、抜き取られた跡がある。',
  },
  desk: {
    title: '書斎机',
    description: '真鍮のランプと封の切られた手紙が置かれている。引き出しには古い日記の跡が残っている。',
  },
  typewriter: {
    title: 'タイプライター',
    description: '黒いキーに指の跡が残っている。インクリボンを戻せば、最後に打たれた言葉をたどれるかもしれない。',
  },
  fireplace: {
    title: '暖炉',
    description: '火は消えているが、石はまだ柔らかく暖かい。燃やしきれなかった紙片が灰に見える。',
  },
  globe: {
    title: '地球儀',
    description: '古い航路が金色の線で描かれている。書斎の持ち主が何度もなぞった場所だけ、少し色が薄い。',
  },
  portrait: {
    title: '肖像画',
    description: '穏やかに笑う人物の肖像画。額縁の下に小さく「忘れても、帰れる」と刻まれている。',
  },
  'side-table': {
    title: 'サイドテーブル',
    description: 'アイボリーの便箋と赤い封蝋。小さな引き出しには薄い紙がしまわれている。',
  },
  'exit-door': {
    title: '出口の扉',
    description: '古い木の扉。鍵穴の周りだけ真鍮が明るく磨かれている。',
  },
};
