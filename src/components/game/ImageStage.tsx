import type { Hotspot } from '../../types/game';
import { DEBUG_HOTSPOTS } from '../../data/gameConfig';
import { GameImage } from '../common/GameImage';
import './ImageStage.css';

type ImageStageProps = {
  label: string;
  variant: string;
  src: string;
  alt: string;
  hotspots?: Hotspot[];
  onHotspot?: (hotspot: Hotspot) => void;
  children?: React.ReactNode;
};

export function ImageStage({ label, variant, src, alt, hotspots = [], onHotspot, children }: ImageStageProps) {
  return (
    <section className={`imageStage imageStage-${variant}`} aria-label={label}>
      <GameImage src={src} alt={alt} fallbackLabel={label} className="stageImage" />
      <div className="stageVignette" aria-hidden="true" />
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
