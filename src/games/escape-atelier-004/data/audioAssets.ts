export type StudyAudioAsset = {
  id: string;
  src?: string;
  kind: 'bgm' | 'se';
};

export const studyAudioAssets: StudyAudioAsset[] = [
  { id: 'title-bgm', src: `${import.meta.env.BASE_URL}assets/escape-atelier-004/audio/title-bgm.wav`, kind: 'bgm' },
  { id: 'study-bgm', src: `${import.meta.env.BASE_URL}assets/escape-atelier-004/audio/study-bgm.wav`, kind: 'bgm' },
  { id: 'ending-bgm', src: `${import.meta.env.BASE_URL}assets/escape-atelier-004/audio/ending-bgm.wav`, kind: 'bgm' },
  { id: 'item-get', src: `${import.meta.env.BASE_URL}assets/escape-atelier-004/audio/item-get.wav`, kind: 'se' },
  { id: 'correct', src: `${import.meta.env.BASE_URL}assets/escape-atelier-004/audio/correct.wav`, kind: 'se' },
  { id: 'wrong', src: `${import.meta.env.BASE_URL}assets/escape-atelier-004/audio/wrong.wav`, kind: 'se' },
  { id: 'paper', src: `${import.meta.env.BASE_URL}assets/escape-atelier-004/audio/paper.wav`, kind: 'se' },
  { id: 'typewriter', src: `${import.meta.env.BASE_URL}assets/escape-atelier-004/audio/typewriter.wav`, kind: 'se' },
  { id: 'fireplace', src: `${import.meta.env.BASE_URL}assets/escape-atelier-004/audio/fireplace.wav`, kind: 'se' },
  { id: 'globe', src: `${import.meta.env.BASE_URL}assets/escape-atelier-004/audio/globe.wav`, kind: 'se' },
  { id: 'door', src: `${import.meta.env.BASE_URL}assets/escape-atelier-004/audio/door.wav`, kind: 'se' },
];
