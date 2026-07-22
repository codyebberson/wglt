import assert from 'node:assert/strict';
import test from 'node:test';
import { FovQuadrants, getFovQuadrant } from './fov.ts';

test('getFovQuadrant maps all eight directions', (): void => {
  assert.equal(getFovQuadrant(1, 1), FovQuadrants.QUADRANT_SOUTHEAST);
  assert.equal(getFovQuadrant(1, 0), FovQuadrants.QUADRANT_EAST);
  assert.equal(getFovQuadrant(1, -1), FovQuadrants.QUADRANT_NORTHEAST);
  assert.equal(getFovQuadrant(0, -1), FovQuadrants.QUADRANT_NORTH);
  assert.equal(getFovQuadrant(-1, -1), FovQuadrants.QUADRANT_NORTHWEST);
  assert.equal(getFovQuadrant(-1, 0), FovQuadrants.QUADRANT_WEST);
  assert.equal(getFovQuadrant(-1, 1), FovQuadrants.QUADRANT_SOUTHWEST);
  assert.equal(getFovQuadrant(0, 1), FovQuadrants.QUADRANT_SOUTH);
});
