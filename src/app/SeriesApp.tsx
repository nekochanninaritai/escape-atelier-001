import { useState } from 'react';
import { App } from './App';
import { GameProvider } from '../context/GameContext';
import { GreenhouseApp } from '../games/escape-atelier-002/GreenhouseApp';
import { GreenhouseProvider } from '../games/escape-atelier-002/state/GreenhouseContext';
import './SeriesApp.css';

type EpisodeId = 'series' | '001' | '002';

export function SeriesApp() {
  const [episode, setEpisode] = useState<EpisodeId>(() => {
    const stored = window.localStorage.getItem('escape-atelier-selected-game');
    return stored === '001' || stored === '002' ? stored : 'series';
  });

  const selectEpisode = (nextEpisode: EpisodeId) => {
    setEpisode(nextEpisode);
    if (nextEpisode === '001' || nextEpisode === '002') {
      window.localStorage.setItem('escape-atelier-selected-game', nextEpisode);
    }
  };

  if (episode === '001') {
    return (
      <GameProvider>
        <App onSeriesSelect={() => selectEpisode('series')} />
      </GameProvider>
    );
  }

  if (episode === '002') {
    return (
      <GreenhouseProvider>
        <GreenhouseApp onSeriesSelect={() => selectEpisode('series')} />
      </GreenhouseProvider>
    );
  }

  return (
    <main className="seriesSelect">
      <section className="seriesHero" aria-label="Escape Atelier">
        <p>Escape Atelier</p>
        <h1>閉ざされた部屋に、静かな物語を。</h1>
        <div className="episodeList">
          <button type="button" onClick={() => selectEpisode('001')}>
            <span>#001</span>
            音楽室からの脱出
          </button>
          <button type="button" onClick={() => selectEpisode('002')}>
            <span>#002</span>
            黄昏の温室からの脱出
          </button>
        </div>
      </section>
    </main>
  );
}
