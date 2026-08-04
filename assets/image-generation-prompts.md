# Escape Atelier #001 Image Generation Prompts

## Common Art Direction

- Antique Western mansion music room at sunset.
- Warm, quiet, elegant, slightly mysterious, never horror.
- Main colors: ivory, sepia, dark walnut, antique gold, deep moss green, dark navy, sunset orange.
- No people, silhouettes, ghosts, blood, modern appliances, logos, watermarks, or UI text in images.
- Puzzle-critical text, numbers, note names, and answer information must be rendered in React/SVG/CSS, not baked into generated images.

## Current Asset Workflow

The repository currently uses optimized WebP assets under `src/assets/images`. Assets that need exact puzzle information are generated from deterministic SVG inside `scripts/prepare-assets.mjs` and converted with `sharp`.

Run:

```bash
node scripts/prepare-assets.mjs
```

## Paper And Globe Flow Assets

### `item-combined-paper-front.webp`

- Path: `src/assets/images/items/item-combined-paper-front.webp`
- Purpose: front side of the paper made by joining fragments A/B/C
- Recommended size: `768 x 768px`
- Format: WebP
- Current implementation: generated from SVG in `scripts/prepare-assets.mjs`
- Prompt:

```text
An antique sheet of paper made from three torn fragments joined together, visible seams between left, center, and right pieces, warm ivory parchment texture, faint five-line staff decoration and small antique room motifs, no readable words, no exact piano answer, centered on transparent or neutral background, elegant escape-game item art, 1:1.
```

### `item-combined-paper-back.webp`

- Path: `src/assets/images/items/item-combined-paper-back.webp`
- Purpose: back side of the joined paper; shows the globe mark clue
- Recommended size: `768 x 768px`
- Format: WebP
- Current implementation: generated from SVG in `scripts/prepare-assets.mjs`
- Prompt:

```text
Back side of the same joined antique paper, visible three-piece seams, warm parchment texture, one large clear globe mark drawn in muted moss green and sepia ink, no text, no letters, no extra symbols, centered item art, 1:1.
```

### `room-globe.webp`

- Path: `src/assets/images/scenes/room-globe.webp`
- Purpose: close-up of the globe on the bookshelf
- Recommended size: `1080 x 1920px`
- Format: WebP
- Current implementation: generated from SVG in `scripts/prepare-assets.mjs`
- Prompt:

```text
Close-up of an antique globe on the same bookshelf in the warm sunset music room, dark walnut shelf, brass stand, muted green and sepia globe surface without readable labels, elegant quiet atmosphere, same art direction as Escape Atelier music room, vertical 9:16, no people, no horror, no logos, no watermark, no readable text.
```

### `room-globe-open.webp`

- Path: `src/assets/images/states/room-globe-open.webp`
- Purpose: opened globe-base state revealing the winding key
- Recommended size: `1080 x 1920px`
- Format: WebP
- Difference condition: same composition as `room-globe.webp`; only the brass base opens and reveals the small winding key.
- Current implementation: generated from SVG in `scripts/prepare-assets.mjs`
- Prompt:

```text
State variant of the same antique globe close-up. Keep the same bookshelf, globe shape, brass stand, lighting, and camera angle. Only the brass base is open, revealing a small antique gold music-box winding key inside. Warm sunset light, elegant escape-game illustration, vertical 9:16, no readable text, no logos, no watermark, no people, no horror.
```

## Other Existing Generated Assets

- Scene/background WebP: `src/assets/images/backgrounds`, `src/assets/images/scenes`, `src/assets/images/states`
- Inventory item WebP: `src/assets/images/items`
- Puzzle WebP: `src/assets/images/puzzles`

When replacing any asset, keep the filename stable so `src/data/imageAssets.ts` continues to work without code changes.
