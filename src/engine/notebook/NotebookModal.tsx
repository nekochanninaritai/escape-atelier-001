import { useMemo, useState } from 'react';
import { Modal } from '../../components/common/Modal';
import type { ClueCategory, ClueDefinition, NotebookData } from './types';
import { getCluesByCategory } from './notebookUtils';
import { ClueList } from './ClueList';
import { ClueDetail } from './ClueDetail';
import { InvestigationLog } from './InvestigationLog';
import './NotebookModal.css';

type NotebookModalProps = {
  data: NotebookData;
  definitions: Record<string, ClueDefinition>;
  targetLabels: Record<string, string>;
  onClose: () => void;
  onMarkRead: (clueId: string) => void;
};

const categories: { id: ClueCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'すべて' },
  { id: 'document', label: '文書' },
  { id: 'object', label: '物' },
  { id: 'code', label: '数字・記号' },
  { id: 'observation', label: '観察' },
  { id: 'location', label: '場所' },
];

export function NotebookModal({ data, definitions, targetLabels, onClose, onMarkRead }: NotebookModalProps) {
  const [category, setCategory] = useState<ClueCategory | 'all'>('all');
  const [selectedClueId, setSelectedClueId] = useState<string | null>(null);
  const clues = useMemo(() => getCluesByCategory(data, definitions, category), [category, data, definitions]);
  const selected = selectedClueId ? clues.find((entry) => entry.state.clueId === selectedClueId) ?? null : null;

  return (
    <Modal title="NOTE" onClose={onClose}>
      <div className="notebook">
        <div className="notebookTabs" role="tablist" aria-label="ノートカテゴリ">
          {categories.map((entry) => (
            <button key={entry.id} type="button" className={category === entry.id ? 'active' : ''} aria-selected={category === entry.id} onClick={() => { setCategory(entry.id); setSelectedClueId(null); }}>
              {entry.label}
            </button>
          ))}
        </div>
        {selected ? (
          <ClueDetail clue={selected.definition} isRead={selected.state.isRead} onBack={() => setSelectedClueId(null)} onMarkRead={() => onMarkRead(selected.state.clueId)} />
        ) : (
          <>
            <ClueList clues={clues} onSelect={(clueId) => setSelectedClueId(clueId)} />
            <InvestigationLog entries={data.investigationLog} targetLabels={targetLabels} />
          </>
        )}
      </div>
    </Modal>
  );
}
