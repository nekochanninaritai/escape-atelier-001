import { createContext } from 'react';
import type { GreenhouseAction, GreenhouseGameState } from '../types';

export type GreenhouseContextValue = {
  state: GreenhouseGameState;
  dispatch: React.Dispatch<GreenhouseAction>;
  message: string | null;
  showMessage: (message: string) => void;
};

export const GreenhouseContext = createContext<GreenhouseContextValue | null>(null);
