import { Console } from './console';
import { Mouse } from './mouse';
import { TerminalOptions } from './terminaloptions';
export declare class Terminal extends Console {
    private readonly canvas;
    private readonly font;
    private readonly pixelWidth;
    private readonly pixelHeight;
    private readonly keys;
    private readonly mouse;
    private readonly gl;
    private readonly program;
    private readonly positionAttribLocation;
    private readonly textureAttribLocation;
    private readonly fgColorAttribLocation;
    private readonly bgColorAttribLocation;
    private readonly positionsArray;
    private readonly indexArray;
    private readonly textureArray;
    private readonly foregroundUint8Array;
    private readonly foregroundDataView;
    private readonly backgroundUint8Array;
    private readonly backgroundDataView;
    private readonly positionBuffer;
    private readonly indexBuffer;
    private readonly textureBuffer;
    private readonly foregroundBuffer;
    private readonly backgroundBuffer;
    private readonly texture;
    update?: Function;
    constructor(canvas: HTMLCanvasElement, width: number, height: number, options?: TerminalOptions);
    private getAttribLocation;
    flush(): void;
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
