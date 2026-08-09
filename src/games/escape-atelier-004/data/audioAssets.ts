export type StudyAudioAsset = {
  id: string;
  src?: string;
  kind: 'bgm' | 'se';
};

export const studyAudioAssets: StudyAudioAsset[] = [
  { id: 'title-bgm', kind: 'bgm' },
  { id: 'study-bgm', kind: 'bgm' },
  { id: 'ending-bgm', kind: 'bgm' },
  { id: 'item-get', kind: 'se' },
  { id: 'correct', kind: 'se' },
  { id: 'wrong', kind: 'se' },
  { id: 'paper', kind: 'se' },
  { id: 'typewriter', kind: 'se' },
  { id: 'fireplace', kind: 'se' },
  { id: 'globe', kind: 'se' },
  { id: 'door', kind: 'se' },
];
