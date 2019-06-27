export declare class Deserializer {
    private readonly refs;
    private readonly instances;
    private readonly root;
    constructor(obj: any);
    deserialize(): any;
    private deserializeObject;
}
