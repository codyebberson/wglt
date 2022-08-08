import { Console } from './console';
import { Font } from './font';
import { Key, Keyboard } from './keys';
import { Mouse } from './mouse';
import { Point } from './point';
interface TerminalOptions {
    font?: Font;
    crt?: CrtOptions;
    maxFps?: number;
}
interface CrtOptions {
    scale: number;
    blur: number;
    curvature: number;
    chroma: number;
    vignette: number;
    scanlineWidth: number;
    scanlineIntensity: number;
}
export declare class Terminal extends Console {
    readonly canvas: HTMLCanvasElement;
    readonly font: Font;
    readonly crt?: CrtOptions;
    readonly maxFps?: number;
    readonly pixelWidth: number;
    readonly pixelHeight: number;
    readonly pixelScale: number;
    readonly keys: Keyboard;
    readonly mouse: Mouse;
    readonly gl: WebGLRenderingContext;
    readonly program: WebGLProgram;
    readonly positionAttribLocation: number;
    readonly textureAttribLocation: number;
    readonly fgColorAttribLocation: number;
    readonly bgColorAttribLocation: number;
    readonly positionsArray: Float32Array;
    readonly indexArray: Uint16Array;
    readonly textureArray: Float32Array;
    readonly foregroundUint8Array: Uint8Array;
    readonly foregroundDataView: DataView;
    readonly backgroundUint8Array: Uint8Array;
    readonly backgroundDataView: DataView;
    readonly positionBuffer: WebGLBuffer;
    readonly indexBuffer: WebGLBuffer;
    readonly textureBuffer: WebGLBuffer;
    readonly foregroundBuffer: WebGLBuffer;
    readonly backgroundBuffer: WebGLBuffer;
    readonly texture: WebGLTexture;
    readonly frameBufferTexture: WebGLTexture;
    readonly frameBuffer: WebGLFramebuffer;
    readonly crtProgram: WebGLProgram;
    readonly crtBlurLocation: WebGLUniformLocation;
    readonly crtCurvatureLocation: WebGLUniformLocation;
    readonly crtChromaLocation: WebGLUniformLocation;
    readonly crtScanlineWidthLocation: WebGLUniformLocation;
    readonly crtScanlineIntensityLocation: WebGLUniformLocation;
    readonly crtVignetteLocation: WebGLUniformLocation;
    readonly crtPositionLocation: number;
    readonly crtTexCoordLocation: number;
    readonly crtPositionBuffer: WebGLBuffer;
    readonly crtTexCoordBuffer: WebGLBuffer;
    private lastRenderTime;
    private renderDelta;
    fps: number;
    averageFps: number;
    update?: () => void;
    constructor(canvas: HTMLCanvasElement, width: number, height: number, options?: TerminalOptions);
    private handleResize;
    private getAttribLocation;
    private flush;
    isKeyDown(key: Key): boolean;
    isKeyPressed(key: Key): boolean;
    getKeyDownCount(key: Key): number;
    /**
     * Returns a standard roguelike movement key if pressed.
     * Implemented control systems:
     * 1) Numpad arrows
     * 2) VIM keys
     * 3) Normal arrows (4 directions only)
     * 4) Numpad 5 and '.' (period) for "wait"
     * If a key is pressed, returns the movement delta.
     * If no key is pressed, returns undefined.
     * See: http://www.roguebasin.com/index.php?title=Preferred_Key_Controls
     */
    getMovementKey(): Point | undefined;
    private buildShader;
    /**
     * Initialize a texture and load an image.
     * When the image finished loading copy it into the texture.
     * @param url
     */
    private loadTexture;
    private render;
    private renderCrt;
    private requestAnimationFrame;
    private renderLoop;
}
export {};
