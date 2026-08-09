import { canSnapPiece, type SnapCheck } from './snap';

export type OverlayAlignment = SnapCheck & {
  opacity?: number;
  minOpacity?: number;
};

export function isOverlayAligned({ opacity = 1, minOpacity = 0, ...snapCheck }: OverlayAlignment): boolean {
  return opacity >= minOpacity && canSnapPiece(snapCheck);
}
