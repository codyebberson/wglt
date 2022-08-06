/**
 * Decorates a class to make serializable.
 * Any class with the @serializable decorator will be serialized and deserialized.
 * @param value The TypeScript class to mark as serializable.
 */
export declare function serializable(value: {
    name: string;
}): void;
/**
 * Serializes a value to JSON.
 * Handles circular references and class instances.
 * @param obj The root object to serialize.
 * @returns A string representation of the object graph.
 */
export declare function serialize(obj: unknown): string;
/**
 * Deserializes a JSON string to an object graph.
 * Handles circular references and class instances.
 * @param str The JSON string to deserialize.
 * @returns The deserialized object graph.
 */
export declare function deserialize(str: string): unknown;
