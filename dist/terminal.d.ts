import { Console } from './console';
import { Font } from './font';
import { Mouse } from './mouse';
export declare class Terminal extends Console {
    private canvas;
    private font;
    private scale;
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
    constructor(canvas: HTMLCanvasElement, width: number, height: number, font?: Font, scale?: number);
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
