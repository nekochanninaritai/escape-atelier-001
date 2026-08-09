import type { ItemUseRule } from '../../../engine/inventory/types';

export const studyItemUseRules: ItemUseRule[] = [
  {
    id: 'warm-sealed-letter',
    itemId: 'sealed-letter',
    targetId: 'fireplace',
    forbiddenFlags: ['letterHeated'],
    consumeMode: 'transform',
    result: {
      transform: { from: 'sealed-letter', to: 'heated-letter' },
      setFlags: { letterHeated: true },
    },
    successMessage: '暖炉の熱に近づけると、赤い封蝋が少し柔らかくなった。',
    failureMessage: 'ここでは手紙を温められない。',
  },
  {
    id: 'install-ink-ribbon',
    itemId: 'ink-ribbon',
    targetId: 'typewriter',
    consumeMode: 'remove',
    result: {
      setFlags: { typewriterReady: true, inkRibbonInstalled: true },
    },
    successMessage: 'インクリボンを取り付けた。タイプライターが使えそうだ。',
    failureMessage: 'インクリボンはここでは使えない。',
  },
  {
    id: 'unlock-study-door',
    itemId: 'study-key',
    targetId: 'exit-door',
    consumeMode: 'mark-used',
    result: {
      setFlags: { doorUnlocked: true, exitDoorUnlocked: true },
    },
    successMessage: '鍵穴の奥で、静かに錠が外れた。',
    failureMessage: 'この鍵を使う場所ではない。',
  },
];
