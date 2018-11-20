import { BlendMode } from './blendmode';
import { Cell } from './cell';
import { Color } from './color';
export declare class Console {
    readonly width: number;
    readonly height: number;
    private readonly grid;
    constructor(width: number, height: number);
    clear(): void;
    getCell(x: number, y: number): Cell | undefined;
    drawChar(x: number, y: number, c: number | string | Cell, fg?: Color, bg?: Color): void;
    drawString(x: number, y: number, str: string, fg?: Color, bg?: Color): void;
    drawCenteredString(x: number, y: number, str: string, fg?: Color, bg?: Color): void;
    drawHLine(x: number, y: number, width: number, c: number | Cell, fg?: Color, bg?: Color): void;
    drawVLine(x: number, y: number, height: number, c: number | Cell, fg?: Color, bg?: Color): void;
    drawRect(x: number, y: number, width: number, height: number, c: number | Cell, fg?: Color, bg?: Color): void;
    drawDoubleBox(x: number, y: number, width: number, height: number, fg?: Color, bg?: Color): void;
    fillRect(x: number, y: number, width: number, height: number, c: number | Cell, fg?: Color, bg?: Color): void;
    drawConsole(dstX: number, dstY: number, srcConsole: Console, srcX: number, srcY: number, srcWidth: number, srcHeight: number, blendMode?: BlendMode): void;
    private drawCell;
}
