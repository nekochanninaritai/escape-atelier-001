import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const generatedDir = 'C:/Users/Ikeda Remi/.codex/generated_images/019fc660-d3b2-7242-bcac-1849b06584bb';

const sceneTargets = [
  'src/assets/images/scenes/room-main.webp',
  'src/assets/images/backgrounds/title-bg.webp',
  'src/assets/images/scenes/room-piano.webp',
  'src/assets/images/scenes/room-bookshelf.webp',
  'src/assets/images/scenes/room-clock.webp',
  'src/assets/images/scenes/room-desk.webp',
  'src/assets/images/scenes/room-music-box.webp',
  'src/assets/images/scenes/room-door.webp',
  'src/assets/images/backgrounds/ending-bg.webp',
  'src/assets/images/states/room-desk-open.webp',
  'src/assets/images/states/room-music-box-active.webp',
  'src/assets/images/states/room-piano-open.webp',
  'src/assets/images/states/room-door-open.webp',
];

const ensureDir = async (filePath) => fs.mkdir(path.dirname(path.join(root, filePath)), { recursive: true });

const svg = (body, width = 768, height = 768) => Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <filter id="paperNoise"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="3" seed="4"/><feColorMatrix type="saturate" values=".12"/><feBlend mode="multiply" in2="SourceGraphic"/></filter>
      <linearGradient id="paper" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#f1dfb8"/><stop offset=".55" stop-color="#d8bd83"/><stop offset="1" stop-color="#b99457"/></linearGradient>
      <linearGradient id="gold" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#f7d982"/><stop offset=".45" stop-color="#af7c2d"/><stop offset="1" stop-color="#5a3918"/></linearGradient>
      <linearGradient id="wood" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#6b3f24"/><stop offset="1" stop-color="#24140d"/></linearGradient>
    </defs>${body}</svg>`,
);

const sheetStaff = (x, y, w) => Array.from({ length: 5 }, (_, i) => `<line x1="${x}" y1="${y + i * 20}" x2="${x + w}" y2="${y + i * 20}" stroke="#4b3423" stroke-width="4" opacity=".78"/>`).join('');
const note = (cx, cy) => `<ellipse cx="${cx}" cy="${cy}" rx="18" ry="13" fill="#3a271a" transform="rotate(-18 ${cx} ${cy})"/><line x1="${cx + 15}" y1="${cy - 4}" x2="${cx + 15}" y2="${cy - 90}" stroke="#3a271a" stroke-width="6" stroke-linecap="round"/>`;

const sheetPiece = (label, clip, notes) => svg(`
  <rect width="768" height="768" fill="none"/>
  <path d="${clip}" fill="url(#paper)" stroke="#6f4c2b" stroke-width="8" filter="url(#paperNoise)"/>
  ${sheetStaff(140, 300, 490)}
  ${notes}
  <circle cx="${label === 1 ? 190 : label === 2 ? 384 : 575}" cy="205" r="24" fill="none" stroke="#835b2e" stroke-width="8" opacity=".65"/>
`);

const fullSheet = (complete) => svg(`
  <rect width="768" height="768" fill="none"/>
  <path d="M108 154 C168 126 240 151 300 134 C408 102 504 130 660 158 L642 590 C528 622 420 596 314 622 C236 641 165 613 104 594 Z" fill="url(#paper)" stroke="#6f4c2b" stroke-width="8" filter="url(#paperNoise)"/>
  ${sheetStaff(165, 310, 440)}
  ${complete ? `${note(240, 390)}${note(320, 350)}${note(400, 310)}${note(480, 350)}${note(560, 370)}` : `${note(240, 390)}${note(320, 350)}<rect x="386" y="282" width="125" height="118" fill="#e8d2a0" stroke="#8b6538" stroke-width="5" stroke-dasharray="12 10"/>${note(560, 370)}`}
