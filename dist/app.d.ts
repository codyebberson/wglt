import { AppOptions } from './appoptions';
import { AppState } from './appstate';
import { Color } from './color';
import { Font } from './font';
import { Keyboard } from './keyboard';
import { Mouse } from './mouse';
import { Rect } from './rect';
import { RenderSet } from './renderset';
import { Vec2 } from './vec2';
export declare class App {
    readonly canvas: HTMLCanvasElement;
    readonly gl: WebGLRenderingContext;
    readonly size: Rect;
    readonly font: Font;
    readonly mobile: boolean;
    fillWindow: boolean;
    scaleFactor: number;
    readonly center: Vec2;
    readonly renderSet: RenderSet;
    readonly keyboard: Keyboard;
    readonly mouse: Mouse;
    state?: AppState;
    constructor(options: AppOptions);
    /**
     * Handles window resize events.
     * Updates canvas size.
     */
    handleResizeEvent(): void;
    /**
     * Returns if the browser is on a mobile device.
     * Run once at startup.
     */
    private isMobile;
    renderLoop(): void;
    private resetGl;
    /**
     * Draws a sprite.
     * @param {number} x The x-coordinate of the top-left corner on the screen.
     * @param {number} y The y-coordinate of the top-left corner on the screen.
     * @param {number} u The x-coordinate of the top-left corner on the sprite sheet.
     * @param {number} v The y-coordinate of the top-left corner on the sprite sheet.
     * @param {number} w The width of the sprite.
     * @param {number} h The height of the sprite.
     * @param {Color=} color Optional color.
     * @param {number=} dw Optional destination width.
     * @param {number=} dh Optional destination height.
     */
    drawImage(x: number, y: number, u: number, v: number, w: number, h: number, color?: Color, dw?: number, dh?: number): void;
    /**
     * Draws a string.
     * @param {string} str The text string to draw.
     * @param {number} x The x-coordinate of the top-left corner.
     * @param {number} y The y-coordinate of the top-left corner.
     * @param {Color=} color Optional color.
     */
    drawString(str: string, x: number, y: number, color?: Color): void;
    /**
     * Draws a string horizontally centered.
     * @param {string} str The text string to draw.
     * @param {number} x The x-coordinate of the center.
     * @param {number} y The y-coordinate of the top-left corner.
     * @param {Color=} color Optional color.
     */
    drawCenteredString(str: string, x: number, y: number, color?: Color): void;
    /**
     * Draws a right-aligned string.
     * @param {string} str The text string to draw.
     * @param {number} x The x-coordinate of the top-right corner.
     * @param {number} y The y-coordinate of the top-right corner.
     * @param {number=} color Optional color.
     */
    drawRightString(str: string, x: number, y: number, color?: Color): void;
    isKeyDown(keyCode: number): boolean | null;
    isKeyPressed(keyCode: number): boolean;
    isDownLeftKeyPressed(): boolean;
    isDownKeyPressed(): boolean;
    isDownRightKeyPressed(): boolean;
    isLeftKeyPressed(): boolean;
    isWaitKeyPressed(): boolean;
    isRightKeyPressed(): boolean;
    isUpLeftKeyPressed(): boolean;
    isUpKeyPressed(): boolean;
    isUpRightKeyPressed(): boolean;
    private isKeyArrayPressed;
}
