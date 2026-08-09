import type { InventoryData, ItemCombineRule, ItemDefinition, ItemId, ItemUseRule } from './types';
import { acquireInventoryItem, applyCombineRule, applyItemUseRule, getInventoryItem, hasInventoryItem, removeInventoryItem, selectInventoryItem, setInventoryItemState, transformInventoryItem } from './inventoryUtils';

export type InventoryActionApi = {
  hasItem: (itemId: ItemId) => boolean;
  getItemState: (itemId: ItemId) => string | undefined;
  acquireItem: (itemId: ItemId) => ReturnType<typeof acquireInventoryItem>;
  removeItem: (itemId: ItemId) => ReturnType<typeof removeInventoryItem>;
  selectItem: (itemId: ItemId) => InventoryData;
  clearSelectedItem: () => InventoryData;
  useItem: (itemId: ItemId, targetId: string) => ReturnType<typeof applyItemUseRule>;
  transformItem: (sourceItemId: ItemId, targetItemId: ItemId) => ReturnType<typeof transformInventoryItem>;
  setItemState: (itemId: ItemId, stateId: string) => ReturnType<typeof setInventoryItemState>;
  combineItems: (firstItemId: ItemId, secondItemId: ItemId) => ReturnType<typeof applyCombineRule>;
};

export function createInventoryActions(
  data: InventoryData,
  definitions: Record<string, ItemDefinition>,
  combineRules: readonly ItemCombineRule[] = [],
  useRules: readonly ItemUseRule[] = [],
  completedCombineRuleIds: readonly string[] = [],
  completedUseRuleIds: readonly string[] = [],
  flags: Record<string, boolean> = {},
): InventoryActionApi {
  return {
    hasItem: (itemId) => hasInventoryItem(data, itemId),
    getItemState: (itemId) => getInventoryItem(data, itemId)?.stateId,
    acquireItem: (itemId) => acquireInventoryItem(data, definitions, itemId),
    removeItem: (itemId) => removeInventoryItem(data, itemId),
    selectItem: (itemId) => selectInventoryItem(data, definitions, itemId),
    clearSelectedItem: () => ({ ...data, selectedItemId: null }),
    useItem: (itemId, targetId) => applyItemUseRule(data, definitions, useRules, completedUseRuleIds, itemId, targetId, flags),
    transformItem: (sourceItemId, targetItemId) => transformInventoryItem(data, definitions, sourceItemId, targetItemId),
    setItemState: (itemId, stateId) => setInventoryItemState(data, definitions, itemId, stateId),
    combineItems: (firstItemId, secondItemId) => applyCombineRule(data, definitions, combineRules, completedCombineRuleIds, firstItemId, secondItemId, flags),
  };
}
