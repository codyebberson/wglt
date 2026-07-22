import assert from 'node:assert/strict';
import test from 'node:test';
import { fromHsv, fromRgb } from './color.ts';

test('fromRgb packs RGBA channels into an unsigned integer', (): void => {
  assert.equal(fromRgb(0x12, 0x34, 0x56, 0x78), 0x12345678);
  assert.equal(fromRgb(255, 255, 255), 0xffffffff);
  assert.ok(fromRgb(255, 0, 0) >= 0);
});

test('fromHsv converts primary colors and alpha', (): void => {
  assert.equal(fromHsv(0, 1, 1), fromRgb(255, 0, 0));
  assert.equal(fromHsv(1 / 3, 1, 1), fromRgb(0, 255, 0));
  assert.equal(fromHsv(2 / 3, 1, 1, 0.5), fromRgb(0, 0, 255, 127));
});
