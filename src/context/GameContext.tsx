import { useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { gameReducer } from '../reducers/gameReducer';
import { loadGameState, saveGameState } from '../services/saveService';
import { GameContext } from './gameContextValue';

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, loadGameState);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    saveGameState(state);
  }, [state]);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      message,
      showMessage: (nextMessage: string) => {
        setMessage(nextMessage);
        window.setTimeout(() => setMessage(null), 2600);
      },
    }),
    [message, state],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
