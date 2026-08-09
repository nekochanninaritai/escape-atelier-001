import { useContext } from 'react';
import { StudyContext } from './studyContextValue';

export function useStudy() {
  const value = useContext(StudyContext);
  if (!value) throw new Error('useStudy must be used inside StudyProvider');
  return value;
}
