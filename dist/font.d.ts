export declare class Font {
    readonly url: string;
    readonly charWidth: number;
    readonly charHeight: number;
    readonly scale: number;
    readonly graphical: boolean;
    constructor(url: string, charWidth: number, charHeight: number, scale?: number, graphical?: boolean);
}
export declare const DEFAULT_FONT: Font;
