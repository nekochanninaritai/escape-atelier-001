import type { InvestigationTargetDefinition } from '../../../engine/notebook/types';

export const studyInvestigationTargets: Record<string, InvestigationTargetDefinition> = {
  bookshelf: { id: 'bookshelf', label: '大きな本棚', sceneId: 'bookshelf', category: 'location', clueIdOnInspect: 'selected-book' },
  desk: { id: 'desk', label: '書斎机', sceneId: 'desk', category: 'location' },
  typewriter: { id: 'typewriter', label: 'タイプライター', sceneId: 'typewriter', category: 'object' },
  fireplace: { id: 'fireplace', label: '暖炉', sceneId: 'fireplace', category: 'object' },
  globe: { id: 'globe', label: '地球儀', sceneId: 'globe', category: 'object' },
  portrait: { id: 'portrait', label: '肖像画', sceneId: 'portrait', category: 'observation', clueIdOnInspect: 'portrait-clock' },
  'side-table': { id: 'side-table', label: 'サイドテーブル', sceneId: 'side-table', category: 'object' },
  'exit-door': { id: 'exit-door', label: '出口の扉', sceneId: 'exit-door', category: 'location' },
  'diary-restore': { id: 'diary-restore', label: '日記復元', category: 'document', clueIdOnInspect: 'diary-restored' },
  'paper-overlay': { id: 'paper-overlay', label: '半透明紙の重ね合わせ', category: 'code', clueIdOnInspect: 'overlay-result' },
  bookshelfPuzzle: { id: 'bookshelfPuzzle', label: 'BOOK/PAGE の指定', sceneId: 'bookshelf', category: 'code', clueIdOnInspect: 'selected-book' },
  portraitTime: { id: 'portraitTime', label: '肖像画の時刻合わせ', sceneId: 'portrait', category: 'observation', clueIdOnInspect: 'final-time-clue' },
};

export const studyInvestigationTargetLabels = Object.fromEntries(Object.values(studyInvestigationTargets).map((target) => [target.id, target.label]));

export function resolveInvestigationMessage(targetId: string, flags: Record<string, boolean>) {
  if (targetId === 'typewriter' && flags.typewriterReady) return 'インクリボンを取り付けた。キーを押せば文字を打てそうだ。';
  if (targetId === 'typewriter') return '古いタイプライター。インクリボンがない。';
  if (targetId === 'fireplace' && flags.letterHeated) return '暖炉の熱で、封蝋を柔らかくできた。';
  if (targetId === 'desk' && flags.paperAligned) return '机の紙には BOOK と PAGE の手掛かりが残った。';
  if (targetId === 'globe' && flags.globeSolved) return '地球儀の航路は開き、タイプライターの周りが動いたようだ。';
  if (targetId === 'portrait' && flags.finalTimeSolved) return '肖像画の裏から鍵が現れた。';
  return `${studyInvestigationTargets[targetId]?.label ?? targetId}を調べた。`;
}
