import assert from 'node:assert/strict';
import test from 'node:test';
import { Vec2 } from './vec2.ts';

const EPSILON = 1e-12;

function assertClose(actual: number, expected: number): void {
  assert.ok(Math.abs(actual - expected) < EPSILON, `${actual} is not close to ${expected}`);
}

test('Vec2 arithmetic mutates and returns the same instance', (): void => {
  const vector = new Vec2(3, 4);
  assert.equal(vector.add({ x: 2, y: -1 }), vector);
  assert.deepEqual(vector, new Vec2(5, 3));
  assert.equal(vector.subtract({ x: 1, y: 2 }), vector);
  assert.deepEqual(vector, new Vec2(4, 1));
  assert.equal(vector.scale(2), vector);
  assert.deepEqual(vector, new Vec2(8, 2));
});

test('Vec2 normalization and direction handle zero and nonzero vectors', (): void => {
  const vector = new Vec2(3, 4).normalize();
  assertClose(vector.length(), 1);
  assert.deepEqual(new Vec2(0, 0).normalize(), new Vec2(0, 0));

  const direction = new Vec2(2, 3).directionTo({ x: 5, y: 7 });
  assertClose(direction.x, 0.6);
  assertClose(direction.y, 0.8);
});

test('Vec2 moveToward stops at the target without overshooting', (): void => {
  assert.deepEqual(new Vec2(0, 0).moveToward({ x: 3, y: 4 }, 2), new Vec2(1.2, 1.6));
  assert.deepEqual(new Vec2(0, 0).moveToward({ x: 3, y: 4 }, 5), new Vec2(3, 4));
  assert.deepEqual(new Vec2(3, 4).moveToward({ x: 3, y: 4 }, 1), new Vec2(3, 4));
});

test('Vec2 rotation, interpolation, distance, and dot product are consistent', (): void => {
  const rotated = new Vec2(1, 0).rotate(Math.PI / 2);
  assertClose(rotated.x, 0);
  assertClose(rotated.y, 1);
  assert.deepEqual(new Vec2(0, 10).lerp({ x: 10, y: 20 }, 0.25), new Vec2(2.5, 12.5));
  assert.equal(new Vec2(0, 0).distance({ x: 3, y: 4 }), 5);
  assert.equal(new Vec2(2, 3).dot({ x: 4, y: -1 }), 5);
});
