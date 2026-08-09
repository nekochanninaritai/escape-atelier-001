import { useState } from 'react';
import { App } from './App';
import { GameProvider } from '../context/GameContext';
import { SAVE_KEY, gameConfig } from '../data/gameConfig';
import { hasSaveData } from '../services/saveService';
import { GreenhouseApp } from '../games/escape-atelier-002/GreenhouseApp';
import { GREENHOUSE_SAVE_KEY, greenhouseGameConfig } from '../games/escape-atelier-002/data/gameConfig';
import { GreenhouseProvider } from '../games/escape-atelier-002/state/GreenhouseContext';
import { hasGreenhouseSaveData } from '../games/escape-atelier-002/state/saveService';
import { ObservatoryApp } from '../games/escape-atelier-003/ObservatoryApp';
import { OBSERVATORY_SAVE_KEY, observatoryGameConfig } from '../games/escape-atelier-003/data/gameConfig';
import { ObservatoryProvider } from '../games/escape-atelier-003/state/ObservatoryContext';
import { hasObservatorySaveData } from '../games/escape-atelier-003/state/saveService';
import { StudyApp, type StudyLaunchMode } from '../games/escape-atelier-004/StudyApp';
import { STUDY_SAVE_KEY, studyGameConfig } from '../games/escape-atelier-004/gameConfig';
import { StudyProvider } from '../games/escape-atelier-004/state/StudyContext';
import { hasStudySaveData } from '../games/escape-atelier-004/state/saveService';
import './SeriesApp.css';

type EpisodeId = 'series' | '001' | '002' | '003' | '004';
type PlayableEpisodeId = Exclude<EpisodeId, 'series'>;

type EpisodeCard = {
  id: PlayableEpisodeId;
  episode: string;
  title: string;
  subtitle: string;
  thumbnailLabel: string;
  saveKey: string;
  hasSave: () => boolean;
};

const episodeCards: EpisodeCard[] = [
  { id: '001', episode: gameConfig.episode, title: gameConfig.title, subtitle: '音楽', thumbnailLabel: 'Music Room', saveKey: SAVE_KEY, hasSave: hasSaveData },
  { id: '002', episode: greenhouseGameConfig.episode, title: greenhouseGameConfig.title, subtitle: '植物', thumbnailLabel: 'Greenhouse', saveKey: GREENHOUSE_SAVE_KEY, hasSave: hasGreenhouseSaveData },
  { id: '003', episode: observatoryGameConfig.episode, title: observatoryGameConfig.title, subtitle: '星・時間', thumbnailLabel: 'Observatory', saveKey: OBSERVATORY_SAVE_KEY, hasSave: hasObservatorySaveData },
  { id: '004', episode: studyGameConfig.episode, title: studyGameConfig.title, subtitle: `${studyGameConfig.theme} / ${studyGameConfig.playTime}`, thumbnailLabel: 'Study', saveKey: STUDY_SAVE_KEY, hasSave: hasStudySaveData },
];

const isEpisodeId = (value: string | null): value is PlayableEpisodeId => value === '001' || value === '002' || value === '003' || value === '004';

function isClearedSave(saveKey: string) {
  try {
    const raw = window.localStorage.getItem(saveKey);
    if (!raw) return false;
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null && 'isCleared' in parsed && parsed.isCleared === true;
  } catch {
    return false;
  }
}

export function SeriesApp() {
  const [episode, setEpisode] = useState<EpisodeId>(() => {
    const stored = window.localStorage.getItem('escape-atelier-selected-game');
    return isEpisodeId(stored) ? stored : 'series';
  });
  const [studyLaunchMode, setStudyLaunchMode] = useState<StudyLaunchMode | undefined>();

  const selectEpisode = (nextEpisode: EpisodeId, launchMode?: StudyLaunchMode) => {
    setEpisode(nextEpisode);
    setStudyLaunchMode(nextEpisode === '004' ? launchMode : undefined);
    if (isEpisodeId(nextEpisode)) {
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

  if (episode === '003') {
    return (
      <ObservatoryProvider>
        <ObservatoryApp onSeriesSelect={() => selectEpisode('series')} />
      </ObservatoryProvider>
    );
  }

  if (episode === '004') {
    return (
      <StudyProvider>
        <StudyApp onSeriesSelect={() => selectEpisode('series')} launchMode={studyLaunchMode} />
      </StudyProvider>
    );
  }

  return (
    <main className="seriesSelect">
      <section className="seriesHero" aria-label="Escape Atelier">
        <p>Escape Atelier</p>
        <h1>古い洋館に残された、小さな物語をたどる</h1>
        <div className="episodeList">
          {episodeCards.map((card) => {
            const hasSave = card.hasSave();
            return (
              <article className="episodeCard" key={card.id}>
                <div className={`episodeThumb episodeThumb-${card.id}`} aria-hidden="true">
                  <span>{card.thumbnailLabel}</span>
                </div>
                <div className="episodeMeta">
                  <span>{card.episode}</span>
                  <h2>{card.title}</h2>
                  <p>{card.subtitle}</p>
                  {isClearedSave(card.saveKey) && <strong>クリア済み</strong>}
                </div>
                <div className="episodeActions">
                  <button type="button" onClick={() => selectEpisode(card.id, 'start')}>はじめから</button>
                  <button type="button" disabled={!hasSave} onClick={() => selectEpisode(card.id, 'continue')}>つづきから</button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
