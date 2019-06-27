import { SerializeMetadata } from "./serializemetadata";
export declare const KNOWN_CLASSES: {
    [name: string]: SerializeMetadata;
};
export interface SerializableOptions {
    valueType?: boolean;
    customSerializer?: Function;
    customDeserializer?: Function;
}
export declare function Serializable(name: string, options?: SerializableOptions): (ctor: Function) => void;
