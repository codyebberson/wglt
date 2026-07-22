import assert from 'node:assert/strict';
import test from 'node:test';
import { RNG } from './rng.ts';

test('RNG matches the reference MT19937 sequence', (): void => {
  const rng = new RNG(5489);
  assert.deepEqual(
    Array.from({ length: 5 }, () => rng.nextInt()),
    [3499211612, 581869302, 3890346734, 3586334585, 545404204]
  );
});

test('RNG instances with the same seed remain deterministic', (): void => {
  const first = new RNG(123456);
  const second = new RNG(123456);
  for (let i = 0; i < 1000; i++) {
    assert.equal(first.nextInt(), second.nextInt());
  }
});

test('nextFloat and nextRange stay within their half-open ranges', (): void => {
  const rng = new RNG(42);
  for (let i = 0; i < 1000; i++) {
    const float = rng.nextFloat();
    const integer = rng.nextRange(-3, 7);
    assert.ok(float >= 0 && float < 1);
    assert.ok(Number.isInteger(integer));
    assert.ok(integer >= -3 && integer < 7);
  }
});

test('weighted choices never select zero-weight entries', (): void => {
  const rng = new RNG(7);
  for (let i = 0; i < 100; i++) {
    assert.equal(rng.chooseIndex([0, 5, 0]), 1);
    assert.equal(rng.chooseKey({ never: 0, always: 5 }), 'always');
  }
});
