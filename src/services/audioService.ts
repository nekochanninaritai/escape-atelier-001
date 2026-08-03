import type { GameSettings } from '../types/game';

const audioFiles: Record<string, string> = {
  title: 'audio/bgm-title.mp3',
  room: 'audio/bgm-room.mp3',
  ending: 'audio/bgm-ending.mp3',
  tap: 'audio/se-tap.mp3',
  item: 'audio/se-item.mp3',
  success: 'audio/se-success.mp3',
  fail: 'audio/se-fail.mp3',
  door: 'audio/se-door-open.mp3',
};

class AudioService {
  private unlocked = false;
  private currentBgm: HTMLAudioElement | null = null;
  private bgmKey: string | null = null;

  unlock() {
    this.unlocked = true;
  }

  playBgm(key: 'title' | 'room' | 'ending', settings: GameSettings) {
    if (!settings.bgmEnabled || !this.unlocked) {
      this.stopBgm();
      return;
    }
    if (this.bgmKey === key && this.currentBgm) {
      this.currentBgm.volume = settings.bgmVolume;
      return;
    }
    this.stopBgm();
    const audio = new Audio(audioFiles[key]);
    audio.loop = true;
    audio.volume = settings.bgmVolume;
    audio.play().catch(() => undefined);
    this.currentBgm = audio;
    this.bgmKey = key;
  }

  stopBgm() {
    if (this.currentBgm) {
      this.currentBgm.pause();
      this.currentBgm = null;
      this.bgmKey = null;
    }
  }

  playSe(key: keyof typeof audioFiles, settings: GameSettings) {
    if (!settings.seEnabled || !this.unlocked) return;
    const audio = new Audio(audioFiles[key]);
    audio.volume = settings.seVolume;
    audio.play().catch(() => undefined);
  }
}

export const audioService = new AudioService();
