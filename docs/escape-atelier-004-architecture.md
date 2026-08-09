# Escape Atelier #004 Architecture

Escape Atelier #004 "忘れられた書斎からの脱出" is prepared as a React-owned escape game state with Phaser used only for focused operation puzzles.

Part1-3 completes the implementation foundation. Part2 should add final puzzle content and production assets without changing the core state shape.

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

## Part2 TODO

- [ ] Diary repair final piece data and layout.
- [ ] Letter content and memory clue final text.
- [ ] Globe final route presentation.
- [ ] Typewriter final interaction polish.
- [ ] Overlay paper production image and alignment values.
- [ ] Bookshelf puzzle implementation.
- [ ] Portrait time puzzle implementation.
- [ ] Final time to exit-door flow.
- [ ] Ending sequence.
- [ ] Production image and audio assets.

