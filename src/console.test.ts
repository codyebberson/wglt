import { Console } from './console';
import { deserialize, serialize } from './serialize';

test('Serialize Console', () => {
  const console1 = new Console(80, 45);
  const console2 = deserialize(serialize(console1)) as Console;
  expect(console2).toEqual(console1);
});
