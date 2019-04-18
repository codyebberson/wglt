
import { Serializer } from './serializer';
import { Serializable } from './serializable';
import { Vec2 } from './vec2';
import { ArrayList } from './arraylist';
import { Actor } from './actor';
import { Game } from './game';
import { Sprite } from './sprite';
import { Talent } from './talent';
import { Ability, TargetType } from './ability';
import { Message } from './message';

const TEST_SPRITE = new Sprite(0, 0, 16, 16);

@Serializable('MyActor')
class MyActor extends Actor {
  foo: string;
  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'test', TEST_SPRITE, true);
    this.foo = 'bar';
  }
}

@Serializable('MyAbility')
class MyAbility implements Ability {
  readonly sprite: Sprite = TEST_SPRITE;
  readonly name: string = 'test ability';
  readonly targetType: TargetType = TargetType.SELF;
  readonly minRange: number = 1;
  readonly maxRange: number = 1;
  readonly cooldown: number = 1;
  readonly tooltipMessages: Message[] = [];

  cast(caster: Actor) {
    return true;
  }
}

test('serialize undefined', () => {
  const s = new Serializer();
  const result = s.serialize(undefined);
  expect(result).toEqual({
    'refs': {},
    'root': undefined
  });
});

test('serialize null', () => {
  const s = new Serializer();
  const result = s.serialize(null);
  expect(result).toEqual({
    'refs': {},
    'root': null
  });
});

test('serialize zero', () => {
  const s = new Serializer();
  const result = s.serialize(0);
  expect(result).toEqual({
    'refs': {},
    'root': 0
  });
});

test('serialize number', () => {
  const s = new Serializer();
  const result = s.serialize(100);
  expect(result).toEqual({
    'refs': {},
    'root': 100
  });
});

test('serialize anonymous', () => {
  const s = new Serializer();
  const result = s.serialize({ 'x': 100 });
  expect(result).toEqual({
    'refs': {
      'Object': [
        {
          'x': 100
        }
      ]
    },
    'root': {
      '_c': 'Object',
      '_i': 0
    }
  });
});

test('serialize array', () => {
  const s = new Serializer();
  const result = s.serialize([2, 4, 6, 8]);
  expect(result).toEqual({
    'refs': {},
    'root': [2, 4, 6, 8]
  });
});

test('serialize ArrayList', () => {
  const a = new ArrayList<Number>();
  a.add(2);
  a.add(4);
  a.add(6);

  const s = new Serializer();
  const result = s.serialize(a);
  expect(result).toEqual({
    'refs': {
      'ArrayList': [
        {
          'elements': [2, 4, 6]
        }
      ]
    },
    'root': {
      '_c': 'ArrayList',
      '_i': 0
    }
  });
});

test('serialize Vec2', () => {
  const s = new Serializer();
  const result = s.serialize(new Vec2(1, 2));
  expect(result).toEqual({
    'refs': {},
    'root': { 'x': 1, 'y': 2 }
  });
});

test('custom class with decorator', () => {
  const mockGame = {} as Game;
  const testActor = new MyActor(mockGame, 0, 0);

  const s = new Serializer();
  const result = s.serialize(testActor);
  expect(result['root']).toEqual({
    "_c": "MyActor",
    "_i": 0
  });

  expect(result['refs']['MyActor'][0]).toEqual({
    "ap": 1,
    "blocks": true,
    "foo": "bar",
    "hp": 100,
    "inventory": {
      '_c': 'ArrayList',
      '_i': 0
    },
    "maxAp": 1,
    "maxHp": 100,
    "name": "test",
    "offset": {
      "x": 0,
      "y": 0,
    },
    "seen": false,
    "sprite": {
      '_c': 'Sprite',
      '_i': 0
    },
    "talents": {
      '_c': 'ArrayList',
      '_i': 1
    },
    "visibleDuration": -1,
    "x": 0,
    "y": 0,
    "zIndex": 1,
  });
});

test('circular reference', () => {
  const mockGame = {} as Game;
  const testActor = new MyActor(mockGame, 0, 0);
  testActor.talents.add(new Talent(testActor, new MyAbility()));

  const s = new Serializer();
  const result = s.serialize(testActor);
  expect(result['root']).toEqual({
    "_c": "MyActor",
    "_i": 0
  });
});
