import { BlendMode } from './blendmode';
import { Cell } from './cell';
import { Color } from './color';
import { Message } from './gui/message';
import { Rect } from './rect';
export declare class Console {
    readonly width: number;
    readonly height: number;
    readonly grid: Cell[][];
    originX: number;
    originY: number;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    radius: number;
    clip?: Rect;
    constructor(width: number, height: number, blockedFunc?: (x: number, y: number) => boolean);
    clear(): void;
    getCell(x: number, y: number): Cell | undefined;
    getCharCode(x: number, y: number): number | undefined;
    drawChar(x: number, y: number, c: string | number, fg?: Color, bg?: Color): void;
    drawString(x: number, y: number, str: string, fg?: Color, bg?: Color): void;
    drawStringLine(x: number, y: number, line: string, fg?: Color, bg?: Color): void;
    drawCenteredString(x: number, y: number, str: string, fg?: Color, bg?: Color): void;
    drawMessage(x: number, y: number, message: Message, maxWidth?: number): number;
    drawHLine(x: number, y: number, width: number, c: string | number, fg?: Color, bg?: Color): void;
    drawVLine(x: number, y: number, height: number, c: string | number, fg?: Color, bg?: Color): void;
    drawRect(x: number, y: number, width: number, height: number, c: string | number, fg?: Color, bg?: Color): void;
    drawBox(x: number, y: number, width: number, height: number, topChar: number, rightChar: number, bottomChar: number, leftChar: number, topLeftChar: number, topRightChar: number, bottomRightChar: number, bottomLeftChar: number, fg?: Color, bg?: Color): void;
    drawSingleBox(x: number, y: number, width: number, height: number, fg?: Color, bg?: Color): void;
    drawDoubleBox(x: number, y: number, width: number, height: number, fg?: Color, bg?: Color): void;
    fillRect(x: number, y: number, width: number, height: number, c: string | number, fg?: Color, bg?: Color): void;
    drawConsole(dstX: number, dstY: number, srcConsole: Console, srcX: number, srcY: number, srcWidth: number, srcHeight: number, blendMode?: BlendMode): void;
    drawCell(x: number, y: number, cell: Cell, blendMode?: BlendMode): void;
    setBlocked(x: number, y: number, blocked: boolean): void;
    setBlockedSight(x: number, y: number, blockedSight: boolean): void;
    isVisible(x: number, y: number): boolean;
    isBlocked(x: number, y: number): boolean;
    isBlockedSight(x: number, y: number): boolean;
    /**
     * Compute the FOV in an octant adjacent to the Y axis
     */
    private computeOctantY;
    /**
     * Compute the FOV in an octant adjacent to the X axis
     */
    private computeOctantX;
    computeFov(originX: number, originY: number, radius: number, opt_noClear?: boolean, opt_octants?: number): void;
    /**
     * All visible tiles are marked as explored.
     */
    updateExplored(): void;
}
