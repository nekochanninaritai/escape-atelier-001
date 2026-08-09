import { studyAudioAssets } from '../data/audioAssets';
import type { StudyGameState } from '../types';

type StudyAudioId = (typeof studyAudioAssets)[number]['id'];
type StudyAudioSettings = StudyGameState['settings'];

const audioSources = Object.fromEntries(studyAudioAssets.flatMap((asset) => (asset.src ? [[asset.id, asset.src]] : []))) as Partial<Record<StudyAudioId, string>>;

class StudyAudioService {
  private currentBgm: HTMLAudioElement | null = null;
  private currentBgmId: StudyAudioId | null = null;

  playBgm(id: StudyAudioId, settings: StudyAudioSettings) {
    if (!settings.bgmEnabled) {
      this.stopBgm();
      return;
    }
    const src = audioSources[id];
    if (!src) return;
    if (this.currentBgmId === id && this.currentBgm) {
      this.currentBgm.volume = settings.bgmVolume;
      return;
    }
    this.stopBgm();
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = settings.bgmVolume;
    audio.play().catch(() => undefined);
    this.currentBgm = audio;
    this.currentBgmId = id;
  }

  playSe(id: StudyAudioId, settings: StudyAudioSettings) {
    if (!settings.seEnabled) return;
    const src = audioSources[id];
    if (!src) return;
    const audio = new Audio(src);
    audio.volume = settings.seVolume;
    audio.play().catch(() => undefined);
  }

  stopBgm() {
    if (!this.currentBgm) return;
    this.currentBgm.pause();
    this.currentBgm.currentTime = 0;
    this.currentBgm = null;
    this.currentBgmId = null;
  }
}

export const studyAudioService = new StudyAudioService();
