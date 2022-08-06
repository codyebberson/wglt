import { BlendMode } from './blendmode';
import { Color } from './color';
export declare class Cell {
    readonly x: number;
    readonly y: number;
    charCode: number;
    fg: Color;
    bg: Color;
    dirty: boolean;
    blocked: boolean;
    blockedSight: boolean;
    explored: boolean;
    visible: boolean;
    pathId: number;
    g: number;
    h: number;
    prev: Cell | null;
    constructor(x: number, y: number, charCode?: string | number, fg?: Color, bg?: Color);
    setCharCode(charCode: number): void;
    setForeground(fg: Color): void;
    setBackground(bg: Color): void;
    setValue(charCode: string | number, fg?: Color, bg?: Color): boolean;
    drawCell(otherCell: Cell, blendMode?: BlendMode): void;
    private blendColors;
    private clamp;
}
