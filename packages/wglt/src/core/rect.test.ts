import assert from 'node:assert/strict';
import test from 'node:test';
import { Rect } from './rect.ts';
import { Vec2 } from './vec2.ts';

test('Rect cloning, copying, centers, and overlap behave consistently', (): void => {
  const rect = new Rect(10, 20, 5, 7);
  const clone = rect.clone();
  assert.notEqual(clone, rect);
  assert.deepEqual(clone, rect);
  assert.deepEqual(rect.getCenter(), new Vec2(12, 23));
  assert.equal(rect.intersects(new Rect(15, 27, 2, 2)), true);
  assert.equal(rect.intersects(new Rect(16, 28, 2, 2)), false);

  clone.copy(new Rect(1, 2, 3, 4));
  assert.deepEqual(clone, new Rect(1, 2, 3, 4));
});
