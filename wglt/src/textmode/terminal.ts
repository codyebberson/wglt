import { BaseApp } from '../core/baseapp';
import { Color } from '../core/color';
import { FONT_IBM_BIOS, MonospacedFont } from '../core/font';
import { Button } from '../core/gui/button';
import { Dialog } from '../core/gui/dialog';
import { Panel } from '../core/gui/panel';
import { Key } from '../core/keys';
import { Mouse } from '../core/mouse';
import { Point } from '../core/point';
import { Rect } from '../core/rect';
import { interpolate } from '../core/utils';
import { BlendMode } from './blendmode';
import { Cell } from './cell';
import { Console } from './console';
import { IBM_BIOS_FONT_DATA_URL } from './font';
import { FRAGMENT_SHADER_SOURCE, VERTEX_SHADER_SOURCE } from './shaders';

export interface TerminalOptions {
  fontUrl?: string;
  font?: MonospacedFont;
  movementKeys?: Partial<Record<Key, Point>>;
  maxFps?: number;
}

const DEFAULT_MOVEMENT_KEYS: Partial<Record<Key, Point>> = {
  // Up
  [Key.VK_K]: new Point(0, -1),
  [Key.VK_UP]: new Point(0, -1),
  [Key.VK_NUMPAD8]: new Point(0, -1),
  // Down
  [Key.VK_J]: new Point(0, 1),
  [Key.VK_DOWN]: new Point(0, 1),
  [Key.VK_NUMPAD2]: new Point(0, 1),
  // Left
  [Key.VK_H]: new Point(-1, 0),
  [Key.VK_LEFT]: new Point(-1, 0),
  [Key.VK_NUMPAD4]: new Point(-1, 0),
  // Right
  [Key.VK_L]: new Point(1, 0),
  [Key.VK_RIGHT]: new Point(1, 0),
  [Key.VK_NUMPAD6]: new Point(1, 0),
  // Top-left
  [Key.VK_Y]: new Point(-1, -1),
  [Key.VK_NUMPAD7]: new Point(-1, -1),
  // Top-right
  [Key.VK_U]: new Point(1, -1),
  [Key.VK_NUMPAD9]: new Point(1, -1),
  // Bottom-left
  [Key.VK_B]: new Point(-1, 1),
  [Key.VK_NUMPAD1]: new Point(-1, 1),
  // Bottom-right
  [Key.VK_N]: new Point(1, 1),
  [Key.VK_NUMPAD3]: new Point(1, 1),
  // Wait
  [Key.VK_PERIOD]: new Point(0, 0),
  [Key.VK_NUMPAD5]: new Point(0, 0),
};

const DEFAULT_OPTIONS: TerminalOptions = {
  fontUrl: IBM_BIOS_FONT_DATA_URL,
  font: FONT_IBM_BIOS,
  movementKeys: DEFAULT_MOVEMENT_KEYS,
};

export class Terminal extends BaseApp {
  readonly console: Console;
  readonly pixelWidth: number;
  readonly pixelHeight: number;
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
  private lastRenderTime: number;
  private renderDelta: number;
  fps: number;
  averageFps: number;

