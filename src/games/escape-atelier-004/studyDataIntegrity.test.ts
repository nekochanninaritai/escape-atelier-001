import { describe, expect, it } from 'vitest';
import { studyAudioAssets } from './data/audioAssets';
import { studyClues } from './data/clues';
import { studyHints } from './data/hints';
import { studyImages, studyItemImages } from './data/imageAssets';
import { studyItemCombineRules } from './data/itemCombineRules';
import { studyItemUseRules } from './data/itemUseRules';
import { studyItems } from './data/items';
import { BOOK_CLUE, FINAL_TIME, GLOBE_DIRECTION_SEQUENCE, TYPEWRITER_ANSWER, TYPEWRITER_ENCODED_TEXT, expandGlobeSequence } from './data/puzzles';
import { studyPuzzleRewards } from './data/puzzleRewards';
import { studyHotspots, studySceneDefinitions } from './data/scenes';
import type { StudyItemId, StudyPuzzleId, StudySceneId } from './types';

const publicImages = import.meta.glob('/public/assets/escape-atelier-004/*.webp');
const publicAudio = import.meta.glob('/public/assets/escape-atelier-004/audio/*.wav');

const assetBasename = (src: string) => new URL(src, 'https://example.test').pathname.split('/').at(-1) ?? src;
const hasGlobAsset = (glob: Record<string, unknown>, filename: string) => Object.keys(glob).some((path) => path.endsWith(`/${filename}`));

describe('Escape Atelier #004 production data integrity', () => {
  it('keeps all referenced scene and item images available in public assets', () => {
    const imageNames = [
      ...Object.values(studyImages).map(assetBasename),
      ...Object.values(studyItemImages).map(assetBasename),
    ];

    expect(new Set(imageNames).size).toBe(imageNames.length);
    imageNames.forEach((imageName) => {
      expect(hasGlobAsset(publicImages, imageName), imageName).toBe(true);
    });
  });

  it('keeps all referenced audio files available when a source is declared', () => {
    studyAudioAssets.forEach((asset) => {
      if (!asset.src) return;
      expect(hasGlobAsset(publicAudio, assetBasename(asset.src)), asset.id).toBe(true);
    });
  });

  it('does not expose progression clues from main-room hotspots before their puzzle rewards', () => {
    expect(studyHotspots.map((hotspot) => hotspot.clueIdOnInspect).filter(Boolean)).toEqual([]);
  });

  it('points scenes, item rules, clues, hints, and rewards at defined ids', () => {
    const sceneIds = new Set(Object.keys(studySceneDefinitions) as StudySceneId[]);
    const itemIds = new Set(Object.keys(studyItems) as StudyItemId[]);
    const puzzleIds = new Set(Object.keys(studyPuzzleRewards) as StudyPuzzleId[]);
    const clueIds = new Set(Object.keys(studyClues));

    studyHotspots.forEach((hotspot) => {
      if (hotspot.targetScene) expect(sceneIds.has(hotspot.targetScene)).toBe(true);
    });
    studyItemUseRules.forEach((rule) => expect(itemIds.has(rule.itemId as StudyItemId), rule.id).toBe(true));
    studyItemCombineRules.forEach((rule) => {
      rule.itemIds.forEach((itemId) => expect(itemIds.has(itemId as StudyItemId), rule.id).toBe(true));
      rule.resultItemIds?.forEach((itemId) => expect(itemIds.has(itemId as StudyItemId), rule.id).toBe(true));
    });
    Object.values(studyItems).forEach((item) => {
      if (item.clueIdOnInspect) expect(clueIds.has(item.clueIdOnInspect), item.id).toBe(true);
    });
    Object.values(studyClues).forEach((clue) => {
      clue.relatedItemIds?.forEach((itemId) => expect(itemIds.has(itemId as StudyItemId), clue.id).toBe(true));
      clue.relatedPuzzleIds?.forEach((puzzleId) => expect(puzzleIds.has(puzzleId as StudyPuzzleId), clue.id).toBe(true));
      clue.relatedSceneIds?.forEach((sceneId) => expect(sceneIds.has(sceneId as StudySceneId), clue.id).toBe(true));
    });
    Object.entries(studyHints).forEach(([puzzleId, hints]) => {
      expect(puzzleIds.has(puzzleId as StudyPuzzleId)).toBe(true);
      expect(hints).toHaveLength(3);
    });
  });

  it('keeps notebook and hint text aligned with canonical puzzle answers', () => {
    expect(studyClues['opened-letter-directions'].detail).toContain(GLOBE_DIRECTION_SEQUENCE.map((entry) => `${entry.direction.toUpperCase()} ${entry.count}`).join(' / '));
    expect(studyHints.globe[2]).toContain(expandGlobeSequence(GLOBE_DIRECTION_SEQUENCE).map((direction) => direction[0].toUpperCase()).join(' '));
    expect(studyHints.typewriter[2]).toContain(TYPEWRITER_ANSWER);
    expect(studyClues['cipher-table'].detail).toContain(TYPEWRITER_ENCODED_TEXT);
    expect(studyHints.bookshelf[0]).toContain(`BOOK ${BOOK_CLUE.bookNumber} / PAGE ${BOOK_CLUE.page}`);
    expect(studyClues['portrait-clock'].summary).toBe(`${String(FINAL_TIME.hour).padStart(2, '0')}:${String(FINAL_TIME.minute).padStart(2, '0')}`);
  });
});
