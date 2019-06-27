
import {RNG} from './rng';

test('nextFloat with seed', () => {
  // When providing a seed, should always get the same value
  const rng = new RNG(1);
  expect(rng.nextFloat()).toBeCloseTo(0.41702);
});

test('nextRange with seed', () => {
  // When providing a seed, should always get the same value
  const rng = new RNG(1);
  expect(rng.nextRange(0, 10)).toBe(4);
});

test('chooseIndex with equal chances', () => {
  const rng = new RNG(1);
  const chances = [1, 1];
  const counts = [0, 0];

  for (let i = 0; i < 1000; i++) {
    counts[rng.chooseIndex(chances)]++;
  }

  expect(counts[0]).toBe(490);
  expect(counts[1]).toBe(510);
});

test('chooseIndex with different chances', () => {
  const rng = new RNG(1);
  const chances = [3, 1];
  const counts = [0, 0];

  for (let i = 0; i < 1000; i++) {
    counts[rng.chooseIndex(chances)]++;
  }

  expect(counts[0]).toBe(740);
  expect(counts[1]).toBe(260);
});

test('chooseKey', () => {
  const rng = new RNG(1);
  const chancesMap = {'foo': 3, 'bar': 1};
  const counts: {[key: string]: number} = {'foo': 0, 'bar': 0};

  for (let i = 0; i < 1000; i++) {
    counts[rng.chooseKey(chancesMap)]++;
  }

  expect(counts['foo']).toBe(740);
  expect(counts['bar']).toBe(260);
});
