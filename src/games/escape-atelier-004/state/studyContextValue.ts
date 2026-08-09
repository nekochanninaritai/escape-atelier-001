import { createContext } from 'react';
import type { StudyAction, StudyGameState } from '../types';

export type StudyContextValue = {
  state: StudyGameState;
  dispatch: React.Dispatch<StudyAction>;
  message: string | null;
  showMessage: (message: string) => void;
};

export const StudyContext = createContext<StudyContextValue | null>(null);
