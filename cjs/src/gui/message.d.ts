export declare class Message {
    readonly text: string | undefined;
    readonly fg?: number | undefined;
    readonly bg?: number | undefined;
    readonly children?: Message[] | undefined;
    constructor(text: string | undefined, fg?: number | undefined, bg?: number | undefined, children?: Message[] | undefined);
    getWidth(): number;
    getHeight(): number;
}
