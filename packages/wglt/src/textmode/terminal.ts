import { BaseApp } from '../core/baseapp';
import { Color } from '../core/color';
import { FONT_IBM_BIOS, MonospacedFont } from '../core/font';
import { createTexture, initShaderProgram } from '../core/glutils';
import { Key } from '../core/keys';
import { Mouse } from '../core/mouse';
import { Point } from '../core/point';
import { interpolate } from '../core/utils';
import { BlendMode } from './blendmode';
import { Cell } from './cell';
import { Console } from './console';
import { IBM_BIOS_FONT_DATA_URL } from './font';
import { FRAGMENT_SHADER_SOURCE, VERTEX_SHADER_SOURCE } from './shaders';

export interface TerminalOptions {
  readonly fontUrl?: string;
  readonly font?: MonospacedFont;
  readonly movementKeys?: Partial<Record<Key, Point>>;
  readonly maxFps?: number;
}

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
    readonly width: number,
    readonly height: number,
    options?: TerminalOptions
  ) {
    const canvas =
      typeof canvasOrSelector === 'string'
        ? (document.querySelector(canvasOrSelector) as HTMLCanvasElement)
        : canvasOrSelector;

    const font = options?.font ?? FONT_IBM_BIOS;
    const pixelWidth = width * font.glyphSize.width;
    const pixelHeight = height * font.glyphSize.height;

    const mouse = new Mouse(canvas, width, height);

    super(canvas, pixelWidth, pixelHeight, font, mouse);

    this.console = new Console(width, height);
    this.pixelWidth = pixelWidth;
    this.pixelHeight = pixelHeight;

    const gl = this.gl;

    this.program = initShaderProgram(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE);

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

    this.texture = createTexture(gl, options?.fontUrl ?? IBM_BIOS_FONT_DATA_URL);

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

  drawString(
    x: number,
    y: number,
    str: string,
    color?: number | undefined,
    bg?: number | undefined
  ): void {
    this.console.drawString(x, y, str, color, bg);
  }

  drawCenteredString(x: number, y: number, str: string, color?: number | undefined): void {
    this.console.drawCenteredString(x, y, str, color);
  }

  drawRightString(x: number, y: number, str: string, color?: number | undefined): void {
    this.console.drawString(x - str.length, y, str, color);
  }
}
