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

const classDefinitions = new Map<string, ObjectConstructor>();

/**
 * Decorates a class to make serializable.
 * Any class with the @serializable decorator will be serialized and deserialized.
 * @param value The TypeScript class to mark as serializable.
 */
export function serializable(value: { name: string }): void {
  classDefinitions.set(value.name, value as ObjectConstructor);
}

/**
 * Serializes a value to JSON.
 * Handles circular references and class instances.
 * @param obj The root object to serialize.
 * @returns A string representation of the object graph.
 */
export function serialize(obj: unknown): string {
  const instances: InstancePlaceholder[] = [];
  const instancesMap = new WeakMap<object, number>();
  const root = replace(obj);
  return JSON.stringify({ instances, root });

  function replace(input: unknown): unknown {
    if (Array.isArray(input)) {
      return replaceArray(input);
    } else if (input && typeof input === 'object') {
      return replaceObject(input as Record<string, unknown>);
    } else {
      return input;
    }
  }

  function replaceArray(input: unknown[]): unknown[] {
    const result = [];
    for (let i = 0; i < input.length; i++) {
      result[i] = replace(input[i]);
    }
    return result;
  }

  function replaceObject(input: Record<string, unknown>): Record<string, unknown> {
    if (input && input.constructor.name && input.constructor.name !== 'Object') {
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
 * @param str The JSON string to deserialize.
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
    instances[i] = Object.create(classDefinition.prototype, Object.getOwnPropertyDescriptors(instance));
  }

  // Second, replace all references in the list of class instances
  for (let i = 0; i < instances.length; i++) {
    replaceObjectProperties(instances[i] as unknown as Record<string, unknown>);
  }

  // Finally, replace all references in the root object graph
  return replace(input.root);

  function replace(input: unknown): unknown {
    if (Array.isArray(input)) {
      return replaceArray(input);
    } else if (input && typeof input === 'object') {
      return replaceObject(input as Record<string, unknown>);
    } else {
      return input;
    }
  }

  function replaceArray(input: unknown[]): unknown[] {
    for (let i = 0; i < input.length; i++) {
      input[i] = replace(input[i]);
    }
    return input;
  }

  function replaceObject(input: Record<string, unknown>): InstancePlaceholder | Record<string, unknown> {
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

function isRef(value: unknown): value is ReferencePlaceholder {
  return !!(value && typeof value === 'object' && '$ref' in value);
}
