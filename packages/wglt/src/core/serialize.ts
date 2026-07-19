interface SerializationBundle {
  instances: InstancePlaceholder[];
  root: unknown;
}

interface InstancePlaceholder {
  $type?: string;
}

interface ReferencePlaceholder {
  $ref: number;
}

interface ArrayViewPlaceholder {
  $type: string;
  $data: string;
}

const classDefinitions: Map<string, ObjectConstructor> = new Map();

type ArrayViewConstructor = new (buffer: ArrayBuffer) => ArrayBufferView;

/**
 * Registry of typed-array / DataView constructors, keyed by `constructor.name`.
 * Used by both the serializer (to validate the view is supported) and the
 * deserializer (to reconstruct the view), so both sides resolve types the same
 * way instead of relying on `globalThis` lookups.
 */
const arrayViewConstructors: Map<string, ArrayViewConstructor> = new Map(
  (
    [
      Int8Array,
      Uint8Array,
      Uint8ClampedArray,
      Int16Array,
      Uint16Array,
      Int32Array,
      Uint32Array,
      Float32Array,
      Float64Array,
      DataView,
    ] as unknown as ArrayViewConstructor[]
  ).map((ctor) => [(ctor as unknown as { name: string }).name, ctor])
);

/**
 * Registers a class so its instances can be serialized and deserialized.
 * @param value - The class constructor to register.
 */
export function registerSerializable(value: { name: string }): void {
  classDefinitions.set(value.name, value as ObjectConstructor);
}

/**
 * Serializes a value to JSON.
 * Handles circular references and class instances.
 * @param obj - The root object to serialize.
 * @returns A string representation of the object graph.
 */
export function serialize(obj: unknown): string {
  const instances: InstancePlaceholder[] = [];
  const instancesMap = new WeakMap<object, number>();
  const root = replace(obj);
  return JSON.stringify({ instances, root });

  function replace(input: unknown): unknown {
    if (ArrayBuffer.isView(input)) {
      return replaceArrayView(input);
    }
    if (Array.isArray(input)) {
      return replaceArray(input);
    }
    if (input && typeof input === 'object') {
      return replaceObject(input as Record<string, unknown>);
    }
    return input;
  }

  function replaceArrayView(input: ArrayBufferView): ArrayViewPlaceholder {
    const typeName = input.constructor.name;
    if (!arrayViewConstructors.has(typeName)) {
      throw new Error(`Array view ${typeName} is not serializable.`);
    }
    const uint8View = new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
    // Build the binary string one chunk at a time. `String.fromCharCode.apply`
    // over the whole buffer overflows the call stack for large arrays.
    let binary = '';
    for (let i = 0; i < uint8View.length; i += 0x8000) {
      binary += String.fromCharCode(...uint8View.subarray(i, i + 0x8000));
    }
    return {
      $type: typeName,
      $data: btoa(binary),
    };
  }

  function replaceArray(input: unknown[]): unknown[] {
    const result = [];
    for (let i = 0; i < input.length; i++) {
      result[i] = replace(input[i]);
    }
    return result;
  }

  function replaceObject(input: Record<string, unknown>): Record<string, unknown> {
    if (input.constructor.name !== 'Object') {
      if (!classDefinitions.has(input.constructor.name)) {
        throw new Error(`Class ${input.constructor.name} is not serializable.`);
      }
      if (instancesMap.has(input)) {
        return { $ref: instancesMap.get(input) };
      }
      const $ref = instances.length;
      instances.push({ $type: input.constructor.name });
      instancesMap.set(input, $ref);
      instances[$ref] = { ...replaceObjectProperties(input), $type: input.constructor.name };
      return { $ref };
    }
    return replaceObjectProperties(input);
  }

  function replaceObjectProperties(input: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(input)) {
      result[key] = replace(input[key]);
    }
    return result;
  }
}

/**
 * Deserializes a JSON string to an object graph.
 * Handles circular references and class instances.
 * @param str - The JSON string to deserialize.
 * @returns The deserialized object graph.
 */
export function deserialize(str: string): unknown {
  const input = JSON.parse(str) as SerializationBundle;
  const instances = input.instances;

  // First, replace all objects with class instances
  for (let i = 0; i < instances.length; i++) {
    const instance = instances[i];
    const classDefinition = classDefinitions.get(instance.$type as string) as ObjectConstructor;
    delete instance.$type;
    instances[i] = Object.create(
      classDefinition.prototype,
      Object.getOwnPropertyDescriptors(instance)
    );
  }

  // Second, replace all references in the list of class instances
  for (let i = 0; i < instances.length; i++) {
    replaceObjectProperties(instances[i] as unknown as Record<string, unknown>);
  }

  // Finally, replace all references in the root object graph
  return replace(input.root);

  function replace(input: unknown): unknown {
    if (isDataView(input)) {
      return replaceArrayView(input);
    }
    if (Array.isArray(input)) {
      return replaceArray(input);
    }
    if (input && typeof input === 'object') {
      return replaceObject(input as Record<string, unknown>);
    }
    return input;
  }

  function replaceArrayView(input: ArrayViewPlaceholder): ArrayBufferView {
    const ctor = arrayViewConstructors.get(input.$type);
    if (!ctor) {
      throw new Error(`${input.$type} constructor not found`);
    }

    const binary = atob(input.$data);
    const uint8View = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      uint8View[i] = binary.charCodeAt(i);
    }

    return new ctor(uint8View.buffer);
  }

  function replaceArray(input: unknown[]): unknown[] {
    for (let i = 0; i < input.length; i++) {
      input[i] = replace(input[i]);
    }
    return input;
  }

  function replaceObject(
    input: Record<string, unknown>
  ): InstancePlaceholder | Record<string, unknown> {
    if (isRef(input)) {
      return instances[input.$ref];
    }
    replaceObjectProperties(input);
    return input;
  }

  function replaceObjectProperties(input: Record<string, unknown>): void {
    for (const [key, value] of Object.entries(input)) {
      input[key] = replace(value);
    }
  }
}

function isDataView(value: unknown): value is ArrayViewPlaceholder {
  return !!(value && typeof value === 'object' && '$type' in value && '$data' in value);
}

function isRef(value: unknown): value is ReferencePlaceholder {
  return !!(value && typeof value === 'object' && '$ref' in value);
}
