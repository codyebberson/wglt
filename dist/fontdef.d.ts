import { Rect } from './rect';
export declare abstract class Font {
    abstract getOffset(charCode: number): number;
    abstract getWidth(charCode: number): number;
    abstract getHeight(): number;
    /**
     * Returns whether the character is in the printable range.
     * @param charCode The integer character ASCII code.
     */
    isInRange(charCode: number): boolean;
    /**
     * Returns the width of a string with the currently configured font.
     * @param str The text string.
     */
    getStringWidth(str: string): number;
}
export declare class MonospacedFont extends Font {
    readonly glyphSize: Rect;
    constructor(glyphSize: Rect);
    getOffset(charCode: number): number;
    getWidth(): number;
    getHeight(): number;
}
export declare class ProportionalFont extends Font {
    readonly height: number;
    readonly widths: number[];
    readonly offsets: number[];
    constructor(height: number, widths: number[]);
    getOffset(charCode: number): number;
    getWidth(charCode: number): number;
    getHeight(): number;
}
export declare const FONT_04B03: ProportionalFont;
