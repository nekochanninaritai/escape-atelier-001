import { GameImage } from '../../components/common/GameImage';
import type { ClueDefinition } from './types';

type ClueDetailProps = {
  clue: ClueDefinition;
  isRead: boolean;
  onBack: () => void;
  onMarkRead: () => void;
};

export function ClueDetail({ clue, isRead, onBack, onMarkRead }: ClueDetailProps) {
  return (
    <article className="clueDetail">
      <button type="button" onClick={onBack}>一覧へ戻る</button>
      <div>
        <span>{isRead ? 'READ' : 'NEW'}</span>
        <h3>{clue.title}</h3>
        <p>{clue.summary}</p>
      </div>
      {clue.image ? <GameImage src={clue.image} alt={clue.alt ?? clue.title} fallbackLabel={clue.title} className="clueImage" /> : null}
      {clue.detail ? <p className="clueDetailText">{clue.detail}</p> : null}
      <button type="button" onClick={onMarkRead}>確認済みにする</button>
    </article>
  );
}
