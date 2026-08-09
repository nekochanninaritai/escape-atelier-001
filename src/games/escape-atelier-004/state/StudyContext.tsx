import { useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { StudyContext } from './studyContextValue';
import { studyReducer } from './reducer';
import { loadStudyState, saveStudyState } from './saveService';

export function StudyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(studyReducer, undefined, loadStudyState);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => saveStudyState(state), [state]);

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

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}
