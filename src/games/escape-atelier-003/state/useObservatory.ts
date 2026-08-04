import { useContext } from 'react';
import { ObservatoryContext } from './observatoryContextValue';

export function useObservatory() {
  const value = useContext(ObservatoryContext);
  if (!value) throw new Error('useObservatory must be used inside ObservatoryProvider');
  return value;
}
