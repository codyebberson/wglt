import { Color } from './color';
import { Font } from './font';
import { ExtendedTexture } from './glutils';
import { Vec2 } from './vec2';
export declare class RenderSet {
    readonly font: Font;
    readonly gl: WebGLRenderingContext;
    readonly program: WebGLProgram;
    readonly viewportSizeLocation: WebGLUniformLocation;
    readonly positionLocation: number;
    readonly texcoordLocation: number;
    readonly colorLocation: number;
    readonly positionBuffer: WebGLBuffer;
    readonly texcoordBuffer: WebGLBuffer;
    readonly colorBuffer: WebGLBuffer;
    readonly spriteTexture: ExtendedTexture;
    readonly positionArray: Float32Array;
    positionArrayIndex: number;
    readonly texcoordArray: Float32Array;
    texcoordArrayIndex: number;
    readonly colorUint8Array: Uint8Array;
    readonly colorDataView: DataView;
    colorArrayIndex: number;
    constructor(gl: WebGLRenderingContext, url: string, font: Font);
    /**
     * Draws a string horizontally centered.
     * @param {string} str The text string to draw.
     * @param {number} x The x-coordinate of the center.
     * @param {number} y The y-coordinate of the top-left corner.
     * @param {number=} color Optional color.
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
    /**
     * Draws a string.
     * @param {string} str The text string to draw.
     * @param {number} x0 The x-coordinate of the top-left corner.
     * @param {number} y0 The y-coordinate of the top-left corner.
     * @param {Color=} color Optional color.
     * @param {Vec2=} out Optional output location of cursor.
     */
    drawString(str: string, x0: number, y0: number, color?: Color, out?: Vec2): void;
    /**
     * Draws a character.
     * @param {number} c The ASCII character code.
     * @param {number} x The x-coordinate of the top-left corner.
     * @param {number} y The y-coordinate of the top-left corner.
     * @param {number=} color Optional color.
     */
    drawChar(c: number, x: number, y: number, color?: Color): void;
    /**
     * Draws a sprite.
     * @param {number} x The x-coordinate of the top-left corner on the screen.
     * @param {number} y The y-coordinate of the top-left corner on the screen.
     * @param {number} u The x-coordinate of the top-left corner on the sprite sheet.
     * @param {number} v The y-coordinate of the top-left corner on the sprite sheet.
     * @param {number} w The width of the sprite.
     * @param {number} h The height of the sprite.
     * @param {number=} color Optional color.
     * @param {number=} dw Optional destination width.
     * @param {number=} dh Optional destination height.
     */
    drawImage(x: number, y: number, u: number, v: number, w: number, h: number, optColor?: Color, optDw?: number, optDh?: number): void;
    /**
     * Renders all sprites in the sprite buffers to the screen.
     * @param {number} width Viewport width.
     * @param {number} height Viewport height.
     */
    flush(width: number, height: number): void;
}
