import { Cell } from './cell';
import { deserialize, serialize } from './serialize';

test('Serialize Cell', () => {
  const cell1 = new Cell(0, 0);
  const cell2 = deserialize(serialize(cell1)) as Cell;
  expect(cell2).toEqual(cell1);
});
