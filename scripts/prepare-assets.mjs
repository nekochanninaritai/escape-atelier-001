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

const sheetStaff = (x, y, w, gap = 28) =>
  Array.from({ length: 5 }, (_, i) => `<line x1="${x}" y1="${y + i * gap}" x2="${x + w}" y2="${y + i * gap}" stroke="#4b3423" stroke-width="5" opacity=".82"/>`).join('');
const note = (cx, cy) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="24" ry="17" fill="#2e1d13" transform="rotate(-18 ${cx} ${cy})"/><line x1="${cx + 20}" y1="${cy - 6}" x2="${cx + 20}" y2="${cy - 116}" stroke="#2e1d13" stroke-width="7" stroke-linecap="round"/>`;
const clueIcon = (kind, x, y) => {
  if (kind === 'piano') return `<path d="M${x} ${y + 35} h92 v24 h-92z M${x + 12} ${y + 35} v24 M${x + 28} ${y + 35} v24 M${x + 44} ${y + 35} v24 M${x + 60} ${y + 35} v24 M${x + 76} ${y + 35} v24" fill="none" stroke="#7b552e" stroke-width="6"/><path d="M${x + 5} ${y + 4} c28 -18 64 -18 82 8 v26 h-87z" fill="none" stroke="#7b552e" stroke-width="7"/>`;
  if (kind === 'book') return `<path d="M${x} ${y} q36 -18 72 0 v78 q-36 -18 -72 0z M${x + 72} ${y} q36 -18 72 0 v78 q-36 -18 -72 0z" fill="none" stroke="#7b552e" stroke-width="7"/>`;
  return `<path d="M${x + 26} ${y} h70 v110 h-70z M${x + 48} ${y + 50} h10" fill="none" stroke="#7b552e" stroke-width="7"/>`;
};

const sheetPiece = (label, clip, notes, icon) => svg(`
  <rect width="768" height="768" fill="none"/>
  <path d="${clip}" fill="url(#paper)" stroke="#6f4c2b" stroke-width="8" filter="url(#paperNoise)"/>
  ${sheetStaff(118, 318, 540)}
  ${notes}
  <path d="M${label === 1 ? 252 : label === 2 ? 338 : 428} 178 q40 26 82 0" fill="none" stroke="#8b6538" stroke-width="9" opacity=".7"/>
  ${icon}
`);

const fullSheet = (complete) => svg(`
  <rect width="768" height="768" fill="none"/>
  <path d="M108 154 C168 126 240 151 300 134 C408 102 504 130 660 158 L642 590 C528 622 420 596 314 622 C236 641 165 613 104 594 Z" fill="url(#paper)" stroke="#6f4c2b" stroke-width="8" filter="url(#paperNoise)"/>
  ${sheetStaff(148, 314, 472)}
  ${complete ? `${note(220, 426)}${note(308, 370)}${note(396, 314)}${note(484, 370)}${note(572, 398)}` : `${note(220, 426)}${note(308, 370)}<rect x="370" y="285" width="156" height="150" fill="#e8d2a0" stroke="#8b6538" stroke-width="5" stroke-dasharray="12 10"/>${note(572, 398)}`}
`, 768, 768);

const combinedPaperFront = () => svg(`
  <rect width="768" height="768" fill="none"/>
  <path d="M104 154 C168 126 240 151 300 134 C408 102 504 130 660 158 L642 590 C528 622 420 596 314 622 C236 641 165 613 104 594 Z" fill="url(#paper)" stroke="#6f4c2b" stroke-width="8" filter="url(#paperNoise)"/>
  <path d="M332 146 C352 266 345 418 360 610 M506 151 C484 262 510 432 496 600" fill="none" stroke="#8a6237" stroke-width="4" stroke-dasharray="14 12" opacity=".8"/>
  ${sheetStaff(146, 320, 470)}
  <path d="M186 426 q50 -28 100 0 t100 0 t100 0 t100 0" fill="none" stroke="#3f2a19" stroke-width="7" opacity=".75"/>
  <circle cx="234" cy="430" r="15" fill="#3f2a19"/><circle cx="388" cy="430" r="15" fill="#3f2a19"/><circle cx="540" cy="430" r="15" fill="#3f2a19"/>
  <path d="M170 224 c36 -24 88 -22 118 10 v42 h-118z M184 276 h92 M198 276 v32 M226 276 v32 M254 276 v32" fill="none" stroke="#7b552e" stroke-width="7"/>
  <path d="M330 224 q34 -18 68 0 v88 q-34 -18 -68 0z M398 224 q34 -18 68 0 v88 q-34 -18 -68 0z" fill="none" stroke="#7b552e" stroke-width="7"/>
  <path d="M528 214 h78 v116 h-78z M552 272 h12" fill="none" stroke="#7b552e" stroke-width="7"/>
`);

const combinedPaperBack = () => svg(`
  <rect width="768" height="768" fill="none"/>
  <path d="M104 154 C168 126 240 151 300 134 C408 102 504 130 660 158 L642 590 C528 622 420 596 314 622 C236 641 165 613 104 594 Z" fill="url(#paper)" stroke="#6f4c2b" stroke-width="8" filter="url(#paperNoise)"/>
  <path d="M332 146 C352 266 345 418 360 610 M506 151 C484 262 510 432 496 600" fill="none" stroke="#8a6237" stroke-width="4" stroke-dasharray="14 12" opacity=".55"/>
  <circle cx="384" cy="354" r="134" fill="none" stroke="#4f6b58" stroke-width="18"/>
  <ellipse cx="384" cy="354" rx="58" ry="134" fill="none" stroke="#4f6b58" stroke-width="10"/>
  <path d="M254 326 h260 M254 382 h260 M384 220 v268" stroke="#4f6b58" stroke-width="10" stroke-linecap="round"/>
  <path d="M312 518 h144 M342 490 v56 h84 v-56" fill="none" stroke="#7b552e" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M282 568 h204" stroke="#7b552e" stroke-width="18" stroke-linecap="round"/>
