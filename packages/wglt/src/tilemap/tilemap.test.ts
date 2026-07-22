import assert from 'node:assert/strict';
import { test } from 'node:test';
import { TileMap } from './tilemap.ts';

function cleanMap(): TileMap {
  const map = new TileMap(4, 4, 2);
  map.dirty = false;
  return map;
}

test('tile mutations invalidate renderer data', () => {
  const map = cleanMap();

  map.setTile(1, 1, 0, 3);
  assert.equal(map.dirty, true);

  map.dirty = false;
  map.setAnimated(1, 1, 0, true);
  assert.equal(map.dirty, true);

  map.dirty = false;
  map.clear();
  assert.equal(map.dirty, true);
});

test('visibility mutations invalidate renderer data', () => {
  const map = cleanMap();

  map.setSeen(1, 1, true);
  assert.equal(map.dirty, true);

  map.dirty = false;
  map.resetFov();
  assert.equal(map.dirty, true);

  map.dirty = false;
  map.computeFov(1, 1, 2);
  assert.equal(map.dirty, true);

  map.dirty = false;
  map.updateExplored();
  assert.equal(map.dirty, true);
});

test('out-of-range mutations do not invalidate renderer data', () => {
  const map = cleanMap();

  map.setTile(-1, 0, 0, 3);
  map.setAnimated(0, -1, 0, true);
  map.setSeen(4, 0, true);

  assert.equal(map.dirty, false);
});
