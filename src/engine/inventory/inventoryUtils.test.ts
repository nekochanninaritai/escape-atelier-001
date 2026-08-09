import { describe, expect, it } from 'vitest';
import { acquireInventoryItem, applyCombineRule, applyItemUseRule, normalizeInventory, selectInventoryItem, transformInventoryItem } from './inventoryUtils';
import type { ItemCombineRule, ItemDefinition, ItemUseRule } from './types';

const definitions: Record<string, ItemDefinition> = {
  letter: { id: 'letter', name: 'Letter', description: 'A sealed letter.' },
  warmLetter: { id: 'warmLetter', name: 'Warm Letter', description: 'A warm letter.' },
  knife: { id: 'knife', name: 'Knife', description: 'A knife.', persistent: true },
  openedLetter: { id: 'openedLetter', name: 'Opened Letter', description: 'An opened letter.' },
  coin: { id: 'coin', name: 'Coin', description: 'A coin.', stackable: true },
};

const combineRules: ItemCombineRule[] = [
  {
    id: 'open-letter',
    itemIds: ['warmLetter', 'knife'],
    consumeItemIds: ['warmLetter'],
    keepItemIds: ['knife'],
    resultItemIds: ['openedLetter'],
    setFlags: { letterOpened: true },
    successMessage: 'Opened.',
  },
];

const useRules: ItemUseRule[] = [
  {
    id: 'warm-letter',
    itemId: 'letter',
    targetId: 'fireplace',
    consumeMode: 'transform',
    result: { transform: { from: 'letter', to: 'warmLetter' }, setFlags: { letterHeated: true } },
    successMessage: 'Warm.',
  },
];

describe('inventory utilities', () => {
  it('normalizes legacy string inventories and drops invalid selected ids', () => {
    const data = normalizeInventory(['letter', 'missing', 'knife'], definitions, 'missing');
    expect(data.inventory.map((item) => item.itemId)).toEqual(['letter', 'knife']);
    expect(data.selectedItemId).toBeNull();
  });

  it('prevents duplicate non-stackable items and allows stackable items', () => {
    const empty = normalizeInventory([], definitions);
    const once = acquireInventoryItem(empty, definitions, 'letter').data;
    const twice = acquireInventoryItem(once, definitions, 'letter').data;
    const coinOnce = acquireInventoryItem(twice, definitions, 'coin').data;
    const coinTwice = acquireInventoryItem(coinOnce, definitions, 'coin').data;
    expect(twice.inventory.filter((item) => item.itemId === 'letter')).toHaveLength(1);
    expect(coinTwice.inventory.filter((item) => item.itemId === 'coin')).toHaveLength(2);
  });

  it('selects existing items and toggles them off', () => {
    const data = normalizeInventory(['letter'], definitions);
    const selected = selectInventoryItem(data, definitions, 'letter');
    const cleared = selectInventoryItem(selected, definitions, 'letter');
    expect(selected.selectedItemId).toBe('letter');
    expect(cleared.selectedItemId).toBeNull();
  });

  it('transforms source items into target items only once', () => {
    const data = normalizeInventory(['letter'], definitions, 'letter');
    const transformed = transformInventoryItem(data, definitions, 'letter', 'warmLetter').data;
    const transformedAgain = transformInventoryItem(transformed, definitions, 'letter', 'warmLetter');
    expect(transformed.inventory.map((item) => item.itemId)).toEqual(['warmLetter']);
    expect(transformed.selectedItemId).toBeNull();
    expect(transformedAgain.changed).toBe(false);
  });

  it('combines items in either order while preserving keep items', () => {
    const data = normalizeInventory(['knife', 'warmLetter'], definitions);
    const result = applyCombineRule(data, definitions, combineRules, [], 'knife', 'warmLetter');
    expect(result.changed).toBe(true);
    expect(result.ruleId).toBe('open-letter');
    expect(result.data.inventory.map((item) => item.itemId)).toEqual(['knife', 'openedLetter']);
    expect(result.flags).toEqual({ letterOpened: true });
  });

  it('applies target use rules once and returns flags', () => {
    const data = normalizeInventory(['letter'], definitions);
    const result = applyItemUseRule(data, definitions, useRules, [], 'letter', 'fireplace');
    const duplicate = applyItemUseRule(result.data, definitions, useRules, ['warm-letter'], 'letter', 'fireplace');
    expect(result.data.inventory.map((item) => item.itemId)).toEqual(['warmLetter']);
    expect(result.flags).toEqual({ letterHeated: true });
    expect(duplicate.changed).toBe(false);
  });
});
