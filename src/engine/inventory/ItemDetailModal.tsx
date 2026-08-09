import { useEffect, useRef, useState } from 'react';
import { GameImage } from '../../components/common/GameImage';
import { Modal } from '../../components/common/Modal';
import type { InventoryData, ItemDefinition, ItemId } from './types';
import { resolveItemDefinition } from './inventoryUtils';
import './ItemDetailModal.css';

type ItemDetailModalProps = {
  itemId: ItemId;
  inventoryData: InventoryData;
  definitions: Record<string, ItemDefinition>;
  combinableItemIds?: readonly ItemId[];
  onClose: () => void;
  onSelectItem: (itemId: ItemId) => void;
  onSetItemState?: (itemId: ItemId, stateId: string) => void;
  onCombine?: (firstItemId: ItemId, secondItemId: ItemId) => void;
};

export function ItemDetailModal({ itemId, inventoryData, definitions, combinableItemIds = [], onClose, onSelectItem, onSetItemState, onCombine }: ItemDetailModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [combineMode, setCombineMode] = useState(false);
  const stateId = inventoryData.itemStates[itemId];
  const definition = resolveItemDefinition(definitions, itemId, stateId);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  if (!definition) return null;

  const stateIds = Object.keys(definitions[itemId]?.states ?? {});

  return (
    <Modal title={definition.name} onClose={onClose}>
      <div className="itemDetail">
        <GameImage src={definition.image ?? ''} alt={definition.alt ?? definition.name} fallbackLabel={definition.name} className="itemDetailImage" />
        <p>{definition.description}</p>
        <div className="itemDetailActions">
          <button type="button" ref={closeButtonRef} onClick={onClose}>閉じる</button>
          <button type="button" onClick={() => onSelectItem(itemId)}>選択する</button>
          {stateIds.length > 1 && definitions[itemId]?.rotatable ? <button type="button" onClick={() => onSetItemState?.(itemId, stateIds[(stateIds.indexOf(stateId ?? '') + 1) % stateIds.length])}>回転</button> : null}
          {stateIds.length > 1 && definitions[itemId]?.flippable ? <button type="button" onClick={() => onSetItemState?.(itemId, stateIds[(stateIds.indexOf(stateId ?? '') + 1) % stateIds.length])}>裏返す</button> : null}
          {definitions[itemId]?.zoomable ? <button type="button" onClick={() => undefined}>拡大</button> : null}
          {onCombine ? <button type="button" aria-label={`${definition.name}と他のアイテムを組み合わせる`} onClick={() => setCombineMode((value) => !value)}>組み合わせる</button> : null}
        </div>
        {combineMode ? (
          <div className="itemCombineList">
            {inventoryData.inventory.map((entry) => {
              const candidate = resolveItemDefinition(definitions, entry.itemId, entry.stateId);
              if (!candidate || entry.itemId === itemId) return null;
              const canCombine = combinableItemIds.includes(entry.itemId);
              return (
                <button type="button" key={`${entry.itemId}-${entry.acquiredAt ?? 0}`} disabled={!canCombine} onClick={() => onCombine?.(itemId, entry.itemId)}>
                  {candidate.name}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
