import { useState } from 'react';
import './GameImage.css';

type GameImageProps = {
  src: string;
  alt: string;
  fallbackLabel: string;
  className?: string;
  decorative?: boolean;
};

export function GameImage({ src, alt, fallbackLabel, className, decorative = false }: GameImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed) {
    return (
      <div className={`gameImageFallback ${className ?? ''}`} role={decorative ? 'presentation' : 'img'} aria-label={decorative ? undefined : fallbackLabel}>
        <span>{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <span className={`gameImageWrap ${className ?? ''} ${loaded ? 'loaded' : ''}`}>
      {!loaded && <span className="imageLoading">読み込み中</span>}
      <img src={src} alt={decorative ? '' : alt} loading="lazy" decoding="async" onLoad={() => setLoaded(true)} onError={() => setFailed(true)} draggable={false} />
    </span>
  );
}
