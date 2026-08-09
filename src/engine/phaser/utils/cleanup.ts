import type Phaser from 'phaser';

export function destroyPhaserGame(game: Phaser.Game | null): void {
  game?.destroy(true);
}