`);

const globeScene = (open = false) => svg(`
  <rect width="1080" height="1920" fill="#261812"/>
  <defs>
    <radialGradient id="globeBlue" cx=".38" cy=".28" r=".72">
      <stop stop-color="#6d8f83"/>
      <stop offset=".48" stop-color="#315b52"/>
      <stop offset="1" stop-color="#162b28"/>
    </radialGradient>
    <linearGradient id="shelf" x1="0" x2="1">
      <stop stop-color="#3b2215"/><stop offset=".5" stop-color="#744728"/><stop offset="1" stop-color="#25150e"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="1080" height="1920" fill="#201611"/>
  <rect x="120" y="120" width="840" height="1450" rx="20" fill="url(#wood)" stroke="#9b6b35" stroke-width="16"/>
  ${[320, 580, 840, 1100, 1360].map((y) => `<rect x="156" y="${y}" width="768" height="38" fill="url(#shelf)"/>`).join('')}
  ${Array.from({ length: 32 }, (_, i) => {
    const x = 170 + (i % 8) * 92;
    const y = 160 + Math.floor(i / 8) * 260;
    const h = 120 + (i % 3) * 24;
    return `<rect x="${x}" y="${y}" width="42" height="${h}" rx="5" fill="${i % 2 ? '#314b3f' : '#7a4225'}" opacity=".85"/><rect x="${x + 10}" y="${y + 18}" width="22" height="5" fill="#b88a45" opacity=".65"/>`;
  }).join('')}
  <ellipse cx="540" cy="820" rx="250" ry="250" fill="url(#globeBlue)" stroke="#b98b43" stroke-width="20"/>
  <path d="M330 760 C440 700 585 720 748 650 M326 868 C470 810 610 878 750 808 M408 610 C450 748 452 908 398 1024 M540 580 C514 730 518 900 548 1062 M674 632 C616 758 638 916 700 1004" fill="none" stroke="#d4bd78" stroke-width="8" opacity=".62"/>
  <path d="M302 1034 C418 1106 638 1116 776 1038" fill="none" stroke="#b98b43" stroke-width="20"/>
  <path d="M540 1078 v190" stroke="#b98b43" stroke-width="30"/>
  <path d="M354 1268 h372 q28 0 34 30 l24 128 h-488 l24 -128 q6 -30 34 -30z" fill="url(#gold)" stroke="#5a3918" stroke-width="12"/>
  ${open ? `
    <path d="M350 1270 h375 l-44 118 h-288z" fill="#2d1b11" opacity=".92"/>
    <path d="M436 1332 h154" stroke="#d0a752" stroke-width="16" stroke-linecap="round"/>
    <circle cx="474" cy="1328" r="34" fill="none" stroke="#e2c267" stroke-width="18"/>
    <circle cx="552" cy="1328" r="34" fill="none" stroke="#e2c267" stroke-width="18"/>
    <rect x="504" y="1348" width="24" height="92" rx="10" fill="#d0a752"/>
  ` : ''}
  <path d="M188 220 C390 144 708 146 902 260" fill="none" stroke="#e0ad5c" stroke-width="9" opacity=".32"/>
`, 1080, 1920);

const itemSvgs = {
  'src/assets/images/items/item-sheet-piece-01.webp': sheetPiece(1, 'M104 170 C178 134 262 170 338 138 L362 618 C278 642 198 604 112 630 Z', `${note(196, 426)}${note(292, 370)}`, clueIcon('piano', 126, 188)),
  'src/assets/images/items/item-sheet-piece-02.webp': sheetPiece(2, 'M238 140 C326 176 430 120 520 154 L536 612 C438 578 354 640 254 604 Z', `${note(350, 314)}${note(458, 370)}`, clueIcon('book', 312, 188)),
  'src/assets/images/items/item-sheet-piece-03.webp': sheetPiece(3, 'M420 150 C506 124 596 170 662 142 L628 632 C558 606 500 638 430 606 Z', `${note(560, 398)}`, clueIcon('door', 506, 176)),
  'src/assets/images/items/item-combined-paper-front.webp': combinedPaperFront(),
  'src/assets/images/items/item-combined-paper-back.webp': combinedPaperBack(),
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

const extraSceneSvgs = {
  'src/assets/images/scenes/room-globe.webp': globeScene(false),
  'src/assets/images/states/room-globe-open.webp': globeScene(true),
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

async function renderSceneSvgs(entries) {
  for (const [target, source] of Object.entries(entries)) {
    await ensureDir(target);
    await sharp(source).resize(1080, 1920, { fit: 'cover' }).webp({ quality: 78, effort: 5 }).toFile(path.join(root, target));
  }
}

await convertScenes();
await renderSceneSvgs(extraSceneSvgs);
await renderSvgs(itemSvgs);
await renderSvgs(puzzleSvgs);