`, 768, 768);

const itemSvgs = {
  'src/assets/images/items/item-sheet-piece-01.webp': sheetPiece(1, 'M150 174 C230 132 292 184 326 150 L352 608 C276 634 208 604 142 628 Z', `${note(215, 390)}${note(285, 350)}`),
  'src/assets/images/items/item-sheet-piece-02.webp': sheetPiece(2, 'M236 154 C312 184 390 124 464 154 L496 604 C420 574 346 640 270 604 Z', `${note(322, 370)}${note(402, 330)}`),
  'src/assets/images/items/item-sheet-piece-03.webp': sheetPiece(3, 'M420 152 C492 124 570 172 642 146 L616 630 C548 606 486 640 434 606 Z', `${note(500, 350)}${note(574, 370)}`),
  'src/assets/images/items/item-completed-sheet.webp': fullSheet(true),
  'src/assets/images/items/item-winding-key.webp': svg(`
    <rect width="768" height="768" fill="none"/>
    <circle cx="320" cy="312" r="92" fill="none" stroke="url(#gold)" stroke-width="44"/>
    <circle cx="448" cy="312" r="92" fill="none" stroke="url(#gold)" stroke-width="44"/>
    <rect x="360" y="336" width="48" height="230" rx="20" fill="url(#gold)"/>
    <path d="M324 560 H444 L420 620 H348 Z" fill="url(#gold)" stroke="#5a3918" stroke-width="10"/>
  `),
  'src/assets/images/items/item-door-key.webp': svg(`
    <rect width="768" height="768" fill="none"/>
    <circle cx="250" cy="382" r="92" fill="none" stroke="url(#gold)" stroke-width="38"/>
    <circle cx="250" cy="382" r="30" fill="none" stroke="#5a3918" stroke-width="12" opacity=".65"/>
    <rect x="330" y="358" width="300" height="48" rx="20" fill="url(#gold)"/>
    <path d="M548 406 v72 h52 v-52 h54 v-58" fill="url(#gold)" stroke="#5a3918" stroke-width="8"/>
    <path d="M604 406 v94 h44 v-62 h38 v-32" fill="url(#gold)" stroke="#5a3918" stroke-width="8"/>
  `),
};

const puzzleSvgs = {
  'src/assets/images/puzzles/puzzle-sheet-piece-01.webp': itemSvgs['src/assets/images/items/item-sheet-piece-01.webp'],
  'src/assets/images/puzzles/puzzle-sheet-piece-02.webp': itemSvgs['src/assets/images/items/item-sheet-piece-02.webp'],
  'src/assets/images/puzzles/puzzle-sheet-piece-03.webp': itemSvgs['src/assets/images/items/item-sheet-piece-03.webp'],
  'src/assets/images/puzzles/puzzle-sheet-incomplete.webp': fullSheet(false),
  'src/assets/images/puzzles/puzzle-sheet-complete.webp': fullSheet(true),
  'src/assets/images/puzzles/puzzle-clock-face.webp': svg(`
    <rect width="768" height="768" fill="none"/>
    <circle cx="384" cy="384" r="286" fill="url(#paper)" stroke="#8f6d36" stroke-width="20" filter="url(#paperNoise)"/>
    <circle cx="384" cy="384" r="226" fill="none" stroke="#5d3e23" stroke-width="8"/>
    ${['𝄞','♩','𝅗𝅥','♪','𝄽','♯','♭'].map((s, i) => {
      const a = -Math.PI / 2 + i * Math.PI * 2 / 7;
      return `<text x="${384 + Math.cos(a) * 176}" y="${400 + Math.sin(a) * 176}" font-size="54" text-anchor="middle" fill="#3f2a19">${s}</text>`;
    }).join('')}
    <circle cx="384" cy="384" r="12" fill="#3f2a19"/>
  `),
  'src/assets/images/puzzles/puzzle-music-box-clue.webp': svg(`
    <rect width="768" height="768" fill="none"/>
    <rect x="122" y="210" width="524" height="310" rx="26" fill="url(#gold)" stroke="#5a3918" stroke-width="14"/>
    <rect x="162" y="250" width="444" height="230" rx="12" fill="#e6c783" opacity=".82"/>
    <circle cx="260" cy="365" r="42" fill="#6d431c" opacity=".55"/>
    <circle cx="384" cy="365" r="42" fill="#6d431c" opacity=".55"/>
    <circle cx="508" cy="365" r="42" fill="#6d431c" opacity=".55"/>
  `),
};

async function convertScenes() {
  const sources = (await fs.readdir(generatedDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.png'))
    .map((entry) => path.join(generatedDir, entry.name));
  const stats = await Promise.all(sources.map(async (file) => ({ file, stat: await fs.stat(file) })));
  stats.sort((a, b) => a.stat.mtimeMs - b.stat.mtimeMs);
  for (let i = 0; i < Math.min(sceneTargets.length, stats.length); i += 1) {
    await ensureDir(sceneTargets[i]);
    await sharp(stats[i].file)
      .resize(1080, 1920, { fit: 'cover', position: 'attention' })
      .webp({ quality: 78, effort: 5 })
      .toFile(path.join(root, sceneTargets[i]));
  }
}

async function renderSvgs(entries) {
  for (const [target, source] of Object.entries(entries)) {
    await ensureDir(target);
    await sharp(source).resize(768, 768, { fit: 'contain' }).webp({ quality: 86, effort: 5 }).toFile(path.join(root, target));
  }
}

await convertScenes();
await renderSvgs(itemSvgs);
await renderSvgs(puzzleSvgs);
