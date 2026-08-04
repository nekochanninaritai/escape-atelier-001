const asset = (name: string) => `${import.meta.env.BASE_URL}assets/escape-atelier-003/${name}`;

export const observatoryImages = {
  title: asset('title-bg.webp'),
  lowerMain: asset('observatory-lower-main.webp'),
  upperMain: asset('observatory-upper-main.webp'),
  telescope: asset('observatory-telescope.webp'),
  telescopeLensInstalled: asset('observatory-telescope-lens-installed.webp'),
  celestialGlobe: asset('observatory-celestial-globe.webp'),
  starClock: asset('observatory-star-clock.webp'),
  starClockGearInstalled: asset('observatory-star-clock-gear-installed.webp'),
  starClockActive: asset('observatory-star-clock-active.webp'),
  desk: asset('observatory-desk.webp'),
  constellationWall: asset('observatory-constellation-wall.webp'),
  moonModel: asset('observatory-moon-model.webp'),
  staircase: asset('observatory-staircase.webp'),
  skylight: asset('observatory-skylight.webp'),
  skylightDawn: asset('observatory-skylight-dawn.webp'),
  skylightOpen: asset('observatory-skylight-open.webp'),
  ending: asset('ending-bg.webp'),
};

export const observatoryItemImages = {
  platePiece1: asset('item-plate-piece-01.webp'),
  platePiece2: asset('item-plate-piece-02.webp'),
  platePiece3: asset('item-plate-piece-03.webp'),
  constellationPlate: asset('item-constellation-plate.webp'),
  brassGear: asset('item-brass-gear.webp'),
  smallLens: asset('item-small-lens.webp'),
  starRecord: asset('item-star-record.webp'),
  dawnKey: asset('item-dawn-key.webp'),
} as const;
