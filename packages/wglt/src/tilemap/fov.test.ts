import assert from 'node:assert/strict';
import test from 'node:test';
import { FovQuadrants } from '../core/fov.ts';
import { TileMap } from './tilemap.ts';

function createTransparentMap(width: number, height: number): TileMap {
  const map = new TileMap(width, height);
  for (const row of map.grid) {
    for (const cell of row) {
      cell.blockedSight = false;
    }
  }
  return map;
}

test('computeFov reveals an unobstructed radius and marks cells explored', (): void => {
  const map = createTransparentMap(7, 7);
  map.computeFov(3, 3, 2);
  for (let y = 1; y <= 5; y++) {
    for (let x = 1; x <= 5; x++) {
      assert.equal(map.isVisible(x, y), true, `expected (${x}, ${y}) to be visible`);
      assert.equal(map.isSeen(x, y), true, `expected (${x}, ${y}) to be explored`);
    }
  }
  assert.equal(map.isVisible(0, 0), false);
});

test('computeFov makes an obstacle visible while occluding cells behind it', (): void => {
  const map = createTransparentMap(7, 7);
  map.setBlocked(4, 3, true, true);
  map.computeFov(3, 3, 3);
  assert.equal(map.isVisible(4, 3), true);
  assert.equal(map.isVisible(5, 3), false);
  assert.equal(map.isVisible(6, 3), false);
});

test('computeFov can restrict visibility to selected quadrants', (): void => {
  const map = createTransparentMap(7, 7);
  map.computeFov(3, 3, 3, false, FovQuadrants.QUADRANT_EAST);
  assert.equal(map.isVisible(5, 3), true);
  assert.equal(map.isVisible(1, 3), false);
  assert.equal(map.isVisible(3, 1), false);
  assert.equal(map.isVisible(3, 5), false);
});

test('computeFov noClear accumulates visibility from multiple origins', (): void => {
  const map = createTransparentMap(7, 1);
  map.computeFov(1, 0, 1);
  map.computeFov(5, 0, 1, true);
  assert.equal(map.isVisible(0, 0), true);
  assert.equal(map.isVisible(6, 0), true);
});

test('resetFov clears visible and explored state', (): void => {
  const map = createTransparentMap(3, 3);
  map.computeFov(1, 1, 1);
  map.resetFov();
  for (const row of map.grid) {
    for (const cell of row) {
      assert.equal(cell.visible, false);
      assert.equal(cell.explored, false);
    }
  }
});

test('computeFov validates its origin and radius', (): void => {
  const map = createTransparentMap(3, 3);
  assert.throws(() => map.computeFov(-1, 0, 1), RangeError);
  assert.throws(() => map.computeFov(0.5, 0, 1), RangeError);
  assert.throws(() => map.computeFov(0, 0, -1), RangeError);
  assert.throws(() => map.computeFov(0, 0, Number.NaN), RangeError);
});
