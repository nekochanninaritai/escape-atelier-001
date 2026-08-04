import { useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { greenhouseReducer } from './reducer';
import { loadGreenhouseState, saveGreenhouseState } from './saveService';
import { GreenhouseContext } from './greenhouseContextValue';

export function GreenhouseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(greenhouseReducer, undefined, loadGreenhouseState);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => saveGreenhouseState(state), [state]);

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

  return <GreenhouseContext.Provider value={value}>{children}</GreenhouseContext.Provider>;
}
