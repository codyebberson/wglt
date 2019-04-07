export interface SerializableOptions {
    valueType?: boolean;
    customSerializer?: Function;
    customDeserializer?: Function;
}
export declare function Serializable(name: string, options?: SerializableOptions): (ctor: Function) => void;
