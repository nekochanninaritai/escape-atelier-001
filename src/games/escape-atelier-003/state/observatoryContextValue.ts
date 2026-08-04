import { createContext } from 'react';
import type { ObservatoryAction, ObservatoryGameState } from '../types';

export type ObservatoryContextValue = {
  state: ObservatoryGameState;
  dispatch: React.Dispatch<ObservatoryAction>;
  message: string | null;
  showMessage: (message: string) => void;
};

export const ObservatoryContext = createContext<ObservatoryContextValue | null>(null);
