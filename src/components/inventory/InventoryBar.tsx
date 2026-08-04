import { useState } from 'react';
import { imageAssets } from '../../data/imageAssets';
import { items } from '../../data/items';
import { puzzles } from '../../data/puzzles';
import { useGame } from '../../context/useGame';
import type { ItemId } from '../../types/game';
import { GameImage } from '../common/GameImage';
import { Modal } from '../common/Modal';
import './InventoryBar.css';

const slots = Array.from({ length: 5 });
const fragmentIds: ItemId[] = ['sheetPiece1', 'sheetPiece2', 'sheetPiece3'];

export function InventoryBar() {
  const { state, dispatch, showMessage } = useGame();
  const [detailItem, setDetailItem] = useState<ItemId | null>(null);
  const [paperBackVisible, setPaperBackVisible] = useState(false);

  const hasAllFragments = fragmentIds.every((itemId) => state.inventory.includes(itemId));
  const canCombinePaper = hasAllFragments && !state.flags.paperCombined && !state.inventory.includes('combinedPaper');

  const combinePaper = () => {
    if (!hasAllFragments) {
      showMessage(puzzles.sheetOrder.failureMessage);
      return;
    }
    if (state.flags.paperCombined || state.inventory.includes('combinedPaper')) return;

    for (const itemId of fragmentIds) {
      dispatch({ type: 'USE_ITEM', itemId, consume: true });
    }
    dispatch({ type: 'SOLVE_PUZZLE', puzzleId: 'sheetOrder' });
    dispatch({ type: 'SET_FLAG', key: 'paperCombined', value: true });
    dispatch({ type: 'COLLECT_ITEM', itemId: 'combinedPaper' });
    showMessage(puzzles.sheetOrder.successMessage);
  };

  const openDetail = (itemId: ItemId) => {
    setDetailItem(itemId);
    setPaperBackVisible(false);
  };

  const flipPaper = () => {
    const nextVisible = !paperBackVisible;
    setPaperBackVisible(nextVisible);
    if (nextVisible && !state.flags.globeMarkSeen) {
      dispatch({ type: 'SET_FLAG', key: 'globeMarkSeen', value: true });
      showMessage('紙の裏には、地球儀のような印が描かれている。');
    }
  };

  const detailDescription = (itemId: ItemId) => {
    if (fragmentIds.includes(itemId) && hasAllFragments) {
      return 'すべての切れ端がそろった。組み合わせれば、一つの紙になりそうだ。';
    }
    return items[itemId].description;
  };

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
                      openDetail(item.id);
                    }}
                    aria-label={`${item.name}${state.selectedItemId === item.id ? ' 選択中' : ''}`}
                  >
                    <span className="itemIcon" aria-hidden="true">
                      <img src={item.image} alt="" draggable={false} />
                    </span>
                    <span>{item.name}</span>
                  </button>
                  <button type="button" className="detailButton" onClick={() => openDetail(item.id)} aria-label={`${item.name}の詳細`}>
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
      {canCombinePaper && (
        <button type="button" className="assembleButton" onClick={combinePaper}>
          紙をつなぎ合わせる
        </button>
      )}
      {detailItem && (
        <Modal title={items[detailItem].name} onClose={() => setDetailItem(null)}>
          <div className="itemDetail">
            {detailItem === 'combinedPaper' ? (
              <>
                <div className={paperBackVisible ? 'paperCard paperCardBack' : 'paperCard'}>
                  <GameImage
                    src={paperBackVisible ? imageAssets.items.combinedPaperBack : imageAssets.items.combinedPaperFront}
                    alt={paperBackVisible ? '地球儀のような印が描かれた紙の裏面' : items.combinedPaper.alt}
                    fallbackLabel={paperBackVisible ? '紙の裏面' : '紙の表面'}
                    className="largeItemIcon"
                  />
                </div>
                <button type="button" className="flipButton" onClick={flipPaper}>
                  {paperBackVisible ? '表に戻す' : '裏返す'}
                </button>
              </>
            ) : (
              <GameImage
                src={items[detailItem].image}
                alt={items[detailItem].alt}
                fallbackLabel={items[detailItem].name}
                className="largeItemIcon"
              />
            )}
            <p>{detailDescription(detailItem)}</p>
          </div>
        </Modal>
      )}
    </>
  );
}
