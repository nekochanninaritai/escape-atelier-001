import { useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { ObservatoryContext } from './observatoryContextValue';
import { observatoryReducer } from './reducer';
import { loadObservatoryState, saveObservatoryState } from './saveService';

export function ObservatoryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(observatoryReducer, undefined, loadObservatoryState);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => saveObservatoryState(state), [state]);

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

  return <ObservatoryContext.Provider value={value}>{children}</ObservatoryContext.Provider>;
}
