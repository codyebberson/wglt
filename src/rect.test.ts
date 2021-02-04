
import { Rect } from './rect';
import { Point } from './point';

test('contains', () => {
  const r = new Rect(1, 2, 3, 4);
  expect(r.contains(new Point(0, 0))).toBe(false);
  expect(r.contains(new Point(1, 1))).toBe(false);
  expect(r.contains(new Point(2, 2))).toBe(true);
  expect(r.contains(new Point(3, 3))).toBe(true);
  expect(r.contains(new Point(4, 4))).toBe(false);
  expect(r.contains(new Point(5, 5))).toBe(false);
});
