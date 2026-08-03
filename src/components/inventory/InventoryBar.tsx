import { useState } from 'react';
import { items } from '../../data/items';
import { useGame } from '../../context/useGame';
import type { ItemId } from '../../types/game';
import { Modal } from '../common/Modal';
import './InventoryBar.css';

const slots = Array.from({ length: 5 });

export function InventoryBar() {
  const { state, dispatch } = useGame();
  const [detailItem, setDetailItem] = useState<ItemId | null>(null);

  return (
    <>
      <section className="inventory" aria-label="インベントリ">
        {slots.map((_, index) => {
          const itemId = state.inventory[index];
          const item = itemId ? items[itemId] : null;
          return (
            <div className="inventorySlot" key={index}>
              {item ? (
                <>
                  <button
                    type="button"
                    className={state.selectedItemId === item.id ? 'itemButton selected' : 'itemButton'}
                    onClick={() => dispatch({ type: 'SELECT_ITEM', itemId: item.id })}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      setDetailItem(item.id);
                    }}
                    aria-label={`${item.name}${state.selectedItemId === item.id ? ' 選択中' : ''}`}
                  >
                    <span className="itemIcon" aria-hidden="true">{item.name.slice(0, 1)}</span>
                    <span>{item.name}</span>
                  </button>
                  <button type="button" className="detailButton" onClick={() => setDetailItem(item.id)} aria-label={`${item.name}の詳細`}>
                    i
                  </button>
                </>
              ) : (
                <span className="emptySlot" aria-hidden="true" />
              )}
            </div>
          );
        })}
      </section>
      {detailItem && (
        <Modal title={items[detailItem].name} onClose={() => setDetailItem(null)}>
          <div className="itemDetail">
            <div className="largeItemIcon" aria-label={items[detailItem].name}>{items[detailItem].name.slice(0, 1)}</div>
            <p>{items[detailItem].description}</p>
          </div>
        </Modal>
      )}
    </>
  );
}
