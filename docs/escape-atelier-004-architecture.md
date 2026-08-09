# Escape Atelier #004 Architecture

Escape Atelier #004 "忘れられた書斎からの脱出" is prepared as a React-owned escape game state with Phaser used only for focused operation puzzles.

Part3 finishes the public QA pass: Part2's puzzle flow remains intact, production-safe placeholder WebP/WAV assets are present, and data integrity tests cover the main progression references.

## Directories

- `src/games/escape-atelier-004/gameConfig.ts`: episode metadata, save key/version, feature flags, asset manifest.
- `src/games/escape-atelier-004/types`: state, scene, puzzle, item, action type definitions.
- `src/games/escape-atelier-004/state`: initial state, reducer, save/load/normalize, conditions, puzzle rewards.
- `src/games/escape-atelier-004/data`: scenes, hotspots, items, item rules, clues, hints, messages, image/audio asset manifests, puzzle rewards.
- `src/games/escape-atelier-004/puzzles`: Phaser puzzle config factories.

## State

`StudyGameState` is the single source of truth. React owns scene flow, inventory, flags, puzzle progress, notebook clues, investigation log, settings, save data, and clear state.

Phaser receives only `initialState` and returns `onStateChange` / `onComplete`.

## Canonical IDs

Scene IDs include `study-main`, `exit-door`, and the bookshelf sub-scenes `bookshelf-left`, `bookshelf-center`, `bookshelf-right`.

Puzzle IDs are `diary-repair`, `globe`, `typewriter`, `overlay-paper`, `bookshelf`, and `portrait-time`.

Legacy save IDs such as `study`, `door`, `diaryRestore`, `memoryGlobe`, `paperOverlay`, and `typewriterCode` are normalized on load.

## Save

The #004 save key is `escape-atelier-004-save`.

Save data is serialized with `STUDY_SAVE_VERSION`. `normalizeStudyState` repairs missing fields, legacy IDs, unknown item/clue/puzzle/scene IDs, invalid puzzle positions, duplicate lists, and settings ranges where safe.

## Production Notes

- Main-room hotspots must not reveal final notebook clues directly. Progression clues are discovered through item inspection, puzzle rewards, or gated scene actions.
- `studyGameConfig.features.debugPanel` follows `VITE_DEBUG_HOTSPOTS` and is off by default in production.
- Scene and item images live in `public/assets/escape-atelier-004/`; audio lives in `public/assets/escape-atelier-004/audio/`.
- Phaser still owns only focused puzzle drawing/input. React owns all rewards, flags, notebook entries, save data, and scene flow.
- Canonical answers remain in `src/games/escape-atelier-004/data/puzzles.ts`.

## QA Coverage

- `studyPuzzles.test.ts`: canonical puzzle answers and pure logic.
- `studyInventory.test.ts`: item acquisition, transform, combine, notebook/log idempotency.
- `studyState.test.ts`: save normalization, reward chain, duplicate reward prevention.
- `studyDataIntegrity.test.ts`: public asset existence, audio existence, clue gating, and data cross references.
