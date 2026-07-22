import assert from 'node:assert/strict';
import test from 'node:test';
import { capitalize, interpolate, wordWrap } from './utils.ts';

test('pure string and interpolation utilities cover common boundaries', (): void => {
  assert.equal(capitalize('hello'), 'Hello');
  assert.equal(capitalize(''), '');
  assert.equal(interpolate(0, 10), -1);
  assert.equal(interpolate(5, 10), 0);
  assert.equal(interpolate(10, 10), 1);
  assert.deepEqual(wordWrap('one two three four', 7), ['one two', 'three', 'four']);
});
