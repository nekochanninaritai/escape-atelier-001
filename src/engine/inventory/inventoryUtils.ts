import type { InventoryData, InventoryEntry, InventoryItemState, ItemCombineRule, ItemDefinition, ItemId, ItemInteractionResult, ItemStateId, ItemUseRule } from './types';

const unique = <T,>(values: T[]) => [...new Set(values)];

const isInventoryItemState = (entry: InventoryEntry): entry is InventoryItemState => typeof entry === 'object' && entry !== null && typeof entry.itemId === 'string';

export function normalizeInventory(
  entries: readonly InventoryEntry[],
  definitions: Record<string, ItemDefinition>,
  selectedItemId: string | null = null,
  itemStates: Record<string, string> = {},
  collectedItems: readonly string[] = [],
  usedItems: readonly string[] = [],
): InventoryData {
  const inventory: InventoryItemState[] = [];
  const seen = new Set<string>();

  entries.forEach((entry) => {
    const itemId = isInventoryItemState(entry) ? entry.itemId : entry;
    const definition = definitions[itemId];
    if (!definition) return;
    const duplicateKey = definition.stackable ? `${itemId}:${inventory.length}` : itemId;
    if (!definition.stackable && seen.has(itemId)) return;
    seen.add(duplicateKey);
    const stateId = isInventoryItemState(entry) ? entry.stateId : itemStates[itemId] ?? definition.initialState;
    inventory.push({
      itemId,
      stateId,
      acquiredAt: isInventoryItemState(entry) && typeof entry.acquiredAt === 'number' ? entry.acquiredAt : undefined,
      isUsed: isInventoryItemState(entry) && entry.isUsed === true,
    });
  });

  const itemIds = inventory.map((item) => item.itemId);
  const normalizedSelected = selectedItemId && itemIds.includes(selectedItemId) ? selectedItemId : null;
  const normalizedItemStates = Object.fromEntries(
    inventory.flatMap((item) => (item.stateId && definitions[item.itemId]?.states?.[item.stateId] ? [[item.itemId, item.stateId]] : [])),
  );

  return {
    inventory,
    selectedItemId: normalizedSelected,
    itemStates: normalizedItemStates,
    collectedItems: unique(collectedItems.filter((itemId) => Boolean(definitions[itemId]))),
    usedItems: unique(usedItems.filter((itemId) => Boolean(definitions[itemId]))),
  };
}

export function resolveItemDefinition(definitions: Record<string, ItemDefinition>, itemId: ItemId, stateId?: ItemStateId): ItemDefinition | null {
  const definition = definitions[itemId];
  if (!definition) return null;
  const state = stateId ? definition.states?.[stateId] : undefined;
  return {
    ...definition,
    name: state?.name ?? definition.name,
    description: state?.description ?? definition.description,
    image: state?.image ?? definition.image,
    alt: state?.alt ?? definition.alt,
  };
}

export function hasInventoryItem(data: InventoryData, itemId: ItemId) {
  return data.inventory.some((item) => item.itemId === itemId);
}

export function getInventoryItem(data: InventoryData, itemId: ItemId) {
  return data.inventory.find((item) => item.itemId === itemId) ?? null;
}

export function acquireInventoryItem(data: InventoryData, definitions: Record<string, ItemDefinition>, itemId: ItemId, acquiredAt = Date.now()) {
  const definition = definitions[itemId];
  if (!definition) return { data, changed: false };
  if (!definition.stackable && hasInventoryItem(data, itemId)) {
    return { data: { ...data, collectedItems: unique([...data.collectedItems, itemId]) }, changed: false };
  }
  const entry: InventoryItemState = { itemId, stateId: definition.initialState, acquiredAt };
  return {
    data: {
      ...data,
      inventory: [...data.inventory, entry],
      itemStates: definition.initialState ? { ...data.itemStates, [itemId]: definition.initialState } : data.itemStates,
      collectedItems: unique([...data.collectedItems, itemId]),
    },
    changed: true,
  };
}

export function removeInventoryItem(data: InventoryData, itemId: ItemId) {
  if (!hasInventoryItem(data, itemId)) return { data, changed: false };
  const nextItemStates = { ...data.itemStates };
  delete nextItemStates[itemId];
  return {
    data: {
      ...data,
      inventory: data.inventory.filter((item) => item.itemId !== itemId),
      selectedItemId: data.selectedItemId === itemId ? null : data.selectedItemId,
      itemStates: nextItemStates,
    },
    changed: true,
  };
}

export function selectInventoryItem(data: InventoryData, definitions: Record<string, ItemDefinition>, itemId: ItemId) {
  if (!definitions[itemId] || !hasInventoryItem(data, itemId)) return data;
  return { ...data, selectedItemId: data.selectedItemId === itemId ? null : itemId };
}

