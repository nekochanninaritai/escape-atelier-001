const asset = (name: string) => `${import.meta.env.BASE_URL}assets/escape-atelier-002/${name}`;

export const greenhouseImages = {
  title: asset('title-bg.webp'),
  main: asset('greenhouse-main.webp'),
  tree: asset('greenhouse-tree.webp'),
  treeBloomed: asset('greenhouse-tree-bloomed.webp'),
  pots: asset('greenhouse-pot-shelf.webp'),
  fountain: asset('greenhouse-fountain.webp'),
  fountainUsed: asset('greenhouse-fountain-used.webp'),
  workbench: asset('greenhouse-workbench.webp'),
  mirrorDevice: asset('greenhouse-mirror-device.webp'),
  door: asset('greenhouse-door.webp'),
  doorOpen: asset('greenhouse-door-open.webp'),
  statue: asset('greenhouse-statue.webp'),
  ending: asset('ending-bg.webp'),
};

export const greenhouseItemImages = {
  canPiece1: asset('item-can-piece-01.webp'),
  canPiece2: asset('item-can-piece-02.webp'),
  canPiece3: asset('item-can-piece-03.webp'),
  wateringCan: asset('item-watering-can.webp'),
  wateredCan: asset('item-watered-can.webp'),
  flowerSeed: asset('item-flower-seed.webp'),
  smallMirror: asset('item-small-mirror.webp'),
  butterflyKey: asset('item-butterfly-key.webp'),
} as const;
