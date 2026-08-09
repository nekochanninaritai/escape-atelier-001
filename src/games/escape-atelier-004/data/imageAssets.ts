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
  diaryPiece01: asset('item-diary-piece-01.webp'),
  diaryPiece02: asset('item-diary-piece-02.webp'),
  diaryPiece03: asset('item-diary-piece-03.webp'),
  sealedLetter: asset('item-sealed-letter.webp'),
  heatedLetter: asset('item-heated-letter.webp'),
  openedLetter: asset('item-opened-letter.webp'),
  paperKnife: asset('item-paper-knife.webp'),
  inkRibbon: asset('item-ink-ribbon.webp'),
  cipherSheet: asset('item-cipher-sheet.webp'),
  transparentSheet: asset('item-transparent-sheet.webp'),
  typedPaper: asset('item-typed-paper.webp'),
  overlayClue: asset('item-overlay-clue.webp'),
  studyKey: asset('item-study-key.webp'),
} as const;
