import { GameShell } from '../components/game/GameShell';
import { ImageStage } from '../components/game/ImageStage';
import { roomHotspots } from '../data/scenes';
import { useGame } from '../context/useGame';

export function RoomScene({ onSettings, onHints }: { onSettings: () => void; onHints: () => void }) {
  const { dispatch, showMessage } = useGame();

  return (
    <GameShell onSettings={onSettings} onHints={onHints}>
      <ImageStage
        label="音楽室"
        variant="room"
        hotspots={roomHotspots}
        onHotspot={(hotspot) => {
          dispatch({ type: 'INSPECT', pointId: hotspot.id });
          if (hotspot.targetScene) dispatch({ type: 'GO_SCENE', scene: hotspot.targetScene });
          else showMessage('気になる場所だ。');
        }}
      >
        <div className="stageLabel">夕暮れの音楽室</div>
      </ImageStage>
    </GameShell>
  );
}
