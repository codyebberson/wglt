
import { Serializer } from './serialize';
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

class MyActor1 extends Actor {
  foo: string;
  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'test', TEST_SPRITE, true);
    this.foo = 'bar';
  }
}

@Serializable('MyActor2')
class MyActor2 extends Actor {
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
  expect(s.serializeObject(undefined)).toBe(undefined);
});

test('serialize null', () => {
  const s = new Serializer();
  expect(s.serializeObject(null)).toBe(null);
});

test('serialize zero', () => {
  const s = new Serializer();
  expect(s.serializeObject(0)).toBe(0);
});

test('serialize number', () => {
  const s = new Serializer();
  expect(s.serializeObject(100)).toBe(100);
});

test('serialize anonymous', () => {
  const s = new Serializer();
  expect(s.serializeObject({ 'x': 100 })).toEqual({ 'x': 100 });
});

test('serialize array', () => {
  const s = new Serializer();
  expect(s.serializeObject([2, 4, 6, 8])).toEqual([2, 4, 6, 8]);
});

test('serialize ArrayList', () => {
  const a = new ArrayList<Number>();
  a.add(2);
  a.add(4);
  a.add(6);

  const s = new Serializer();
  expect(s.serializeObject(a)).toEqual([2, 4, 6]);
});

test('serialize Vec2', () => {
  const s = new Serializer();
  expect(s.serializeObject(new Vec2(1, 2))).toEqual({ 'x': 1, 'y': 2 });
});

test('custom class', () => {
  const mockGame = {} as Game;
  const testActor = new MyActor1(mockGame, 0, 0);

  const s = new Serializer();
  expect(s.serializeObject(testActor)).toEqual({
    "ap": 1,
    "blocks": true,
    "foo": "bar",
    "game": {},
    "hp": 100,
    "inventory": [],
    "maxAp": 1,
    "maxHp": 100,
    "name": "test",
    "offset": {
      "x": 0,
      "y": 0,
    },
    "seen": false,
    "sprite": {
      "animDelay": 0,
      "animIndex": 0,
      "colorOverride": undefined,
      "frames": 1,
      "height": 16,
      "loop": false,
      "ticksPerFrame": 30,
      "width": 16,
      "x": 0,
      "y": 0,
    },
    "talents": [],
    "visibleDuration": -1,
    "x": 0,
    "y": 0,
    "zIndex": 1,
  });
});

test('custom class with decorator', () => {
  const mockGame = {} as Game;
  const testActor = new MyActor2(mockGame, 0, 0);

  const s = new Serializer();
  const result = s.serialize(testActor);
  expect(result['root']).toEqual({
    "__className": "MyActor2",
    "__index": 0
  });

  expect(result['refs']['MyActor2'][0]).toEqual({
    "ap": 1,
    "blocks": true,
    "foo": "bar",
    "game": {},
    "hp": 100,
    "inventory": [],
    "maxAp": 1,
    "maxHp": 100,
    "name": "test",
    "offset": {
      "x": 0,
      "y": 0,
    },
    "seen": false,
    "sprite": {
      "animDelay": 0,
      "animIndex": 0,
      "colorOverride": undefined,
      "frames": 1,
      "height": 16,
      "loop": false,
      "ticksPerFrame": 30,
      "width": 16,
      "x": 0,
      "y": 0,
    },
    "talents": [],
    "visibleDuration": -1,
    "x": 0,
    "y": 0,
    "zIndex": 1,
  });
});

test('circular reference', () => {
  const mockGame = {} as Game;
  const testActor = new MyActor2(mockGame, 0, 0);
  testActor.talents.add(new Talent(testActor, new MyAbility()));

  const s = new Serializer();
  const result = s.serialize(testActor);
  console.log(result);
  console.log(result['refs']['MyActor2'][0]);
  console.log(result['refs']['MyActor2'][0]['talents'][0]);
  console.log(result['refs']['MyActor2'][0]['talents'][0]['actor']);
  expect(result['root']).toEqual({
    "__className": "MyActor2",
    "__index": 0
  });
});
