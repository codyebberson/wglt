import { Serializer } from "./serializer";
import { Deserializer } from "./deserializer";
import { Serializable } from "./serializable";
import { Actor } from "./actor";
import { Game } from "./game";
import { Sprite } from "./sprite";

const TEST_SPRITE = new Sprite(0, 0, 16, 16);

@Serializable('MyActor')
class MyActor extends Actor {
  foo: string;
  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'test', TEST_SPRITE, true);
    this.foo = 'bar';
  }
}

test('deserialize undefined', () => {
  const s = new Serializer();
  const result = s.serialize(undefined);
  const d = new Deserializer(result);
  expect(d.deserialize()).toEqual(undefined);
});

test('deserialize null', () => {
  const s = new Serializer();
  const result = s.serialize(null);
  const d = new Deserializer(result);
  expect(d.deserialize()).toEqual(null);
});

test('deserialize zero', () => {
  const s = new Serializer();
  const result = s.serialize(0);
  const d = new Deserializer(result);
  expect(d.deserialize()).toEqual(0);
});

test('deserialize number', () => {
  const s = new Serializer();
  const result = s.serialize(100);
  const d = new Deserializer(result);
  expect(d.deserialize()).toEqual(100);
});

test('deserialize custom class', () => {
  const mockGame = {} as Game;
  const actor1 = new MyActor(mockGame, 10, 20);
  const s = new Serializer();
  const result = s.serialize(actor1);
  const d = new Deserializer(result);
  const actor2 = d.deserialize();
  expect(actor2.foo).toEqual(actor1.foo);
  expect(actor2.x).toEqual(actor1.x);
  expect(actor2.y).toEqual(actor1.y);
});
