import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SeriesApp } from './app/SeriesApp';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SeriesApp />
  </StrictMode>,
);
