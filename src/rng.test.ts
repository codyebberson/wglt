import { RNG } from './rng';
import { deserialize, serialize } from './serialize';

test('nextFloat with seed', () => {
  // When providing a seed, should always get the same value
  const rng = new RNG(1);
  expect(rng.nextFloat()).toBeCloseTo(0.51387);
});

test('nextRange with seed', () => {
  // When providing a seed, should always get the same value
  const rng = new RNG(1);
  expect(rng.nextRange(0, 10)).toBe(5);
});

test('chooseIndex with equal chances', () => {
  const rng = new RNG(1);
  const chances = [1, 1];
  const counts = [0, 0];

  for (let i = 0; i < 1000; i++) {
    counts[rng.chooseIndex(chances)]++;
  }

  expect(counts[0]).toBe(505);
  expect(counts[1]).toBe(495);
});

test('chooseIndex with different chances', () => {
  const rng = new RNG(1);
  const chances = [3, 1];
  const counts = [0, 0];

  for (let i = 0; i < 1000; i++) {
    counts[rng.chooseIndex(chances)]++;
  }

  expect(counts[0]).toBe(729);
  expect(counts[1]).toBe(271);
});

test('chooseKey', () => {
  const rng = new RNG(1);
  const chancesMap = { foo: 3, bar: 1 };
  const counts: { [key: string]: number } = { foo: 0, bar: 0 };

  for (let i = 0; i < 1000; i++) {
    counts[rng.chooseKey(chancesMap)]++;
  }

  expect(counts.foo).toBe(729);
  expect(counts.bar).toBe(271);
});

test('serializable', () => {
  const rng1 = new RNG(1);
  const rng2 = deserialize(serialize(rng1)) as RNG;
  expect(rng2).toEqual(rng1);
  expect(rng2).not.toBe(rng1);

  for (let i = 0; i < 1000; i++) {
    expect(rng2.nextInt()).toBe(rng1.nextInt());
  }
});
