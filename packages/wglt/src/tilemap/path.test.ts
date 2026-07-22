import assert from 'node:assert/strict';
import test from 'node:test';
import { computePath } from './path.ts';
import { TileMap } from './tilemap.ts';

function createOpenMap(width: number, height: number): TileMap {
  const map = new TileMap(width, height);
  for (const row of map.grid) {
    for (const cell of row) {
      cell.blocked = false;
      cell.blockedSight = false;
      cell.explored = true;
    }
  }
  return map;
}

function coordinates(path: ReturnType<typeof computePath>): number[][] | undefined {
  return path?.map(({ x, y }) => [x, y]);
}

test('computePath includes source and destination along a direct route', (): void => {
  const map = createOpenMap(5, 3);
  assert.deepEqual(coordinates(computePath(map, { x: 0, y: 1 }, { x: 4, y: 1 })), [
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
  ]);
});

test('computePath routes around explored blocked cells', (): void => {
  const map = createOpenMap(5, 3);
  map.setBlocked(2, 1, true);
  const path = computePath(map, { x: 0, y: 1 }, { x: 4, y: 1 });
  assert.ok(path);
  assert.deepEqual(path[0], map.grid[1][0]);
  assert.deepEqual(path.at(-1), map.grid[1][4]);
  assert.equal(
    path.some(({ x, y }) => x === 2 && y === 1),
    false
  );
});

test('computePath may enter a blocked destination but not blocked intermediates', (): void => {
  const map = createOpenMap(3, 1);
  map.setBlocked(2, 0, true);
  assert.deepEqual(coordinates(computePath(map, { x: 0, y: 0 }, { x: 2, y: 0 })), [
    [0, 0],
    [1, 0],
    [2, 0],
  ]);
});

test('computePath respects maximum distance and finds unexplored cells', (): void => {
  const map = createOpenMap(5, 1);
  assert.equal(computePath(map, { x: 0, y: 0 }, { x: 4, y: 0 }, 3), undefined);
  map.grid[0][3].explored = false;
  assert.deepEqual(coordinates(computePath(map, { x: 0, y: 0 }, undefined)), [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ]);
});

test('computePath validates coordinates and distance', (): void => {
  const map = createOpenMap(3, 3);
  assert.throws(() => computePath(map, { x: -1, y: 0 }, { x: 1, y: 1 }), RangeError);
  assert.throws(() => computePath(map, { x: 0.5, y: 0 }, { x: 1, y: 1 }), RangeError);
  assert.throws(() => computePath(map, { x: 0, y: 0 }, { x: 3, y: 1 }), RangeError);
  assert.throws(() => computePath(map, { x: 0, y: 0 }, { x: 1, y: 1 }, -1), RangeError);
  assert.throws(
    () => computePath(map, { x: 0, y: 0 }, { x: 1, y: 1 }, Number.POSITIVE_INFINITY),
    RangeError
  );
});
