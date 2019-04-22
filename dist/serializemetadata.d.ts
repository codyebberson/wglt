export declare function createSerializeMetadata(ctor: any): SerializeMetadata;
export declare function getSerializeMetadata(ctor: any): SerializeMetadata;
export declare class SerializeMetadata {
    ctor: {
        new (): any;
    };
    className: string;
    valueType: boolean;
    customSerializer?: Function;
    customDeserializer?: Function;
    constructor(ctor: {
        new (): any;
    });
}
