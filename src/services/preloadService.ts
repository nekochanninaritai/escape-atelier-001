const loaded = new Set<string>();

export function preloadImages(urls: string[]) {
  for (const url of urls) {
    if (loaded.has(url)) continue;
    loaded.add(url);
    const image = new Image();
    image.src = url;
  }
}
