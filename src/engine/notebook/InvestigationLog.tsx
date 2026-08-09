import type { InvestigationLogEntry } from './types';

type InvestigationLogProps = {
  entries: InvestigationLogEntry[];
  targetLabels: Record<string, string>;
};

export function InvestigationLog({ entries, targetLabels }: InvestigationLogProps) {
  return (
    <section className="investigationLog">
      <h3>調査履歴</h3>
      {entries.length === 0 ? <p>まだ調べた場所はありません。</p> : null}
      {entries.slice(-12).reverse().map((entry) => (
        <div key={entry.targetId}>
          <strong>{targetLabels[entry.targetId] ?? entry.targetId}</strong>
          <span>{entry.count}回調査</span>
          {entry.latestMessage ? <p>{entry.latestMessage}</p> : null}
        </div>
      ))}
    </section>
  );
}
