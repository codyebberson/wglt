import { Cell } from './cell';
import { Console } from './console';
import { DEFAULT_FONT, Font } from './font';
import { Key, Keyboard } from './keys';
import { Mouse } from './mouse';
import { Point } from './point';
import {
  CRT_FRAGMENT_SHADER_SOURCE,
  CRT_VERTEX_SHADER_SOURCE,
  FRAGMENT_SHADER_SOURCE,
  VERTEX_SHADER_SOURCE,
} from './shaders';

/**
 * Linearly interpolates a number in the range 0-max to -1.0-1.0.
 *
 * @param i The value between 0 and max.
 * @param max The maximum value.
 * @returns The interpolated value between -1.0 and 1.0.
 */
function interpolate(i: number, max: number) {
  return -1.0 + 2.0 * (i / max);
}

interface TerminalOptions {
  font?: Font;
}

const DEFAULT_OPTIONS = {
  font: DEFAULT_FONT,
};

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
  readonly frameBufferTexture: WebGLTexture;
  readonly frameBuffer: WebGLFramebuffer;
  readonly crtProgram: WebGLProgram;
  readonly crtPositionLocation: number;
  readonly crtTexCoordLocation: number;
  readonly crtPositionBuffer: WebGLBuffer;
  readonly crtTexCoordBuffer: WebGLBuffer;
  private lastRenderTime: number;
  private renderDelta: number;
  fps: number;
  averageFps: number;
  update?: () => void;

  constructor(canvas: HTMLCanvasElement, width: number, height: number, options?: TerminalOptions) {
    super(width, height);

    options = options || DEFAULT_OPTIONS;

    this.canvas = canvas;
    this.font = options.font || DEFAULT_FONT;
    this.pixelWidth = width * this.font.charWidth;
    this.pixelHeight = height * this.font.charHeight;

    canvas.width = this.pixelWidth * 3;
    canvas.height = this.pixelHeight * 3;
    canvas.style.imageRendering = 'pixelated';
    canvas.style.outline = 'none';
    canvas.tabIndex = 0;
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    this.keys = new Keyboard(canvas);
    this.mouse = new Mouse(this);

    // Get the WebGL context from the canvas
    const gl = canvas.getContext('webgl2', { antialias: false });
    if (!gl) {
      throw new Error('Unable to initialize WebGL. Your browser may not support it.');
    }

    const program = gl.createProgram();
    if (!program) {
      throw new Error('Unable to initialize WebGL. Your browser may not support it.');
    }

    this.gl = gl;
    this.program = program;

    gl.attachShader(program, this.buildShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE));
    gl.attachShader(program, this.buildShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE));
    gl.linkProgram(program);
    gl.useProgram(program);

    this.crtProgram = gl.createProgram() as WebGLProgram;
    gl.attachShader(this.crtProgram, this.buildShader(gl.VERTEX_SHADER, CRT_VERTEX_SHADER_SOURCE));
    gl.attachShader(this.crtProgram, this.buildShader(gl.FRAGMENT_SHADER, CRT_FRAGMENT_SHADER_SOURCE));
    gl.linkProgram(this.crtProgram);
    gl.useProgram(this.crtProgram);

    this.crtPositionLocation = gl.getAttribLocation(this.crtProgram, 'a_position');
    this.crtPositionBuffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.crtPositionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      // new Float32Array([1, 1, -1, 1, -1, -1, -1, -1, 1, -1, 1, 1]),
      // new Float32Array([0, 0, 0, 0, 0, 0.5, 0, 0, 0.7, 0, 0, 0]),
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(this.crtPositionLocation);
    gl.vertexAttribPointer(this.crtPositionLocation, 2, gl.FLOAT, false, 0, 0);

    this.crtTexCoordLocation = gl.getAttribLocation(this.crtProgram, 'a_texCoord');
    this.crtTexCoordBuffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.crtTexCoordBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      // new Float32Array([1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0]),
      // new Float32Array([0, 0, 0, 0, 0, 0.5, 0, 0, 0.7, 0, 0, 0]),
      new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
      gl.STATIC_DRAW
    );
    gl.enableVertexAttribArray(this.crtTexCoordLocation);
    gl.vertexAttribPointer(this.crtTexCoordLocation, 2, gl.FLOAT, false, 0, 0);

    if (this.font.graphical) {
      // Set the flag to ignore foreground/background colors, and use texture directly
      gl.uniform1i(gl.getUniformLocation(program, 'h'), 1);
    }

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

    // Init the frame buffer
    this.frameBufferTexture = gl.createTexture() as WebGLTexture;
    gl.bindTexture(gl.TEXTURE_2D, this.frameBufferTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.pixelWidth, this.pixelHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    this.frameBuffer = gl.createFramebuffer() as WebGLFramebuffer;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.frameBufferTexture, 0);

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

    this.texture = this.loadTexture(this.font.url);

    this.lastRenderTime = 0;
    this.renderDelta = 0;
    this.fps = 0;
    this.averageFps = 0;

    this.requestAnimationFrame();
  }

  private handleResize() {
    const parent = this.canvas.parentElement;
    if (!parent) {
      return;
    }
    const widthFactor = parent.offsetWidth / this.pixelWidth;
    const heightFactor = parent.offsetHeight / this.pixelHeight;
    const factor = Math.min(widthFactor, heightFactor);
    const width = (factor * this.pixelWidth) | 0;
    const height = (factor * this.pixelHeight) | 0;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
  }

  private getAttribLocation(name: string) {
    const location = this.gl.getAttribLocation(this.program, name);
    this.gl.enableVertexAttribArray(location);
    return location;
  }

  private flush() {
    let textureArrayIndex = 0;
    let colorArrayIndex = 0;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.getCell(x, y) as Cell;

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

  isKeyDown(key: Key): boolean {
    return this.keys.getKey(key).down;
  }

  isKeyPressed(key: Key): boolean {
    return this.keys.getKey(key).isPressed();
  }

  getKeyDownCount(key: Key): number {
    return this.keys.getKey(key).downCount;
  }

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
  getMovementKey(): Point | undefined {
    if (this.isKeyPressed(Key.VK_NUMPAD1) || this.isKeyPressed(Key.VK_B)) {
      return new Point(-1, 1);
    }
    if (this.isKeyPressed(Key.VK_NUMPAD2) || this.isKeyPressed(Key.VK_J) || this.isKeyPressed(Key.VK_DOWN)) {
      return new Point(0, 1);
    }
    if (this.isKeyPressed(Key.VK_NUMPAD3) || this.isKeyPressed(Key.VK_N)) {
      return new Point(1, 1);
    }
    if (this.isKeyPressed(Key.VK_NUMPAD4) || this.isKeyPressed(Key.VK_H) || this.isKeyPressed(Key.VK_LEFT)) {
      return new Point(-1, 0);
    }
    if (this.isKeyPressed(Key.VK_NUMPAD5) || this.isKeyPressed(Key.VK_PERIOD)) {
      return new Point(0, 0);
    }
    if (this.isKeyPressed(Key.VK_NUMPAD6) || this.isKeyPressed(Key.VK_L) || this.isKeyPressed(Key.VK_RIGHT)) {
      return new Point(1, 0);
    }
    if (this.isKeyPressed(Key.VK_NUMPAD7) || this.isKeyPressed(Key.VK_Y)) {
      return new Point(-1, -1);
    }
    if (this.isKeyPressed(Key.VK_NUMPAD8) || this.isKeyPressed(Key.VK_K) || this.isKeyPressed(Key.VK_UP)) {
      return new Point(0, -1);
    }
    if (this.isKeyPressed(Key.VK_NUMPAD9) || this.isKeyPressed(Key.VK_U)) {
      return new Point(1, -1);
    }
    return undefined;
  }

  private buildShader(type: number, source: string) {
    const gl = this.gl;
    const sh = gl.createShader(type);
    if (!sh) {
      throw new Error('An error occurred compiling the shader: ');
    }
    gl.shaderSource(sh, source);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      throw new Error('An error occurred compiling the shader: ' + gl.getShaderInfoLog(sh));
    }
    return sh;
  }

  /**
   * Initialize a texture and load an image.
   * When the image finished loading copy it into the texture.
   * @param url
   */
  private loadTexture(url: string) {
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
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

    const image = new Image();
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    };
    image.src = url;

    return texture;
  }

  //
  // Draw the scene.
  //
  private render() {
    const gl = this.gl;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
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
      gl.vertexAttribPointer(this.positionAttribLocation, numComponents, type, normalize, stride, offset);
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
      gl.vertexAttribPointer(this.textureAttribLocation, numComponents, type, normalize, stride, offset);
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
      gl.vertexAttribPointer(this.fgColorAttribLocation, numComponents, type, normalize, stride, offset);
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
      gl.vertexAttribPointer(this.bgColorAttribLocation, numComponents, type, normalize, stride, offset);
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
      const vertexCount = this.width * this.height * 6;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
  }

  private renderCrt(): void {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.pixelWidth * 3, this.pixelHeight * 3);
    gl.useProgram(this.crtProgram);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.frameBufferTexture);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.crtPositionBuffer);
    gl.vertexAttribPointer(this.crtPositionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.crtTexCoordBuffer);
    gl.vertexAttribPointer(this.crtTexCoordLocation, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.frameBufferTexture);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  private requestAnimationFrame() {
    window.requestAnimationFrame((t) => this.renderLoop(t));
  }

  private renderLoop(time: number) {
    if (this.lastRenderTime === 0) {
      this.lastRenderTime = time;
      this.fps = 0;
    } else {
      this.renderDelta = time - this.lastRenderTime;
      this.lastRenderTime = time;
      this.fps = 1000.0 / this.renderDelta;
      this.averageFps = 0.95 * this.averageFps + 0.05 * this.fps;
    }

    this.keys.updateKeys(time);
    this.mouse.update(time);
    if (this.update) {
      this.update();
    }
    this.flush();
    this.render();
    this.renderCrt();
    this.requestAnimationFrame();
  }
}
