import assert from 'node:assert/strict';
import test from 'node:test';
import { ArrayList } from './arraylist.ts';

test('clear notifies listeners for every removed element', (): void => {
  const list = new ArrayList<number>();
  const removed: number[] = [];
  list.add(1);
  list.add(2);
  list.add(3);
  list.addListener({
    onAdd: (): void => {},
    onRemove: (_list, element): void => {
      removed.push(element);
    },
  });

  list.clear();

  assert.equal(list.length, 0);
  assert.deepEqual(removed, [1, 2, 3]);
});

test('clear preserves elements added by removal listeners', (): void => {
  const list = new ArrayList<number>();
  list.add(1);
  list.addListener({
    onAdd: (): void => {},
    onRemove: (source): void => {
      source.add(2);
    },
  });

  list.clear();

  assert.equal(list.length, 1);
  assert.equal(list.get(0), 2);
});
