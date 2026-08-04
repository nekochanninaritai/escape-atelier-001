import { mirrorHintText } from './puzzles';

export const greenhouseHints = {
  wateringCan: ['水差しの破片をすべて探してみよう。', '作業机、植木鉢棚、石像の周辺を調べよう。', '3つの破片を、水差しの輪郭へ重ねよう。'],
  flowerColors: ['水を与えた後の花をよく見よう。', '花が咲いた順番を覚えよう。', '青、白、赤、黄の順番で押そう。'],
  plantPots: ['鉢だけでなく、植物の特徴も見よう。', '低いものから成長していく順番を考えよう。', '低い葉、丸い葉、細長い葉、花の鉢の順番。'],
  mirrorLight: ['光が次の鏡へ届く向きを探そう。', '入口の光から、大樹まで順番に鏡を調整しよう。', mirrorHintText()],
} as const;
