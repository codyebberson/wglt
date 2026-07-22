import assert from 'node:assert/strict';
import test from 'node:test';
import { Font } from './font.ts';
import { Rect } from './rect.ts';

test('Font factories map printable glyphs and measure strings', (): void => {
  const mono = Font.createMonospaced(10, 20, 3, 5);
  assert.deepEqual(mono.getGlyphRect(32), new Rect(10, 20, 3, 5));
  assert.deepEqual(mono.getGlyphRect(34), new Rect(16, 20, 3, 5));
  assert.equal(mono.getStringWidth('ab\nc'), 12);
  assert.equal(Font.isInRange(31), false);
  assert.equal(Font.isInRange(32), true);
  assert.equal(Font.isInRange(126), true);
  assert.equal(Font.isInRange(127), false);

  const proportional = Font.createProportional(0, 0, [2, 4, 6], 8);
  assert.equal(proportional.getStringWidth(' !"'), 12);
});
