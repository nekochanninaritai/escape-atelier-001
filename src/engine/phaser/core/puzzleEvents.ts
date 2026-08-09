export const PHASER_PUZZLE_EVENTS = {
  stateChange: 'puzzle:state-change',
  complete: 'puzzle:complete',
  close: 'puzzle:close',
  error: 'puzzle:error',
} as const;

export type PhaserPuzzleEventName = (typeof PHASER_PUZZLE_EVENTS)[keyof typeof PHASER_PUZZLE_EVENTS];
