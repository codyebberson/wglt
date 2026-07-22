import assert from 'node:assert/strict';
import test from 'node:test';
import { fromRgb } from '../core/color.ts';
import { Rect } from '../core/rect.ts';
import { Cell } from './cell.ts';
import { Console } from './console.ts';

function text(console: Console, y: number): string {
  return console.grid[y].map((cell) => String.fromCharCode(cell.charCode)).join('');
}

test('Console draws multiline, centered, and clipped text', (): void => {
  const console = new Console(7, 3);
  console.drawString(1, 0, 'abc\nde');
  console.drawCenteredString(3, 2, 'xyz');
  assert.equal(text(console, 0), '\0abc\0\0\0');
  assert.equal(text(console, 1), '\0de\0\0\0\0');
  assert.equal(text(console, 2), '\0\0xyz\0\0');

  console.clip = new Rect(2, 0, 2, 0);
  console.drawString(0, 0, '1234567');
  assert.equal(text(console, 0), '\0a345\0\0');
});

test('Console shape drawing sets edges and corners', (): void => {
  const console = new Console(5, 4);
  console.drawBox(0, 0, 5, 4, 1, 2, 3, 4, 5, 6, 7, 8);
  assert.deepEqual(
    console.grid.map((row) => row.map((cell) => cell.charCode)),
    [
      [5, 1, 1, 1, 6],
      [4, 0, 0, 0, 2],
      [4, 0, 0, 0, 2],
      [8, 3, 3, 3, 7],
    ]
  );
});

test('Console copies regions with source and destination clipping', (): void => {
  const source = new Console(4, 2);
  source.drawString(0, 0, 'abcd');
  source.drawString(0, 1, 'efgh');
  const destination = new Console(3, 2);
  destination.drawConsole(-1, 0, source, 1, 0, 4, 2);
  assert.equal(text(destination, 0), 'cd\0');
  assert.equal(text(destination, 1), 'gh\0');
});

test('Cell only becomes dirty when its value changes', (): void => {
  const fg = fromRgb(1, 2, 3);
  const bg = fromRgb(4, 5, 6);
  const cell = new Cell(0, 0, 'x', fg, bg);
  cell.dirty = false;
  assert.equal(cell.setValue('x', fg, bg), false);
  assert.equal(cell.setValue('y', fg, bg), true);
  assert.equal(cell.charCode, 'y'.charCodeAt(0));
});

test('Cell supports alpha blend and additive blend modes', (): void => {
  const destination = new Cell(0, 0, 0, fromRgb(0, 0, 0), fromRgb(10, 20, 30));
  const source = new Cell(0, 0, 0, fromRgb(255, 255, 255), fromRgb(110, 120, 130, 128));

  destination.drawCell(source, 'blend');
  assert.equal(destination.fg, fromRgb(55, 60, 65));
  assert.equal(destination.bg, fromRgb(60, 70, 80));

  destination.setBackground(fromRgb(250, 10, 20));
  destination.drawCell(new Cell(0, 0, 0, 0, fromRgb(20, 40, 60, 128)), 'add');
  assert.equal(destination.bg, fromRgb(255, 30, 50));
});
