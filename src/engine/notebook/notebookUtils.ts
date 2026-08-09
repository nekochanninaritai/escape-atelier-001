import type { ClueCategory, ClueDefinition, ClueState, InvestigationLogEntry, InvestigationTargetDefinition, NotebookChangeResult, NotebookData } from './types';

const unique = <T,>(values: T[]) => [...new Set(values)];

export function normalizeNotebook(
  clueEntries: readonly ClueState[],
  logEntries: readonly InvestigationLogEntry[],
  clueDefinitions: Record<string, ClueDefinition>,
  targetDefinitions: Record<string, InvestigationTargetDefinition> = {},
): NotebookData {
  const seenClues = new Set<string>();
  const clues = clueEntries.flatMap((entry): ClueState[] => {
    if (!clueDefinitions[entry.clueId] || seenClues.has(entry.clueId)) return [];
    seenClues.add(entry.clueId);
    return [{ clueId: entry.clueId, discoveredAt: entry.discoveredAt, isRead: entry.isRead }];
  });
  const discoveredIds = new Set(clues.map((entry) => entry.clueId));
  const investigationLog = logEntries.flatMap((entry): InvestigationLogEntry[] => {
    if (!targetDefinitions[entry.targetId]) return [];
    return [{
      targetId: entry.targetId,
      inspectedAt: entry.inspectedAt,
      count: Math.max(1, Math.floor(entry.count)),
      latestMessage: entry.latestMessage,
    }];
  });

  return {
    clues: clues.filter((entry) => discoveredIds.has(entry.clueId)),
    investigationLog,
  };
}

export function discoverClue(data: NotebookData, definitions: Record<string, ClueDefinition>, clueId: string, discoveredAt = Date.now()): NotebookChangeResult {
  if (!definitions[clueId] || data.clues.some((entry) => entry.clueId === clueId)) return { data, changed: false };
  return {
    data: { ...data, clues: [...data.clues, { clueId, discoveredAt, isRead: false }] },
    changed: true,
  };
}

export function hasDiscoveredClue(data: NotebookData, clueId: string) {
  return data.clues.some((entry) => entry.clueId === clueId);
}

export function markClueAsRead(data: NotebookData, clueId: string): NotebookChangeResult {
  if (!hasDiscoveredClue(data, clueId)) return { data, changed: false };
  const changed = data.clues.some((entry) => entry.clueId === clueId && !entry.isRead);
  return {
    data: { ...data, clues: data.clues.map((entry) => (entry.clueId === clueId ? { ...entry, isRead: true } : entry)) },
    changed,
  };
}

export function markAllCluesAsRead(data: NotebookData): NotebookChangeResult {
  const changed = data.clues.some((entry) => !entry.isRead);
  return { data: { ...data, clues: data.clues.map((entry) => ({ ...entry, isRead: true })) }, changed };
}

export function getDiscoveredClues(data: NotebookData, definitions: Record<string, ClueDefinition>) {
  return data.clues
    .map((state) => ({ state, definition: definitions[state.clueId] }))
    .filter((entry): entry is { state: ClueState; definition: ClueDefinition } => Boolean(entry.definition))
    .sort((a, b) => (a.definition.sortOrder ?? 0) - (b.definition.sortOrder ?? 0));
}

export function getUnreadClueCount(data: NotebookData) {
  const readIds = new Set(data.clues.filter((entry) => entry.isRead).map((entry) => entry.clueId));
  return unique(data.clues.map((entry) => entry.clueId)).filter((id) => !readIds.has(id)).length;
}

export function getCluesByCategory(data: NotebookData, definitions: Record<string, ClueDefinition>, category: ClueCategory | 'all') {
  const discovered = getDiscoveredClues(data, definitions);
  return category === 'all' ? discovered : discovered.filter((entry) => entry.definition.category === category);
}

export function getCluesRelatedToPuzzle(data: NotebookData, definitions: Record<string, ClueDefinition>, puzzleId: string) {
  return getDiscoveredClues(data, definitions).filter((entry) => entry.definition.relatedPuzzleIds?.includes(puzzleId));
}

export function recordInvestigation(
  data: NotebookData,
  targetDefinitions: Record<string, InvestigationTargetDefinition>,
  targetId: string,
  latestMessage?: string,
  inspectedAt = Date.now(),
): NotebookChangeResult {
  if (!targetDefinitions[targetId]) return { data, changed: false };
  const existing = data.investigationLog.find((entry) => entry.targetId === targetId);
  if (!existing) {
    return { data: { ...data, investigationLog: [...data.investigationLog, { targetId, inspectedAt, count: 1, latestMessage }] }, changed: true };
  }
  return {
    data: {
      ...data,
      investigationLog: data.investigationLog.map((entry) =>
        entry.targetId === targetId ? { ...entry, inspectedAt, count: entry.count + 1, latestMessage: latestMessage ?? entry.latestMessage } : entry,
      ),
    },
    changed: true,
  };
}
