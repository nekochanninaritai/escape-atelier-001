import type { ClueDefinition, ClueState } from './types';

type ClueListProps = {
  clues: { state: ClueState; definition: ClueDefinition }[];
  onSelect: (clueId: string) => void;
};

export function ClueList({ clues, onSelect }: ClueListProps) {
  if (clues.length === 0) {
    return <p className="notebookEmpty">まだ記録された手掛かりはありません。部屋を調べてみよう。</p>;
  }

  return (
    <div className="clueList">
      {clues.map(({ state, definition }) => (
        <button type="button" key={state.clueId} className="clueListItem" onClick={() => onSelect(state.clueId)}>
          <span>{state.isRead ? 'READ' : 'NEW'}</span>
          <strong>{definition.title}</strong>
          <small>{definition.summary}</small>
        </button>
      ))}
    </div>
  );
}
