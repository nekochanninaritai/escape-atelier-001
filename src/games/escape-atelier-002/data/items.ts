import { greenhouseItemImages } from './imageAssets';
import type { GreenhouseItemId } from '../types';

export const greenhouseItems: Record<GreenhouseItemId, { name: string; description: string; icon: string; image: string; alt: string }> = {
  canPiece1: {
    name: '水差しの破片1',
    description: '作業机で見つけた陶器の破片。',
    icon: 'C1',
    image: greenhouseItemImages.canPiece1,
    alt: '青い模様の水差しの破片',
  },
  canPiece2: {
    name: '水差しの破片2',
    description: '植木鉢棚に隠れていた破片。',
    icon: 'C2',
    image: greenhouseItemImages.canPiece2,
    alt: '花模様が残る水差しの破片',
  },
  canPiece3: {
    name: '水差しの破片3',
    description: '石像の蔦の陰にあった破片。',
    icon: 'C3',
    image: greenhouseItemImages.canPiece3,
    alt: '小さな陶器の水差しの破片',
  },
  wateringCan: {
    name: '修復した水差し',
    description: '水をくめそうな古い水差し。',
    icon: '缶',
    image: greenhouseItemImages.wateringCan,
    alt: '修復されたアンティークの水差し',
  },
  wateredCan: {
    name: '水の入った水差し',
    description: '温室の噴水からくんだ水が入っている。',
    icon: '水',
    image: greenhouseItemImages.wateredCan,
    alt: '水が入ったアンティークの水差し',
  },
  flowerSeed: {
    name: '花の種',
    description: '淡く光る小さな種。',
    icon: '種',
    image: greenhouseItemImages.flowerSeed,
    alt: '淡く光る花の種',
  },
  smallMirror: {
    name: '小さな鏡',
    description: '鏡の装置にはめ込めそうだ。',
    icon: '鏡',
    image: greenhouseItemImages.smallMirror,
    alt: '真鍮の小さな手鏡',
  },
  butterflyKey: {
    name: '蝶の鍵',
    description: '蝶の羽をかたどった金色の鍵。',
    icon: '鍵',
    image: greenhouseItemImages.butterflyKey,
    alt: '蝶の形をした金色の鍵',
  },
};
