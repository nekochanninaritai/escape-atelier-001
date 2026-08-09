import type { ItemCombineRule } from '../../../engine/inventory/types';

export const studyItemCombineRules: ItemCombineRule[] = [
  {
    id: 'open-heated-letter',
    itemIds: ['heated-letter', 'paper-knife'],
    consumeItemIds: ['heated-letter'],
    keepItemIds: ['paper-knife'],
    resultItemIds: ['opened-letter'],
    setFlags: { letterOpened: true },
    successMessage: '柔らかくなった封蝋にペーパーナイフを差し入れ、手紙を開いた。',
  },
];
