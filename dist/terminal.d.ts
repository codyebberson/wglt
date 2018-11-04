import { Mouse } from './mouse';
export declare class Terminal {
    private canvas;
    private width;
    private height;
    private pixelWidth;
    private pixelHeight;
    private keys;
    private mouse;
    private gl;
    private program;
    private positionAttribLocation;
    private textureAttribLocation;
    private fgColorAttribLocation;
    private bgColorAttribLocation;
    private positionsArray;
    private indexArray;
    private textureArray;
    private foregroundUint8Array;
    private foregroundDataView;
    private backgroundUint8Array;
    private backgroundDataView;
    private positionBuffer;
    private indexBuffer;
    private textureBuffer;
    private foregroundBuffer;
    private backgroundBuffer;
    private texture;
    update?: Function;
    constructor(canvas: HTMLCanvasElement, width: number, height: number);
    private getAttribLocation;
    private isOutOfRange;
    setCharCode(x: number, y: number, c: number): void;
    clear(): void;
    clearRect(rectX: number, rectY: number, rectWidth: number, rectHeight: number): void;
    /**
     * Sets the foreground color of a cell.
     * @param x The horizontal coordinate.
     * @param y The vertical coordinate.
     * @param color The 32-bit color (see createColor).
     */
    setForegroundColor(x: number, y: number, color: number): void;
    /**
     * Sets the background color of a cell.
     * @param x The horizontal coordinate.
     * @param y The vertical coordinate.
     * @param color The 32-bit color (see createColor).
     */
    setBackgroundColor(x: number, y: number, color: number): void;
    /**
     * Draws a string with optional colors.
     */
    drawString(x: number, y: number, str: string, fg?: number, bg?: number): void;
    drawCenteredString(x: number, y: number, str: string, fg?: number, bg?: number): void;
    fillForegroundRect(x: number, y: number, w: number, h: number, color: number): void;
    fillBackgroundRect(x: number, y: number, w: number, h: number, color: number): void;
    isKeyDown(keyCode: number): boolean | null;
    isKeyPressed(keyCode: number): boolean;
    getKeyDownCount(keyCode: number): number;
    getMouse(): Mouse;
    private buildShader;
    /**
     * Initialize a texture and load an image.
     * When the image finished loading copy it into the texture.
     * @param url
     */
    private loadTexture;
    private render;
    private renderLoop;
}
