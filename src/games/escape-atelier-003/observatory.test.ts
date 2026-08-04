import { describe, expect, it } from 'vitest';
import { OBSERVATORY_SAVE_KEY } from './data/gameConfig';
import { dawnTimeAnswer, isCorrectDawnTime, isCorrectGlobePosition, isCorrectMoonPhaseOrder, isCorrectPlatePiece } from './data/puzzles';
import { addObservedStar, isCorrectConstellationOrder } from './data/stars';
import { observatoryInitialState } from './state/initialState';
import { observatoryReducer } from './state/reducer';

describe('Escape Atelier #003 state and puzzle logic', () => {
  it('uses an independent save key', () => {
    expect(OBSERVATORY_SAVE_KEY).toBe('escape-atelier-003-save');
    expect(OBSERVATORY_SAVE_KEY).not.toBe('escape-atelier-001-save');
    expect(OBSERVATORY_SAVE_KEY).not.toBe('escape-atelier-002-save');
  });

  it('creates the expected initial state', () => {
    expect(observatoryInitialState.currentArea).toBe('lower-floor');
    expect(observatoryInitialState.currentScene).toBe('title');
    expect(observatoryInitialState.puzzleStates.constellationPlate.pieces.piece1.rotation).toBe(0);
  });

  it('prevents duplicate item rewards', () => {
    const once = observatoryReducer(observatoryInitialState, { type: 'COLLECT_ITEM', itemId: 'platePiece1' });
    const twice = observatoryReducer(once, { type: 'COLLECT_ITEM', itemId: 'platePiece1' });
    expect(twice.inventory).toEqual(['platePiece1']);
    expect(twice.collectedItems).toEqual(['platePiece1']);
  });

  it('checks constellation plate position and rotation', () => {
    expect(isCorrectPlatePiece('left', 90, 'left', 90)).toBe(true);
    expect(isCorrectPlatePiece('left', 180, 'left', 90)).toBe(false);
    expect(isCorrectPlatePiece('right', 90, 'left', 90)).toBe(false);
  });

  it('checks moon, globe, constellation, and dawn answers', () => {
    expect(isCorrectMoonPhaseOrder(['moon-new', 'moon-crescent', 'moon-half', 'moon-full'])).toBe(true);
    expect(isCorrectMoonPhaseOrder(['moon-full', 'moon-half', 'moon-crescent', 'moon-new'])).toBe(false);
    expect(isCorrectGlobePosition('target')).toBe(true);
    expect(isCorrectConstellationOrder(['star-lyra', 'star-cygnus', 'star-aquila'])).toBe(true);
    expect(isCorrectDawnTime(dawnTimeAnswer)).toBe(true);
  });

  it('prevents duplicate observed stars and ignores wrong stars', () => {
    expect(addObservedStar([], 'star-orion')).toEqual([]);
    expect(addObservedStar(['star-lyra'], 'star-lyra')).toEqual(['star-lyra']);
    expect(addObservedStar(['star-lyra'], 'star-cygnus')).toEqual(['star-lyra', 'star-cygnus']);
  });

  it('restores multiple-floor state through reducer navigation', () => {
    const upper = observatoryReducer(observatoryInitialState, { type: 'GO_SCENE', scene: 'upper-main', area: 'upper-floor', viewId: 'upper-main' });
    expect(upper.currentArea).toBe('upper-floor');
    expect(upper.currentScene).toBe('upper-main');
    expect(upper.currentViewId).toBe('upper-main');
  });

  it('only clears once and consumes the dawn key before clear', () => {
    const withKey = observatoryReducer(observatoryInitialState, { type: 'COLLECT_ITEM', itemId: 'dawnKey' });
    const used = observatoryReducer(withKey, { type: 'USE_ITEM', itemId: 'dawnKey', consume: true });
    const cleared = observatoryReducer(used, { type: 'CLEAR_GAME' });
    const clearedAgain = observatoryReducer(cleared, { type: 'CLEAR_GAME' });
    expect(cleared.inventory).not.toContain('dawnKey');
    expect(cleared.currentScene).toBe('ending');
    expect(cleared.isCleared).toBe(true);
    expect(clearedAgain).toBe(cleared);
  });
});