export function setInventoryItemState(data: InventoryData, definitions: Record<string, ItemDefinition>, itemId: ItemId, stateId: ItemStateId) {
  if (!hasInventoryItem(data, itemId) || !definitions[itemId]?.states?.[stateId]) return { data, changed: false };
  return {
    data: {
      ...data,
      inventory: data.inventory.map((item) => (item.itemId === itemId ? { ...item, stateId } : item)),
      itemStates: { ...data.itemStates, [itemId]: stateId },
    },
    changed: true,
  };
}

export function transformInventoryItem(data: InventoryData, definitions: Record<string, ItemDefinition>, sourceItemId: ItemId, targetItemId: ItemId) {
  if (!hasInventoryItem(data, sourceItemId) || hasInventoryItem(data, targetItemId) || !definitions[targetItemId]) return { data, changed: false };
  const removed = removeInventoryItem(data, sourceItemId).data;
  const acquired = acquireInventoryItem(removed, definitions, targetItemId);
  return {
    data: {
      ...acquired.data,
      usedItems: unique([...acquired.data.usedItems, sourceItemId]),
      selectedItemId: acquired.data.selectedItemId === sourceItemId ? null : acquired.data.selectedItemId,
    },
    changed: acquired.changed,
  };
}

export function findCombineRule(rules: readonly ItemCombineRule[], firstItemId: ItemId, secondItemId: ItemId) {
  return rules.find((rule) => rule.itemIds.includes(firstItemId) && rule.itemIds.includes(secondItemId) && firstItemId !== secondItemId) ?? null;
}

export function canCombineItems(data: InventoryData, rules: readonly ItemCombineRule[], firstItemId: ItemId, secondItemId: ItemId, flags: Record<string, boolean> = {}) {
  const rule = findCombineRule(rules, firstItemId, secondItemId);
  if (!rule) return false;
  if (!hasInventoryItem(data, firstItemId) || !hasInventoryItem(data, secondItemId)) return false;
  return (rule.requiredFlags ?? []).every((flag) => flags[flag]);
}

export function applyCombineRule(
  data: InventoryData,
  definitions: Record<string, ItemDefinition>,
  rules: readonly ItemCombineRule[],
  completedRuleIds: readonly string[],
  firstItemId: ItemId,
  secondItemId: ItemId,
  flags: Record<string, boolean> = {},
): ItemInteractionResult {
  const rule = findCombineRule(rules, firstItemId, secondItemId);
  if (!rule || completedRuleIds.includes(rule.id) || !canCombineItems(data, rules, firstItemId, secondItemId, flags)) return { data, changed: false };
  let next = data;
  (rule.consumeItemIds ?? []).forEach((itemId) => {
    next = removeInventoryItem(next, itemId).data;
  });
  (rule.resultItemIds ?? []).forEach((itemId) => {
    next = acquireInventoryItem(next, definitions, itemId).data;
  });
  return { data: { ...next, selectedItemId: null }, changed: true, ruleId: rule.id, message: rule.successMessage, flags: rule.setFlags };
}

export function findItemUseRule(rules: readonly ItemUseRule[], itemId: ItemId, targetId: string) {
  return rules.find((rule) => rule.itemId === itemId && rule.targetId === targetId) ?? null;
}

export function canUseItemOnTarget(data: InventoryData, rules: readonly ItemUseRule[], itemId: ItemId, targetId: string, flags: Record<string, boolean> = {}) {
  const rule = findItemUseRule(rules, itemId, targetId);
  if (!rule || !hasInventoryItem(data, itemId)) return false;
  if ((rule.requiredFlags ?? []).some((flag) => !flags[flag])) return false;
  if ((rule.forbiddenFlags ?? []).some((flag) => flags[flag])) return false;
  return true;
}

export function applyItemUseRule(
  data: InventoryData,
  definitions: Record<string, ItemDefinition>,
  rules: readonly ItemUseRule[],
  completedRuleIds: readonly string[],
  itemId: ItemId,
  targetId: string,
  flags: Record<string, boolean> = {},
): ItemInteractionResult {
  const rule = findItemUseRule(rules, itemId, targetId);
  if (!rule || completedRuleIds.includes(rule.id) || !canUseItemOnTarget(data, rules, itemId, targetId, flags)) return { data, changed: false, message: rule?.failureMessage };
  let next = data;
  if (rule.result?.transform) {
    next = transformInventoryItem(next, definitions, rule.result.transform.from, rule.result.transform.to).data;
  }
  (rule.result?.removeItemIds ?? []).forEach((removeItemId) => {
    next = removeInventoryItem(next, removeItemId).data;
  });
  (rule.result?.acquireItemIds ?? []).forEach((acquireItemId) => {
    next = acquireInventoryItem(next, definitions, acquireItemId).data;
  });
  if (rule.consumeMode === 'remove') next = removeInventoryItem(next, itemId).data;
  if (rule.consumeMode === 'mark-used') next = { ...next, usedItems: unique([...next.usedItems, itemId]) };
  return { data: { ...next, selectedItemId: null }, changed: true, ruleId: rule.id, message: rule.successMessage, flags: rule.result?.setFlags };
}
