import { useEffect, useState } from 'react';
import { EndingScene } from '../scenes/EndingScene';
import { FocusScene } from '../scenes/FocusScene';
import { PrologueScene } from '../scenes/PrologueScene';
import { RoomScene } from '../scenes/RoomScene';
import { TitleScene } from '../scenes/TitleScene';
import { MessageToast } from '../components/common/MessageToast';
import { SettingsModal } from '../components/settings/SettingsModal';
import { HintModal } from '../components/game/HintModal';
import { useGame } from '../context/useGame';
import { audioService } from '../services/audioService';
import type { SceneId } from '../types/game';

const focusScenes: SceneId[] = ['piano', 'clock', 'desk', 'bookshelf', 'musicBox', 'door'];

export function App() {
  const { state } = useGame();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hintsOpen, setHintsOpen] = useState(false);

  useEffect(() => {
    const unlock = () => audioService.unlock();
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  useEffect(() => {
    if (state.currentScene === 'title') audioService.playBgm('title', state.settings);
    else if (state.currentScene === 'ending') audioService.playBgm('ending', state.settings);
    else audioService.playBgm('room', state.settings);
  }, [state.currentScene, state.settings]);

  return (
    <>
      {state.currentScene === 'title' && <TitleScene onSettings={() => setSettingsOpen(true)} />}
      {state.currentScene === 'prologue' && <PrologueScene />}
      {state.currentScene === 'room' && <RoomScene onSettings={() => setSettingsOpen(true)} onHints={() => setHintsOpen(true)} />}
      {focusScenes.includes(state.currentScene) && (
        <FocusScene sceneId={state.currentScene} onSettings={() => setSettingsOpen(true)} onHints={() => setHintsOpen(true)} />
      )}
      {state.currentScene === 'ending' && <EndingScene />}
      <MessageToast />
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
      {hintsOpen && <HintModal onClose={() => setHintsOpen(false)} />}
    </>
  );
}
