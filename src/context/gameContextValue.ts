import { createContext, type Dispatch } from 'react';
import type { GameAction, GameState } from '../types/game';

export type GameContextValue = {
  state: GameState;
  dispatch: Dispatch<GameAction>;
  message: string | null;
  showMessage: (message: string) => void;
};

export const GameContext = createContext<GameContextValue | null>(null);
