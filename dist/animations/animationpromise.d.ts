export declare class AnimationPromise {
    readonly handlers: Function[];
    constructor();
    then(handler: Function): this;
    resolve(): void;
}
