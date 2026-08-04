import { useContext } from 'react';
import { GreenhouseContext } from './greenhouseContextValue';

export function useGreenhouse() {
  const value = useContext(GreenhouseContext);
  if (!value) throw new Error('useGreenhouse must be used inside GreenhouseProvider');
  return value;
}
