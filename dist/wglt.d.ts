declare module "blendmode" {
    /**
     * The BlendMode enum defines how translucent cells are rendered.
     */
    export enum BlendMode {
        /**
         * No blending.  Alpha is ignored.
         */
        None = 0,
        /**
         * Alpha blending.
         *
         * dstRGB = (srcRGB * srcA) + (dstRGB * (1-srcA))
         *
         * dstA = srcA + (dstA * (1-srcA))
         */
        Blend = 1,
        /**
         * Additive blending.
         *
         * dstRGB = (srcRGB * srcA) + dstRGB
         *
         * dstA = dstA
         */
        Add = 2
    }
}
declare module "color" {
    export type Color = number;
    /**
     * Creates a big-endian 32-bit RGBA color from red, green, and blue components.
     * @param r Red (0-255).
     * @param g Green (0-255).
     * @param b Blue (0-255).
     * @param a Optional alpha (0-255).
     * @return A 32-bit unsigned integer color.
     */
    export function fromRgb(r: number, g: number, b: number, a?: number): Color;
    /**
     * Converts a color from HSV format to RGBA format.
     *
     * Based on: https://stackoverflow.com/a/17243070/2051724
     *
     * @param h Hue (0.0 - 1.0).
     * @param s Saturation (0.0 - 1.0).
     * @param v Value (0.0 - 1.0).
     * @param a Optional alpha (0.0 - 1.0).
     * @return A 32-bit unsigned integer color.
     */
    export function fromHsv(h: number, s: number, v: number, a?: number): Color;
}
declare module "colors" {
    export const Colors: {
        BLACK: number;
        WHITE: number;
        LIGHT_GRAY: number;
        DARK_GRAY: number;
        YELLOW: number;
        BROWN: number;
        LIGHT_RED: number;
        DARK_RED: number;
        LIGHT_GREEN: number;
        DARK_GREEN: number;
        LIGHT_CYAN: number;
        DARK_CYAN: number;
        LIGHT_BLUE: number;
        DARK_BLUE: number;
        LIGHT_MAGENTA: number;
        DARK_MAGENTA: number;
        ORANGE: number;
    };
}
declare module "cell" {
    import { BlendMode } from "blendmode";
    import { Color } from "color";
    export class Cell {
        readonly x: number;
        readonly y: number;
        charCode: number;
        fg: Color;
        bg: Color;
        meta?: any;
        dirty: boolean;
        blocked: boolean;
        blockedSight: boolean;
        explored: boolean;
        visible: boolean;
        pathId: number;
        g: number;
        h: number;
        prev: Cell | null;
        constructor(x: number, y: number, charCode?: string | number, fg?: Color, bg?: Color, meta?: any);
        setCharCode(charCode: number): void;
        setForeground(fg: Color): void;
        setBackground(bg: Color): void;
        setMeta(meta?: any): void;
        setValue(charCode: string | number, fg?: Color, bg?: Color, meta?: any): boolean;
        drawCell(otherCell: Cell, blendMode?: BlendMode): void;
        private blendColors;
        private clamp;
    }
}
declare module "chars" {
    export enum Chars {
        SMILEY = 1,
        INVERSE_SMILEY = 2,
        HEART = 3,
        DIAMOND = 4,
        CLUB = 5,
        SPADE = 6,
        BULLET = 7,
        INVERSE_BULLET = 8,
        LIGHT_SHADE = 176,
        MEDIUM_SHADE = 177,
        DARK_SHADE = 178,
        BOX_SINGLE_VERTICAL = 179,
        BOX_SINGLE_VERTICAL_AND_SINGLE_LEFT = 180,
        BOX_DOUBLE_VERTICAL_AND_DOUBLE_LEFT = 185,
        BOX_DOUBLE_VERTICAL = 186,
        BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT = 187,
        BOX_DOUBLE_UP_AND_DOUBLE_LEFT = 188,
        BOX_SINGLE_DOWN_AND_SINGLE_LEFT = 191,
        BOX_SINGLE_UP_AND_SINGLE_RIGHT = 192,
        BOX_SINGLE_HORIZONTAL_AND_SINGLE_UP = 193,
        BOX_SINGLE_HORIZONTAL_AND_SINGLE_DOWN = 194,
        BOX_SINGLE_VERTICAL_AND_SINGLE_RIGHT = 195,
        BOX_SINGLE_HORIZONTAL = 196,
        BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL = 197,
        BOX_DOUBLE_UP_AND_DOUBLE_RIGHT = 200,
        BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT = 201,
        BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_UP = 202,
        BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_DOWN = 203,
        BOX_DOUBLE_VERTICAL_AND_DOUBLE_RIGHT = 204,
        BOX_DOUBLE_HORIZONTAL = 205,
        BOX_DOUBLE_VERTICAL_AND_DOUBLE_HORIZONTAL = 206,
        BOX_SINGLE_UP_AND_SINGLE_LEFT = 217,
        BOX_SINGLE_DOWN_AND_SINGLE_RIGHT = 218,
        BLOCK_FULL = 219,
        BLOCK_BOTTOM_HALF = 220,
        BLOCK_LEFT_HALF = 221,
        BLOCK_RIGHT_HALF = 222,
        BLOCK_TOP_HALF = 223
    }
}
declare module "console" {
    import { BlendMode } from "blendmode";
    import { Cell } from "cell";
    import { Color } from "color";
    export class Console {
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
        constructor(width: number, height: number, blockedFunc?: (x: number, y: number) => boolean);
        clear(): void;
        getCell(x: number, y: number): Cell;
        getCharCode(x: number, y: number): number;
        drawChar(x: number, y: number, c: string | number, fg?: Color, bg?: Color): void;
        drawString(x: number, y: number, str: string, fg?: Color, bg?: Color): void;
        drawCenteredString(x: number, y: number, str: string, fg?: Color, bg?: Color): void;
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
        setblockedSight(x: number, y: number, blockedSight: boolean): void;
        isVisible(x: number, y: number): boolean;
        /**
         * Compute the FOV in an octant adjacent to the Y axis
         */
        computeOctantY(deltaX: number, deltaY: number): void;
        /**
         * Compute the FOV in an octant adjacent to the X axis
         */
        computeOctantX(deltaX: number, deltaY: number): void;
        computeFov(originX: number, originY: number, radius: number, opt_noClear?: boolean, opt_octants?: number): void;
        /**
         * All visible tiles are marked as explored.
         */
        updateExplored(): void;
    }
}
declare module "boxutils" {
    export function fixBoxCells(con: any): void;
}
declare module "font" {
    export class Font {
        readonly url: string;
        readonly charWidth: number;
        readonly charHeight: number;
        readonly scale: number;
        readonly graphical: boolean;
        constructor(url: string, charWidth: number, charHeight: number, scale?: number, graphical?: boolean);
    }
    export const DEFAULT_FONT: Font;
}
declare module "fov" {
    /**
     * The FovOctants constants provide bitmasks for various directions.
     *
     *     \ 4 | 3 /
     *      \  |  /
     *    5  \ | /  2
     *        \|/
     *   ------+-------
     *        /|\
     *    6  / | \  1
     *      /  |  \
     *     / 7 | 0 \
     *
     */
    export const FovOctants: {
        OCTANT_SOUTH_SOUTHEAST: number;
        OCTANT_EAST_SOUTHEAST: number;
        OCTANT_EAST_NORTHTHEAST: number;
        OCTANT_NORTH_NORTHEAST: number;
        OCTANT_NORTH_NORTHWEST: number;
        OCTANT_WEST_NORTHEAST: number;
        OCTANT_WEST_SOUTHWEST: number;
        OCTANT_SOUTH_SOUTHWEST: number;
    };
    export const FovQuadrants: {
        QUADRANT_SOUTHEAST: number;
        QUADRANT_EAST: number;
        QUADRANT_NORTHEAST: number;
        QUADRANT_NORTH: number;
        QUADRANT_NORTHWEST: number;
        QUADRANT_WEST: number;
        QUADRANT_SOUTHWEST: number;
        QUADRANT_SOUTH: number;
    };
    export function getFovQuadrant(dx: number, dy: number): number;
}
declare module "point" {
    export class Point {
        readonly x: number;
        readonly y: number;
        constructor(x: number, y: number);
    }
}
declare module "rect" {
    import { Point } from "point";
    export class Rect {
        readonly x: number;
        readonly y: number;
        readonly width: number;
        readonly height: number;
        readonly left: number;
        readonly top: number;
        readonly x2: number;
        readonly y2: number;
        constructor(x: number, y: number, width: number, height: number);
        getCenter(): Point;
        intersects(other: Rect): boolean;
        contains(point: Rect): boolean;
    }
}
declare module "input" {
    /**
     * The Input class represents a pysical input.
     * Example: keyboard key or mouse button.
     */
    export class Input {
        down: boolean;
        downCount: number;
        upCount: number;
        constructor();
        update(): void;
        /**
         * Returns true if the input is "pressed".
         * Pressed is a one time event when the input first goes down.
         * It then repeats on repeat delay.
         */
        isPressed(): boolean;
        /**
         * Returns true if the input is "clicked".
         * Clicked is a one time event when the input first goes up.
         */
        isClicked(): boolean;
    }
}
declare module "keys" {
    import { Input } from "input";
    export class Keyboard {
        readonly keys: Input[];
        /**
         * Creates a new keyboard module.
         *
         * @param el DOM el to attach listeners.
         */
        constructor(el: HTMLElement);
        setKey(e: KeyboardEvent, state: boolean): void;
        updateKeys(): void;
        getKey(keyCode: number): Input;
    }
    export enum Keys {
        VK_CANCEL = 3,
        VK_HELP = 6,
        VK_BACK_SPACE = 8,
        VK_TAB = 9,
        VK_CLEAR = 12,
        VK_ENTER = 13,
        VK_SHIFT = 16,
        VK_CONTROL = 17,
        VK_ALT = 18,
        VK_PAUSE = 19,
        VK_CAPS_LOCK = 20,
        VK_ESCAPE = 27,
        VK_SPACE = 32,
        VK_PAGE_UP = 33,
        VK_PAGE_DOWN = 34,
        VK_END = 35,
        VK_HOME = 36,
        VK_LEFT = 37,
        VK_UP = 38,
        VK_RIGHT = 39,
        VK_DOWN = 40,
        VK_PRINTSCREEN = 44,
        VK_INSERT = 45,
        VK_DELETE = 46,
        VK_0 = 48,
        VK_1 = 49,
        VK_2 = 50,
        VK_3 = 51,
        VK_4 = 52,
        VK_5 = 53,
        VK_6 = 54,
        VK_7 = 55,
        VK_8 = 56,
        VK_9 = 57,
        VK_COLON = 58,
        VK_SEMICOLON = 59,
        VK_LESS_THAN = 60,
        VK_EQUALS = 61,
        VK_GREATER_THAN = 62,
        VK_QUESTION_MARK = 63,
        VK_AT = 64,
        VK_A = 65,
        VK_B = 66,
        VK_C = 67,
        VK_D = 68,
        VK_E = 69,
        VK_F = 70,
        VK_G = 71,
        VK_H = 72,
        VK_I = 73,
        VK_J = 74,
        VK_K = 75,
        VK_L = 76,
        VK_M = 77,
        VK_N = 78,
        VK_O = 79,
        VK_P = 80,
        VK_Q = 81,
        VK_R = 82,
        VK_S = 83,
        VK_T = 84,
        VK_U = 85,
        VK_V = 86,
        VK_W = 87,
        VK_X = 88,
        VK_Y = 89,
        VK_Z = 90,
        VK_CONTEXT_MENU = 93,
        VK_NUMPAD0 = 96,
        VK_NUMPAD1 = 97,
        VK_NUMPAD2 = 98,
        VK_NUMPAD3 = 99,
        VK_NUMPAD4 = 100,
        VK_NUMPAD5 = 101,
        VK_NUMPAD6 = 102,
        VK_NUMPAD7 = 103,
        VK_NUMPAD8 = 104,
        VK_NUMPAD9 = 105,
        VK_MULTIPLY = 106,
        VK_ADD = 107,
        VK_SEPARATOR = 108,
        VK_SUBTRACT = 109,
        VK_DECIMAL = 110,
        VK_DIVIDE = 111,
        VK_F1 = 112,
        VK_F2 = 113,
        VK_F3 = 114,
        VK_F4 = 115,
        VK_F5 = 116,
        VK_F6 = 117,
        VK_F7 = 118,
        VK_F8 = 119,
        VK_F9 = 120,
        VK_F10 = 121,
        VK_F11 = 122,
        VK_F12 = 123,
        VK_F13 = 124,
        VK_F14 = 125,
        VK_F15 = 126,
        VK_F16 = 127,
        VK_F17 = 128,
        VK_F18 = 129,
        VK_F19 = 130,
        VK_F20 = 131,
        VK_F21 = 132,
        VK_F22 = 133,
        VK_F23 = 134,
        VK_F24 = 135,
        VK_NUM_LOCK = 144,
        VK_SCROLL_LOCK = 145,
        VK_CIRCUMFLEX = 160,
        VK_EXCLAMATION = 161,
        VK_DOUBLE_QUOTE = 162,
        VK_HASH = 163,
        VK_DOLLAR = 164,
        VK_PERCENT = 165,
        VK_AMPERSAND = 166,
        VK_UNDERSCORE = 167,
        VK_OPEN_PAREN = 168,
        VK_CLOSE_PAREN = 169,
        VK_ASTERISK = 170,
        VK_PLUS = 171,
        VK_PIPE = 172,
        VK_HYPHEN_MINUS = 173,
        VK_OPEN_CURLY_BRACKET = 174,
        VK_CLOSE_CURLY_BRACKET = 175,
        VK_TILDE = 176,
        VK_COMMA = 188,
        VK_PERIOD = 190,
        VK_SLASH = 191,
        VK_BACK_QUOTE = 192,
        VK_OPEN_BRACKET = 219,
        VK_BACK_SLASH = 220,
        VK_CLOSE_BRACKET = 221,
        VK_QUOTE = 222,
        VK_META = 224,
        VK_ALTGR = 225,
        VK_WIN = 91,
        VK_KANA = 21,
        VK_HANGUL = 21,
        VK_EISU = 22,
        VK_JUNJA = 23,
        VK_FINAL = 24,
        VK_HANJA = 25,
        VK_KANJI = 25,
        VK_CONVERT = 28,
        VK_NONCONVERT = 29,
        VK_ACCEPT = 30,
        VK_MODECHANGE = 31,
        VK_SELECT = 41,
        VK_PRINT = 42,
        VK_EXECUTE = 43,
        VK_SLEEP = 95
    }
}
declare module "mouse" {
    import { Input } from "input";
    import { Terminal } from "terminal";
    export class Mouse {
        readonly el: HTMLCanvasElement;
        readonly width: number;
        readonly height: number;
        readonly options: any;
        private prevX;
        private prevY;
        x: number;
        y: number;
        dx: number;
        dy: number;
        readonly buttons: Input[];
        constructor(terminal: Terminal, options: any);
        handleTouchEvent(e: TouchEvent): void;
        handleEvent(e: MouseEvent): void;
        updatePosition(clientX: number, clientY: number): void;
        requestFullscreen(): void;
        update(): void;
    }
}
declare module "shaders" {
    /**
     * Vertex shader program.
     *
     * a = attribute vec2 aVertexPosition;
     * b = attribute vec2 aTextureCoord;
     * c = attribute vec3 aFgColor;
     * d = attribute vec3 aBgColor;
     * e = varying vec2 vTextureCoord;
     * f = varying vec4 vFgColor;
     * g = varying vec4 vBgColor;
     */
    export const VERTEX_SHADER_SOURCE: string;
    /**
     * Fragment shader program.
     *
     * e = varying vec2 vTextureCoord;
     * f = varying vec4 vFgColor;
     * g = varying vec4 vBgColor;
     * h = uniform bool uGraphicalTiles;
     * s = uniform sampler2D uSampler;
     */
    export const FRAGMENT_SHADER_SOURCE: string;
}
declare module "terminal" {
    import { Console } from "console";
    import { Font } from "font";
    import { Keyboard } from "keys";
    import { Mouse } from "mouse";
    export class Terminal extends Console {
        readonly canvas: HTMLCanvasElement;
        readonly font: Font;
        readonly pixelWidth: number;
        readonly pixelHeight: number;
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
        update?: () => void;
        constructor(canvas: HTMLCanvasElement, width: number, height: number, options?: any);
        private handleResize;
        private getAttribLocation;
        private flush;
        isKeyDown(keyCode: number): boolean;
        isKeyPressed(keyCode: number): boolean;
        getKeyDownCount(keyCode: number): number;
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
}
declare module "gui/dialog" {
    import { Rect } from "rect";
    import { Point } from "point";
    import { Console } from "console";
    import { Terminal } from "terminal";
    export abstract class Dialog {
        readonly contentsRect: Rect;
        readonly title: string;
        constructor(contentsRect: Rect, title: string);
        abstract drawContents(console: Console, offset: Point): void;
        abstract handleInput(terminal: Terminal, offset: Point): boolean;
    }
}
declare module "gui/dialogstate" {
    import { Point } from "point";
    import { Rect } from "rect";
    import { Dialog } from "gui/dialog";
    import { Console } from "console";
    export class DialogState {
        readonly dialog: Dialog;
        readonly rect: Rect;
        readonly contentsOffset: Point;
        open: boolean;
        count: number;
        buffer?: Console;
        constructor(dialog: Dialog, rect: Rect, contentsOffset: Point);
    }
}
declare module "gui/dialogrenderer" {
    import { Terminal } from "terminal";
    import { DialogState } from "gui/dialogstate";
    import { Dialog } from "gui/dialog";
    export interface DialogRenderer {
        getState(terminal: Terminal, dialog: Dialog): DialogState;
        draw(term: Terminal, dialogState: DialogState): void;
    }
}
declare module "gui/defaultdialogrenderer" {
    import { DialogState } from "gui/dialogstate";
    import { Terminal } from "terminal";
    import { Dialog } from "gui/dialog";
    export class DefaultDialogRenderer {
        getState(terminal: Terminal, dialog: Dialog): DialogState;
        draw(term: Terminal, dialogState: DialogState): void;
    }
}
declare module "gui" {
    import { Dialog } from "gui/dialog";
    import { DialogState } from "gui/dialogstate";
    import { DialogRenderer } from "gui/dialogrenderer";
    import { Terminal } from "terminal";
    export class GUI {
        readonly terminal: Terminal;
        readonly renderer: DialogRenderer;
        readonly dialogs: DialogState[];
        constructor(terminal: Terminal, renderer?: DialogRenderer);
        add(dialog: Dialog): void;
        handleInput(): boolean;
        draw(): void;
    }
}
declare module "gui/messagedialog" {
    import { Dialog } from "gui/dialog";
    import { Console } from "console";
    import { Terminal } from "terminal";
    import { Point } from "point";
    export class MessageDialog extends Dialog {
        readonly lines: string[];
        constructor(title: string, message: string);
        drawContents(console: Console, offset: Point): void;
        handleInput(terminal: Terminal, offset: Point): boolean;
    }
}
declare module "gui/selectdialog" {
    import { Dialog } from "gui/dialog";
    import { Point } from "point";
    import { Console } from "console";
    import { Terminal } from "terminal";
    export class SelectDialog extends Dialog {
        readonly options: string[];
        readonly callback: (i: number) => void;
        constructor(title: string, options: string[], callback: (i: number) => void);
        drawContents(console: Console, offset: Point): void;
        handleInput(terminal: Terminal, offset: Point): boolean;
    }
}
declare module "image" {
    import { Console } from "console";
    export function loadImage(url: string, callback: (img: Console) => void): void;
    export function loadImage2x(url: string, callback: (img: Console) => void): void;
}
declare module "path" {
    import { Console } from "console";
    import { Point } from "point";
    /**
     * Calculates Dijkstra's algorithm.
     *
     * @param {!Object} source Starting point, must have x and y properties.
     * @param {!Object=} opt_dest Optional destination point, must have x and y properties.
     * @param {!number=} opt_maxDist Optional maximum distance to examine.
     * @return {?Array} Array of steps if destination found; null otherwise.
     */
    export function computePath(map: Console, source: Point, dest: Point, maxDist: number): any[];
}
declare module "rng" {
    /**
     * Random number generator.
     *
     * LCG
     * https://stackoverflow.com/a/424445/2051724
     */
    export class RNG {
        private m;
        private a;
        private c;
        private state;
        /**
         * Creates a new random number generator.
         *
         * @param seed The integer seed.
         */
        constructor(seed?: number);
        nextInt(): number;
        /**
         * Returns a floating point number between 0.0 and 1.0.
         */
        nextFloat(): number;
        /**
         * Returns an integer in the range start (inclusive) to end (exclusive).
         * @param start Lower bound, inclusive.
         * @param end Upper bound, exclusive.
         */
        nextRange(start: number, end: number): number;
        chooseIndex(chances: any[]): number;
        chooseKey(chancesMap: any): any;
    }
}
declare module "wglt" {
    export * from "blendmode";
    export * from "boxutils";
    export * from "cell";
    export * from "chars";
    export * from "color";
    export * from "colors";
    export * from "console";
    export * from "font";
    export * from "fov";
    export * from "gui";
    export * from "gui/defaultdialogrenderer";
    export * from "gui/dialog";
    export * from "gui/dialogstate";
    export * from "gui/messagedialog";
    export * from "gui/selectdialog";
    export * from "image";
    export * from "keys";
    export * from "mouse";
    export * from "path";
    export * from "point";
    export * from "rect";
    export * from "rng";
    export * from "terminal";
}
