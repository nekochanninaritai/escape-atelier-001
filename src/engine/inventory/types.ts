export type ItemStateId = string;
export type ItemId = string;

export type ItemDefinitionState = {
  name?: string;
  description?: string;
  image?: string;
  alt?: string;
};

export type ItemDefinition = {
  id: ItemId;
  name: string;
  description: string;
  image?: string;
  alt?: string;
  stackable?: boolean;
  persistent?: boolean;
  inspectable?: boolean;
  rotatable?: boolean;
  flippable?: boolean;
  zoomable?: boolean;
  initialState?: ItemStateId;
  states?: Record<ItemStateId, ItemDefinitionState>;
};

export type InventoryItemState = {
  itemId: ItemId;
  stateId?: ItemStateId;
  acquiredAt?: number;
  isUsed?: boolean;
};

export type InventoryEntry = ItemId | InventoryItemState;

export type InventoryData = {
  inventory: InventoryItemState[];
  selectedItemId: ItemId | null;
  itemStates: Record<ItemId, ItemStateId>;
  collectedItems: ItemId[];
  usedItems: ItemId[];
};

export type ItemUseRule = {
  id: string;
  itemId: ItemId;
  targetId: string;
  requiredFlags?: string[];
  forbiddenFlags?: string[];
  consumeMode?: 'remove' | 'keep' | 'mark-used' | 'transform';
  result?: {
    removeItemIds?: ItemId[];
    acquireItemIds?: ItemId[];
    transform?: {
      from: ItemId;
      to: ItemId;
    };
    setFlags?: Record<string, boolean>;
  };
  successMessage: string;
  failureMessage?: string;
};

export type ItemCombineRule = {
  id: string;
  itemIds: [ItemId, ItemId];
  consumeItemIds?: ItemId[];
  keepItemIds?: ItemId[];
  resultItemIds?: ItemId[];
  requiredFlags?: string[];
  setFlags?: Record<string, boolean>;
  successMessage: string;
};

export type InventoryChangeResult = {
  data: InventoryData;
  changed: boolean;
};

export type ItemInteractionResult = InventoryChangeResult & {
  ruleId?: string;
  message?: string;
  flags?: Record<string, boolean>;
};
