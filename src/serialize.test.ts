import { Point } from './point';
import { Rect } from './rect';
import { deserialize, serializable, serialize } from './serialize';

@serializable
class MyTestClass {
  other?: MyTestClass;
  constructor(readonly name: string) {}
}

class NotSerializableClass {
  constructor(readonly name: string) {}
}

test('Array', () => {
  const input = [1, 2, 3];
  expect(deserialize(serialize(input))).toEqual(input);
});

test('Object', () => {
  const input = { foo: 'bar' };
  expect(deserialize(serialize(input))).toEqual(input);
});

test('Serialize Point', () => {
  const p = new Point(1, 2);
  const str = serialize(p);
  const p2 = deserialize(str) as Point;
  expect(p2.x).toEqual(p.x);
  expect(p2.y).toEqual(p.y);
});

test('Serialize Rect', () => {
  const r = new Rect(1, 2, 3, 4);
  const str = serialize(r);
  const r2 = deserialize(str) as Rect;
  expect(r2.x).toEqual(r.x);
  expect(r2.y).toEqual(r.y);
  expect(r2.x2).toEqual(r.x2);
  expect(r2.y2).toEqual(r.y2);
  expect(r2.width).toEqual(r.width);
  expect(r2.height).toEqual(r.height);
  expect(r2.contains).toBeDefined();
  expect(r2.intersects).toBeDefined();
  expect(r2.getCenter).toBeDefined();
});

test('References', () => {
  const input = {
    foo: 'bar',
    array: [1, 2, 3],
    myRect: new Rect(1, 2, 3, 4),
  };
  expect(deserialize(serialize(input))).toEqual(input);
});

test('Circular references', () => {
  const obj1 = new MyTestClass('obj1');
  const obj2 = new MyTestClass('obj2');
  obj1.other = obj2;
  obj2.other = obj1;

  const input = [obj1, obj2];
  expect(deserialize(serialize(input))).toEqual(input);
});

test('Chained references', () => {
  const obj1 = new MyTestClass('obj1');
  const obj2 = new MyTestClass('obj2');
  const obj3 = new MyTestClass('obj3');
  obj1.other = obj2;
  obj2.other = obj3;
  obj3.other = obj1;

  const input = [obj1, obj2, obj3];
  expect(deserialize(serialize(input))).toEqual(input);
});

test('Not serializable', () => {
  const input = new NotSerializableClass('test');
  expect(() => serialize(input)).toThrow();
});
