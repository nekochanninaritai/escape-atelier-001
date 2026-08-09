export type ClueCategory = 'document' | 'object' | 'code' | 'location' | 'observation' | 'other';

export type ClueDefinition = {
  id: string;
  title: string;
  summary: string;
  detail?: string;
  category: ClueCategory;
  image?: string;
  alt?: string;
  relatedSceneIds?: string[];
  relatedItemIds?: string[];
  relatedPuzzleIds?: string[];
  tags?: string[];
  sortOrder?: number;
};

export type ClueState = {
  clueId: string;
  discoveredAt?: number;
  isRead: boolean;
};

export type InvestigationTargetDefinition = {
  id: string;
  label: string;
  sceneId?: string;
  category?: ClueCategory;
  clueIdOnInspect?: string;
};

export type InvestigationLogEntry = {
  targetId: string;
  inspectedAt?: number;
  count: number;
  latestMessage?: string;
};

export type NotebookData = {
  clues: ClueState[];
  investigationLog: InvestigationLogEntry[];
};

export type NotebookChangeResult = {
  data: NotebookData;
  changed: boolean;
};
