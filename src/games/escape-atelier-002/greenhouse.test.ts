import { describe, expect, it } from 'vitest';
import { GREENHOUSE_SAVE_KEY } from './data/gameConfig';
import { areMirrorAnglesSolved, flowerColorAnswer, isCorrectFlowerSequence, isCorrectPotOrder, mirrorDefinitions } from './data/puzzles';
import { greenhouseInitialState } from './state/initialState';
import { greenhouseReducer } from './state/reducer';

describe('Escape Atelier #002 state and puzzle logic', () => {
  it('uses a separated save key', () => {
    expect(GREENHOUSE_SAVE_KEY).toBe('escape-atelier-002-save');
    expect(GREENHOUSE_SAVE_KEY).not.toBe('escape-atelier-001-save');
  });

  it('creates the expected initial state', () => {
    expect(greenhouseInitialState.currentScene).toBe('title');
    expect(greenhouseInitialState.inventory).toEqual([]);
    expect(greenhouseInitialState.puzzleStates.plantPots.order).toHaveLength(4);
  });

  it('prevents duplicate item rewards', () => {
    const once = greenhouseReducer(greenhouseInitialState, { type: 'COLLECT_ITEM', itemId: 'canPiece1' });
    const twice = greenhouseReducer(once, { type: 'COLLECT_ITEM', itemId: 'canPiece1' });
    expect(twice.inventory).toEqual(['canPiece1']);
    expect(twice.collectedItems).toEqual(['canPiece1']);
  });

  it('checks flower color order', () => {
    expect(isCorrectFlowerSequence([...flowerColorAnswer])).toBe(true);
    expect(isCorrectFlowerSequence(['blue', 'red', 'white', 'yellow'])).toBe(false);
  });

  it('checks plant pot order', () => {
    expect(isCorrectPotOrder(['pot-short', 'pot-round', 'pot-long', 'pot-flower'])).toBe(true);
    expect(isCorrectPotOrder(['pot-flower', 'pot-long', 'pot-round', 'pot-short'])).toBe(false);
  });

  it('checks mirror angles from puzzle data', () => {
    const solvedAngles = Object.fromEntries(mirrorDefinitions.map((mirror) => [mirror.id, mirror.correctAngle]));
    expect(areMirrorAnglesSolved(solvedAngles)).toBe(true);
    expect(areMirrorAnglesSolved({ ...solvedAngles, 'mirror-b': 45 })).toBe(false);
  });

  it('only clears the game through butterfly key flow reducer actions', () => {
    const withKey = greenhouseReducer(greenhouseInitialState, { type: 'COLLECT_ITEM', itemId: 'butterflyKey' });
    const used = greenhouseReducer(withKey, { type: 'USE_ITEM', itemId: 'butterflyKey', consume: true });
    const cleared = greenhouseReducer(used, { type: 'CLEAR_GAME' });
    expect(cleared.inventory).not.toContain('butterflyKey');
    expect(cleared.currentScene).toBe('ending');
    expect(cleared.isCleared).toBe(true);
  });
});
