export declare function createSerializeMetadata(ctor: any): SerializeMetadata;
export declare function getSerializeMetadata(ctor: any): SerializeMetadata;
export declare class SerializeMetadata {
    className: string;
    valueType: boolean;
    customSerializer?: Function;
    customDeserializer?: Function;
}
