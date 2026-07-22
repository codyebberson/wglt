import assert from 'node:assert/strict';
import { test } from 'node:test';
import { deserialize, registerSerializable, serialize } from './serialize.ts';

// This suite registers local fixture classes directly. The RNG round-trip below
// uses a mirror class that reproduces RNG's serialized shape (a Uint32Array
// state vector) so the test remains focused on serialization behavior.

function roundTrip<T>(value: T): T {
  return deserialize(serialize(value)) as T;
}

test('round-trips primitives and plain values', () => {
  assert.equal(roundTrip(42), 42);
  assert.equal(roundTrip('hello'), 'hello');
  assert.equal(roundTrip(true), true);
  assert.equal(roundTrip(null), null);
});

test('round-trips nested plain objects and arrays', () => {
  const src = { a: 1, b: { c: [1, 2, 3], d: 'x' }, e: [{ f: true }] };
  assert.deepEqual(roundTrip(src), src);
});

test('round-trips plain objects that contain serialization marker property names', () => {
  const src = {
    referenceLike: { $ref: 0, name: 'player' },
    arrayViewLike: { $type: 'domain', $data: 'hello' },
    knownArrayViewWithExtraData: { $type: 'Uint8Array', $data: 'AA==', name: 'bytes' },
  };
  assert.deepEqual(roundTrip(src), src);
});

test('includes and validates the serialization format version', () => {
  assert.equal(JSON.parse(serialize(null)).$wglt, 1);
  assert.throws(
    () => deserialize(JSON.stringify({ $wglt: 2, instances: [], root: null })),
    /format version: 2/
  );
  assert.throws(
    () => deserialize(JSON.stringify({ instances: [], root: null })),
    /format version: undefined/
  );
});

test('rejects invalid internal references', () => {
  assert.throws(
    () => deserialize(JSON.stringify({ $wglt: 1, instances: [], root: { $ref: 0 } })),
    /reference: 0/
  );
});

test('preserves order of a mixed array', () => {
  const src = [1, 'two', { three: 3 }, [4]];
  assert.deepEqual(roundTrip(src), src);
});

test('round-trips typed arrays of every supported kind', () => {
  const views = {
    i8: new Int8Array([-1, 0, 127, -128]),
    u8: new Uint8Array([0, 1, 255]),
    u8c: new Uint8ClampedArray([0, 128, 255]),
    i16: new Int16Array([-32768, 0, 32767]),
    u16: new Uint16Array([0, 65535]),
    i32: new Int32Array([-2147483648, 2147483647]),
    u32: new Uint32Array([0, 1, 4294967295]),
    f32: new Float32Array([1.5, -2.25, 0]),
    f64: new Float64Array([Math.PI, -0.5, 1e308]),
  };
  const out = roundTrip(views);
  for (const key of Object.keys(views) as (keyof typeof views)[]) {
    assert.ok(out[key] instanceof views[key].constructor, `${key} keeps its type`);
    assert.deepEqual(Array.from(out[key]), Array.from(views[key]), `${key} keeps its values`);
  }
});

test('round-trips a DataView', () => {
  const dv = new DataView(new ArrayBuffer(4));
  dv.setUint32(0, 0xdeadbeef);
  const out = roundTrip(dv);
  assert.ok(out instanceof DataView);
  assert.equal(out.getUint32(0), 0xdeadbeef);
});

test('round-trips a large buffer without stack overflow', () => {
  const big = new Uint8Array(500_000);
  for (let i = 0; i < big.length; i++) {
    big[i] = i & 0xff;
  }
  const out = roundTrip(big);
  assert.equal(out.length, big.length);
  assert.ok(out.every((v, i) => v === (i & 0xff)));
});

test('preserves a Uint32Array state vector inside a serializable class (B5 regression)', () => {
  // Mirrors RNG: a serializable class whose state lives in a Uint32Array.
  // Before the atob fix, this came back as garbage and any restored generator
  // diverged. We reproduce RNG's Mersenne-Twister-style mutation so the state
  // holds non-trivial 32-bit values across the full range.
  class Generator {
    state = new Uint32Array(624);
    index = 0;
    seed(s: number): void {
      this.state[0] = s >>> 0;
      for (let i = 1; i < this.state.length; i++) {
        const prev = this.state[i - 1] ^ (this.state[i - 1] >>> 30);
        this.state[i] =
          ((((prev & 0xffff0000) >>> 16) * 1812433253) << 16) +
          (prev & 0x0000ffff) * 1812433253 +
          i;
        this.state[i] >>>= 0;
      }
      this.index = 0;
    }
    next(): number {
      const y = this.state[this.index % this.state.length];
      this.index++;
      return (y ^ (y >>> 11)) >>> 0;
    }
  }
  registerSerializable('test.Generator', Generator);

  const gen = new Generator();
  gen.seed(12345);
  for (let i = 0; i < 1000; i++) {
    gen.next();
  }

  const restored = roundTrip(gen);
  assert.ok(restored instanceof Generator);
  assert.ok(restored.state instanceof Uint32Array);

  const expected = Array.from({ length: 100 }, () => gen.next());
  const actual = Array.from({ length: 100 }, () => restored.next());
  assert.deepEqual(actual, expected);
});

test('deduplicates shared instances via references', () => {
  class Node {
    value = 0;
  }
  registerSerializable('test.Node', Node);

  const shared = new Node();
  shared.value = 7;
  const src = { left: shared, right: shared };

  const out = roundTrip(src);
  assert.ok(out.left instanceof Node);
  assert.equal(out.left.value, 7);
  assert.equal(out.left, out.right, 'shared instance restored as a single object');
});

test('handles circular references between instances', () => {
  class Ring {
    next?: Ring;
    name = '';
  }
  registerSerializable('test.Ring', Ring);

  const a = new Ring();
  a.name = 'a';
  const b = new Ring();
  b.name = 'b';
  a.next = b;
  b.next = a;

  const out = roundTrip(a);
  assert.equal(out.name, 'a');
  assert.equal(out.next?.name, 'b');
  assert.equal(out.next?.next, out, 'cycle is preserved as the same object');
});

test('reattaches the prototype so instance methods survive', () => {
  class Point {
    x = 0;
    y = 0;
    sum(): number {
      return this.x + this.y;
    }
  }
  registerSerializable('test.Point', Point);

  const p = new Point();
  p.x = 3;
  p.y = 4;
  const out = roundTrip(p);
  assert.ok(out instanceof Point);
  assert.equal(out.sum(), 7);
});

test('throws when serializing an unregistered class', () => {
  class Unregistered {
    x = 1;
  }
  assert.throws(() => serialize(new Unregistered()), /not serializable/);
});

test('persists the registered class ID instead of the constructor name', () => {
  class MinifiableClass {}
  registerSerializable('test.stable-id', MinifiableClass);

  const serialized = serialize(new MinifiableClass());
  assert.match(serialized, /"\$type":"test\.stable-id"/);
  assert.doesNotMatch(serialized, /MinifiableClass/);
});

test('rejects duplicate class IDs', () => {
  class First {}
  class Second {}
  registerSerializable('test.duplicate-id', First);

  assert.throws(() => registerSerializable('test.duplicate-id', Second), /already registered/);
});

test('reports an unknown class ID when deserializing', () => {
  const serialized = JSON.stringify({
    $wglt: 1,
    instances: [{ $type: 'test.unknown-id' }],
    root: { $ref: 0 },
  });

  assert.throws(() => deserialize(serialized), /test\.unknown-id.*not registered/);
});
