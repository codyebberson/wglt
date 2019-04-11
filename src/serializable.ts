import { createSerializeMetadata } from "./serializemetadata";

export interface SerializableOptions {
  valueType?: boolean;
  customSerializer?: Function;
  customDeserializer?: Function;
}

export function Serializable(name: string, options?: SerializableOptions) {
  return function (ctor: Function) {
    const metadata = createSerializeMetadata(ctor);
    metadata.className = name;

    if (options) {
      metadata.valueType = !!options.valueType;
    }
  };
}
