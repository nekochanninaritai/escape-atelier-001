import type { Hotspot } from '../../types/game';
import { DEBUG_HOTSPOTS } from '../../data/gameConfig';
import './ImageStage.css';

type ImageStageProps = {
  label: string;
  variant: string;
  hotspots?: Hotspot[];
  onHotspot?: (hotspot: Hotspot) => void;
  children?: React.ReactNode;
};

export function ImageStage({ label, variant, hotspots = [], onHotspot, children }: ImageStageProps) {
  return (
    <section className={`imageStage imageStage-${variant}`} aria-label={label}>
      <div className="roomArt" aria-hidden="true">
        <div className="windowGlow" />
        <div className="floorLines" />
      </div>
      {children}
      {hotspots.map((hotspot) => (
        <button
          key={hotspot.id}
          type="button"
          className={`hotspot ${DEBUG_HOTSPOTS ? 'hotspotDebug' : ''}`}
          style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, width: `${hotspot.width}%`, height: `${hotspot.height}%` }}
          onClick={() => onHotspot?.(hotspot)}
          aria-label={hotspot.label}
        >
          <span>{DEBUG_HOTSPOTS ? hotspot.label : ''}</span>
        </button>
      ))}
    </section>
  );
}
