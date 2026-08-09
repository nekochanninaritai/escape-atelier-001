# Puzzle API

## Responsibility Split

React owns game state, save/load, rewards, clues, messages, and scene flow.

Phaser owns drawing and pointer/touch input inside a puzzle surface. Phaser must not write to `localStorage` or mutate global React state.

## Wrapper

Use `src/engine/phaser/PhaserPuzzle.tsx` for puzzle overlays.

The wrapper accepts `puzzleId`, `title`, `instructions`, `initialState`, `createConfig`, `onStateChange`, `onComplete`, `onCancel` or `onClose`, and `onError`.

It creates and destroys the Phaser game, locks page scrolling while active, reports boot errors, and keeps the latest puzzle state for cancel/close.

## Common Logic

Reusable utilities live under `src/engine/phaser`:

- `interactions/drag.ts`
- `interactions/rotate.ts`
- `interactions/snap.ts`
- `interactions/overlay.ts`
- `interactions/reorder.ts`
- `interactions/selection.ts`
- `utils/geometry.ts`
- `utils/rotation.ts`
- `utils/cleanup.ts`

Pure behavior is covered by `src/engine/phaser/phaserLogic.test.ts`.

## #004 Puzzle Flow

1. Scene or item interaction opens a puzzle.
2. React passes the relevant `state.puzzleStates.*` value into `PhaserPuzzle`.
3. Phaser emits intermediate state with `onStateChange`.
4. On completion, React dispatches `SOLVE_PUZZLE` / `COMPLETE_PUZZLE`.
5. `applyPuzzleReward` applies rewards once.
6. Notebook clues, flags, items, and autosave update through React state.

## Adding a Part2 Puzzle

1. Add or update puzzle state in `types/puzzles.ts`.
2. Add data to `data/puzzles.ts`.
3. Add hints in `data/hints.ts`.
4. Add reward in `data/puzzleRewards.ts`.
5. Open it from scene data or React scene handler.
6. Return state through `onStateChange`.
7. Complete through React reducer, not Phaser side effects.

