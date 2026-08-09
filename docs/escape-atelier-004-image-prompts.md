# Escape Atelier #004 Image Asset Notes

The current production pass uses an AI-generated main study illustration as the source for background and focus-scene WebP assets in `public/assets/escape-atelier-004/`. Item icons remain puzzle-safe symbolic assets. No answer words, numbers, or readable puzzle data are baked into the images.

The source generation prompt was:

```text
Antique Western mansion study for a quiet escape room about books and memory. Large bookcase, writing desk, vintage typewriter, fireplace, antique globe, framed portrait, side table, and exit door all clearly visible and separated for clickable hotspots. Atmospheric escape room game background, detailed hand-painted digital illustration, slightly realistic but stylized, cinematic soft lighting, elegant interior, warm fireplace glow, brass highlights, dark walnut, antique gold, deep red, ivory, brass. No people, no UI, no readable text, no numbers, no letters, no watermark, no puzzle answers.
```

Use these prompts when replacing or regenerating the assets.

## Shared Direction

- Style: polished digital illustration for a quiet antique Western mansion escape game.
- Palette: dark walnut, antique gold, deep red, ivory, brass, warm fireplace light.
- Mood: warm, still, a little wistful, not horror.
- Constraints: no readable text, no numbers, no watermarks, no UI, no puzzle answer embedded in the image.
- Size: 1280x720 for scenes, 320x320 for item icons.

## Scene Assets

| filename | purpose | prompt |
| --- | --- | --- |
| `title-bg.webp` | title/prologue background | Antique study in an old mansion, large bookcase, writing desk, typewriter, fireplace glow, globe, portrait, exit door, warm cinematic illustration, no readable text. |
| `study-main.webp` | main exploration room | Wide view of the whole antique study with all major interactable objects clearly separated, warm brass highlights, no readable text. |
| `study-bookshelf.webp` | bookshelf focus | Large old bookcase with leather-bound books and brass details, some gaps, clear shelves, no readable text or numbers. |
| `study-desk.webp` | desk focus | Antique writing desk with lamp, papers, drawer, paper knife silhouette, quiet warm light, no readable text. |
| `study-typewriter.webp` | typewriter focus | Vintage black typewriter on a wooden desk, ivory paper inserted but blank or unreadable, brass accents. |
| `study-fireplace.webp` | fireplace focus | Stone fireplace with low warm embers, mantle details, safe non-horror atmosphere. |
| `study-globe.webp` | globe focus | Antique globe on brass stand, decorative route lines but no readable labels. |
| `study-portrait.webp` | portrait focus | Framed portrait above dark wood paneling, gentle expression, hidden mechanism implied, no readable inscription. |
| `study-side-table.webp` | side table focus | Small side table with ivory envelopes, sealing wax, drawer, warm shadows. |
| `study-door.webp` | exit door closed | Heavy wooden door with brass keyhole, closed, warm light around frame. |
| `study-door-open.webp` | exit door open | Same door partly open with soft dawn-colored light beyond, no exterior detail required. |
| `ending-bg.webp` | ending background | Quiet study after escape, dawn light and typewriter, peaceful conclusion, no readable text. |

## State Difference Assets

State assets should change only the relevant object state: `study-desk-diary-restored.webp`, `study-globe-open.webp`, `study-typewriter-ready.webp`, `study-typewriter-paper.webp`, `study-portrait-shifted.webp`, `study-portrait-open.webp`, and bookshelf split images.

## Item Icons

Use clear object silhouettes on warm neutral backgrounds. Keep all puzzle text and numbers out of the image; the item description and notebook carry the readable data.
