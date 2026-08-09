const asset = (name: string) => `${import.meta.env.BASE_URL}assets/escape-atelier-004/${name}`;

export const studyImages = {
  title: asset('title-bg.webp'),
  main: asset('study-main.webp'),
  bookshelf: asset('study-bookshelf.webp'),
  desk: asset('study-desk.webp'),
  typewriter: asset('study-typewriter.webp'),
  fireplace: asset('study-fireplace.webp'),
  globe: asset('study-globe.webp'),
  portrait: asset('study-portrait.webp'),
  sideTable: asset('study-side-table.webp'),
  door: asset('study-door.webp'),
  doorOpen: asset('study-door-open.webp'),
  ending: asset('ending-bg.webp'),
};

export const studyItemImages = {
  diaryPage: asset('item-diary-page.webp'),
  letterFragment: asset('item-letter-fragment.webp'),
  inkRibbon: asset('item-ink-ribbon.webp'),
  transparentPaper: asset('item-transparent-paper.webp'),
  memoryKey: asset('item-memory-key.webp'),
} as const;
