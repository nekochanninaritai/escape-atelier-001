import type { ItemCombineRule } from '../../../engine/inventory/types';

export const studyItemCombineRules: ItemCombineRule[] = [
  {
    id: 'open-heated-letter',
    itemIds: ['heated-letter', 'paper-knife'],
    consumeItemIds: ['heated-letter'],
    keepItemIds: ['paper-knife'],
    resultItemIds: ['opened-letter'],
    setFlags: { letterOpened: true },
    successMessage: '柔らかくなった封蝋へ刃先を差し入れる。手紙を傷つけず、封を開けることができた。',
  },
];