  constructor(
    canvasOrSelector: HTMLCanvasElement | string,
    width: number,
    height: number,
    options: TerminalOptions = DEFAULT_OPTIONS
  ) {
    const canvas =
      typeof canvasOrSelector === 'string'
        ? (document.querySelector(canvasOrSelector) as HTMLCanvasElement)
        : canvasOrSelector;

    const font = options.font ?? FONT_IBM_BIOS;
    const pixelWidth = width * font.glyphSize.width;
    const pixelHeight = height * font.glyphSize.height;

    const mouse = new Mouse(canvas, width, height);

    super(canvas, new Rect(0, 0, pixelWidth, pixelHeight), font, mouse);

    this.console = new Console(width, height);
    this.pixelWidth = pixelWidth;
    this.pixelHeight = pixelHeight;

    const gl = this.gl;
    const program = gl.createProgram();
    if (!program) {
      throw new Error('Unable to initialize WebGL. Your browser may not support it.');
    }

    this.program = program;

    gl.attachShader(program, this.buildShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE));
    gl.attachShader(program, this.buildShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE));
    gl.linkProgram(program);
    gl.useProgram(program);

    this.positionAttribLocation = this.getAttribLocation('a');
    this.textureAttribLocation = this.getAttribLocation('b');
    this.fgColorAttribLocation = this.getAttribLocation('c');
    this.bgColorAttribLocation = this.getAttribLocation('d');

    const cellCount = width * height;
    this.positionsArray = new Float32Array(cellCount * 3 * 4);
    this.indexArray = new Uint16Array(cellCount * 6);
    this.textureArray = new Float32Array(cellCount * 2 * 4);
    this.foregroundUint8Array = new Uint8Array(cellCount * 4 * 4);
    this.foregroundDataView = new DataView(this.foregroundUint8Array.buffer);
    this.backgroundUint8Array = new Uint8Array(cellCount * 4 * 4);
    this.backgroundDataView = new DataView(this.backgroundUint8Array.buffer);

    // Init the positions buffer
    let i = 0;
    let j = 0;
    let k = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Top-left
        this.positionsArray[i++] = interpolate(x, width);
        this.positionsArray[i++] = -interpolate(y, height);

        // Top-right
        this.positionsArray[i++] = interpolate(x + 1, width);
        this.positionsArray[i++] = -interpolate(y, height);

        // Bottom-right
        this.positionsArray[i++] = interpolate(x + 1, width);
        this.positionsArray[i++] = -interpolate(y + 1, height);

        // Bottom-left
        this.positionsArray[i++] = interpolate(x, width);
        this.positionsArray[i++] = -interpolate(y + 1, height);

        this.indexArray[j++] = k + 0;
        this.indexArray[j++] = k + 1;
        this.indexArray[j++] = k + 2;
        this.indexArray[j++] = k + 0;
        this.indexArray[j++] = k + 2;
        this.indexArray[j++] = k + 3;

        k += 4;
      }
    }

    this.positionBuffer = gl.createBuffer() as WebGLBuffer;
    this.indexBuffer = gl.createBuffer() as WebGLBuffer;
    this.textureBuffer = gl.createBuffer() as WebGLBuffer;
    this.foregroundBuffer = gl.createBuffer() as WebGLBuffer;
    this.backgroundBuffer = gl.createBuffer() as WebGLBuffer;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.positionsArray, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexArray, gl.STATIC_DRAW);

    this.texture = this.loadTexture(options.fontUrl ?? IBM_BIOS_FONT_DATA_URL);

    this.lastRenderTime = 0;
    this.renderDelta = 0;
    this.fps = 0;
    this.averageFps = 0;
  }

  private getAttribLocation(name: string): number {
    const location = this.gl.getAttribLocation(this.program, name);
    this.gl.enableVertexAttribArray(location);
    return location;
  }

  private flush(): void {
    let textureArrayIndex = 0;
    let colorArrayIndex = 0;

    for (let y = 0; y < this.console.height; y++) {
      for (let x = 0; x < this.console.width; x++) {
        const cell = this.console.getCell(x, y) as Cell;
        cell.dirty = true;

        if (!cell.dirty) {
          textureArrayIndex += 8;
          colorArrayIndex += 16;
          continue;
        }

        const textureX = cell.charCode % 16;
        const textureY = (cell.charCode / 16) | 0;

        this.textureArray[textureArrayIndex++] = textureX;
        this.textureArray[textureArrayIndex++] = textureY;

        this.textureArray[textureArrayIndex++] = textureX + 1;
        this.textureArray[textureArrayIndex++] = textureY;

        this.textureArray[textureArrayIndex++] = textureX + 1;
        this.textureArray[textureArrayIndex++] = textureY + 1;

        this.textureArray[textureArrayIndex++] = textureX;
        this.textureArray[textureArrayIndex++] = textureY + 1;

        for (let i = 0; i < 4; i++) {
          this.foregroundDataView.setUint32(colorArrayIndex, cell.fg, false);
          this.backgroundDataView.setUint32(colorArrayIndex, cell.bg, false);
          colorArrayIndex += 4;
        }

        cell.dirty = false;
      }
    }
  }

  private buildShader(type: number, source: string): WebGLShader {
    const gl = this.gl;
    const sh = gl.createShader(type);
    if (!sh) {
      throw new Error('An error occurred compiling the shader: ');
    }
    gl.shaderSource(sh, source);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      throw new Error(`An error occurred compiling the shader: ${gl.getShaderInfoLog(sh)}`);
    }
    return sh;
  }

  /**
   * Initialize a texture and load an image.
   * When the image finished loading copy it into the texture.
   * @param url - The texture image URL.
   */
  private loadTexture(url: string): WebGLTexture {
    const gl = this.gl;
    const texture = gl.createTexture() as WebGLTexture;
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Because images have to be download over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 0, 255]); // opaque black
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      srcFormat,
      srcType,
      pixel
    );

    const image = new Image();
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    };
    image.src = url;

    return texture;
  }

  //
  // Draw the scene.
  //
  private render(): void {
    const gl = this.gl;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, this.pixelWidth, this.pixelHeight);

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute
    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
      gl.vertexAttribPointer(
        this.positionAttribLocation,
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
    }

    // Tell WebGL how to pull out the texture coordinates from
    // the texture coordinate buffer into the textureCoord attribute.
    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.textureArray, gl.DYNAMIC_DRAW);
      gl.vertexAttribPointer(
        this.textureAttribLocation,
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
    }

    // Foreground color
    {
      const numComponents = 4;
      const type = gl.UNSIGNED_BYTE;
      const normalize = true;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.foregroundBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.foregroundUint8Array, gl.DYNAMIC_DRAW);
      gl.vertexAttribPointer(
        this.fgColorAttribLocation,
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
    }

    // Background color
    {
      const numComponents = 4;
      const type = gl.UNSIGNED_BYTE;
      const normalize = true;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.backgroundBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.backgroundUint8Array, gl.DYNAMIC_DRAW);
      gl.vertexAttribPointer(
        this.bgColorAttribLocation,
        numComponents,
        type,
        normalize,
        stride,
        offset
      );
    }

    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    // Tell WebGL to use our program when drawing
    gl.useProgram(this.program);

    // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);

    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    // Tell the shader we bound the texture to texture unit 0
    {
      const vertexCount = this.console.width * this.console.height * 6;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
  }

  startFrame(time: number): void {
    if (this.lastRenderTime === 0) {
      this.lastRenderTime = time;
      this.fps = 0;
    } else {
      this.renderDelta = time - this.lastRenderTime;
      this.lastRenderTime = time;
      this.fps = 1000.0 / this.renderDelta;
      this.averageFps = 0.95 * this.averageFps + 0.05 * this.fps;
    }
  }

  endFrame(): void {
    this.flush();
    this.render();
  }

  clear(): void {
    this.console.clear();
  }

  fillRect(x: number, y: number, w: number, h: number, color: number): void {
    this.console.fillRect(x, y, w, h, 0, undefined, color);
  }

  getCell(x: number, y: number): Cell | undefined {
    return this.console.getCell(x, y);
  }

  drawChar(x: number, y: number, c: string | number, fg?: Color, bg?: Color): void {
    this.console.drawChar(x, y, c, fg, bg);
  }

  drawConsole(
    dstX: number,
    dstY: number,
    srcConsole: Console,
    srcX: number,
    srcY: number,
    srcWidth: number,
    srcHeight: number,
    blendMode?: BlendMode
  ): void {
    this.console.drawConsole(dstX, dstY, srcConsole, srcX, srcY, srcWidth, srcHeight, blendMode);
  }

  drawImage(
    x: number,
    y: number,
    u: number,
    v: number,
    w: number,
    h: number,
    color?: number | undefined,
    dw?: number | undefined,
    dh?: number | undefined
  ): void {
    throw new Error('Method not implemented.');
  }

  drawString(
    x: number,
    y: number,
    str: string,
    color?: number | undefined,
    out?: Point | undefined
  ): void {
    this.console.drawString(x, y, str, color);
  }

  drawCenteredString(x: number, y: number, str: string, color?: number | undefined): void {
    this.console.drawCenteredString(x, y, str, color);
  }

  drawRightString(x: number, y: number, str: string, color?: number | undefined): void {
    this.console.drawString(x - str.length, y, str, color);
  }

  drawPanelFrame(panel: Panel): void {
    this.console.drawDoubleBox(panel.rect.x, panel.rect.y, panel.rect.width, panel.rect.height);
  }

  drawDialogFrame(dialog: Dialog): void {
    this.console.drawDoubleBox(dialog.rect.x, dialog.rect.y, dialog.rect.width, dialog.rect.height);
  }

  drawButtonFrame(button: Button): void {
    this.console.drawSingleBox(button.rect.x, button.rect.y, button.rect.width, button.rect.height);
  }
}
