import type { ClueCategory, ClueDefinition, InvestigationTargetDefinition, NotebookData } from './types';
import { discoverClue, getCluesByCategory, getCluesRelatedToPuzzle, getDiscoveredClues, getUnreadClueCount, hasDiscoveredClue, markAllCluesAsRead, markClueAsRead, recordInvestigation } from './notebookUtils';

export function createNotebookActions(
  data: NotebookData,
  clueDefinitions: Record<string, ClueDefinition>,
  targetDefinitions: Record<string, InvestigationTargetDefinition> = {},
) {
  return {
    discoverClue: (clueId: string) => discoverClue(data, clueDefinitions, clueId),
    hasDiscoveredClue: (clueId: string) => hasDiscoveredClue(data, clueId),
    markClueAsRead: (clueId: string) => markClueAsRead(data, clueId),
    markAllCluesAsRead: () => markAllCluesAsRead(data),
    getDiscoveredClues: () => getDiscoveredClues(data, clueDefinitions),
    getUnreadClueCount: () => getUnreadClueCount(data),
    getCluesByCategory: (category: ClueCategory | 'all') => getCluesByCategory(data, clueDefinitions, category),
    getCluesRelatedToPuzzle: (puzzleId: string) => getCluesRelatedToPuzzle(data, clueDefinitions, puzzleId),
    recordInvestigation: (targetId: string, latestMessage?: string) => recordInvestigation(data, targetDefinitions, targetId, latestMessage),
  };
}
