import { Color, ExtendedTexture, Vec2, createTexture, initShaderProgram } from '@wglt/core';
import { Font } from './font';

/**
 * Maximum number of elements per buffer.
 *
 * Some browsers / video cards allow large buffers, but 16-bit is the safe max.
 * https://stackoverflow.com/a/5018021/2051724
 *
 * @const {number}
 */
const BUFFER_SIZE = 65536;

const spriteVertexShader =
  'uniform vec2 u_viewportSize;' +
  'attribute vec2 a_position;' +
  'attribute vec2 a_texCoord;' +
  'attribute vec4 a_color;' +
  'varying vec2 v_texCoord;' +
  'varying vec4 v_color;' +
  'void main() {' +
  // convert the rectangle from pixels to 0.0 to 1.0
  'vec2 zeroToOne = a_position / u_viewportSize;' +
  // convert from 0->1 to 0->2
  'vec2 zeroToTwo = zeroToOne * 2.0;' +
  // convert from 0->2 to -1->+1 (clipspace)
  'vec2 clipSpace = zeroToTwo - 1.0;' +
  'gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);' +
  // pass the texCoord to the fragment shader
  // The GPU will interpolate this value between points.
  'v_texCoord = a_texCoord;' +
  'v_color = a_color;' +
  '}';

const spriteFragmentShader =
  'precision highp float;' +
  // our texture
  'uniform sampler2D u_image;' +
  // the texCoords passed in from the vertex shader.
  'varying vec2 v_texCoord;' +
  // the color overrides passed in from the vertex shader.
  'varying vec4 v_color;' +
  'void main() {' +
  'gl_FragColor = texture2D(u_image, v_texCoord);' +
  'if (gl_FragColor.a < 0.1) discard;' +
  'if (v_color.a != 0.0) gl_FragColor = v_color;' +
  '}';

export class RenderSet {
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

  constructor(gl: WebGLRenderingContext, url: string, font: Font) {
    this.gl = gl;
    this.font = font;

    const program = initShaderProgram(gl, spriteVertexShader, spriteFragmentShader);

    this.program = program;
    this.viewportSizeLocation = gl.getUniformLocation(
      program,
      'u_viewportSize'
    ) as WebGLUniformLocation;
    this.positionLocation = gl.getAttribLocation(program, 'a_position');
    this.texcoordLocation = gl.getAttribLocation(program, 'a_texCoord');
    this.colorLocation = gl.getAttribLocation(program, 'a_color');
    this.positionBuffer = gl.createBuffer() as WebGLBuffer;
    this.texcoordBuffer = gl.createBuffer() as WebGLBuffer;
    this.colorBuffer = gl.createBuffer() as WebGLBuffer;
    this.spriteTexture = createTexture(gl, url);
    this.positionArray = new Float32Array(BUFFER_SIZE);
    this.positionArrayIndex = 0;
    this.texcoordArray = new Float32Array(BUFFER_SIZE);
    this.texcoordArrayIndex = 0;
    this.colorUint8Array = new Uint8Array(BUFFER_SIZE);
    this.colorDataView = new DataView(this.colorUint8Array.buffer);
    this.colorArrayIndex = 0;
  }

  /**
   * Draws a string horizontally centered.
   * @param str The text string to draw.
   * @param x The x-coordinate of the center.
   * @param y The y-coordinate of the top-left corner.
   * @param color Optional color.
   */
  drawCenteredString(str: string, x: number, y: number, color?: Color): void {
    const x2 = (x - this.font.getStringWidth(str) / 2) | 0;
    this.drawString(str, x2, y, color);
  }

  /**
   * Draws a right-aligned string.
   * @param str The text string to draw.
   * @param x The x-coordinate of the top-right corner.
   * @param y The y-coordinate of the top-right corner.
   * @param color Optional color.
   */
  drawRightString(str: string, x: number, y: number, color?: Color): void {
    const x2 = x - this.font.getStringWidth(str);
    this.drawString(str, x2, y, color);
  }

  /**
   * Draws a string.
   * @param str The text string to draw.
   * @param x0 The x-coordinate of the top-left corner.
   * @param y0 The y-coordinate of the top-left corner.
   * @param color Optional color.
   * @param out Optional output location of cursor.
   */
  drawString(str: string, x0: number, y0: number, color?: Color, out?: Vec2): void {
    const lines = str.split('\n');
    const height = this.font.getHeight();
    let x = x0;
    let y = y0;
    for (let i = 0; i < lines.length; i++) {
      if (i > 0) {
        x = x0;
        y += height;
      }
      for (let j = 0; j < lines[i].length; j++) {
        const charCode = lines[i].charCodeAt(j);
        if (this.font.isInRange(charCode)) {
          const offset = this.font.getOffset(charCode);
          const width = this.font.getWidth(charCode);
          this.drawImage(x, y, offset, 0, width, height, color);
          x += width;
        }
      }
    }
    if (out) {
      out.x = x;
      out.y = y;
    }
  }

  /**
   * Draws a character.
   * @param c The ASCII character code.
   * @param x The x-coordinate of the top-left corner.
   * @param y The y-coordinate of the top-left corner.
   * @param color Optional color.
   */
  drawChar(c: number, x: number, y: number, color?: Color): void {
    if (this.font.isInRange(c)) {
      const offset = this.font.getOffset(c);
      const width = this.font.getWidth(c);
      const height = this.font.getHeight();
      this.drawImage(x, y, offset, 0, width, height, color);
    }
  }

  /**
   * Draws a sprite.
   * @param x The x-coordinate of the top-left corner on the screen.
   * @param y The y-coordinate of the top-left corner on the screen.
   * @param u The x-coordinate of the top-left corner on the sprite sheet.
   * @param v The y-coordinate of the top-left corner on the sprite sheet.
   * @param w The width of the sprite.
   * @param h The height of the sprite.
   * @param color Optional color.
   * @param dw Optional destination width.
   * @param dh Optional destination height.
   */
  drawImage(
    x: number,
    y: number,
    u: number,
    v: number,
    w: number,
    h: number,
    optColor?: Color,
    optDw?: number,
    optDh?: number
  ): void {
    const spriteTexture = this.spriteTexture;
    if (!spriteTexture.loaded) {
      return;
    }

    const dw = optDw !== undefined ? optDw : w;
    const dh = optDh !== undefined ? optDh : h;
    const x2 = x + dw; //Math.abs(dw);
    const y2 = y + dh;
    const tx = u / spriteTexture.width;
    const ty = v / spriteTexture.height;
    const tx2 = (u + w) / spriteTexture.width;
    const ty2 = (v + h) / spriteTexture.height;
    const color = optColor || 0;

    // First triangle
    this.positionArray[this.positionArrayIndex++] = x;
    this.positionArray[this.positionArrayIndex++] = y;
    this.positionArray[this.positionArrayIndex++] = x2;
    this.positionArray[this.positionArrayIndex++] = y;
    this.positionArray[this.positionArrayIndex++] = x;
    this.positionArray[this.positionArrayIndex++] = y2;

    this.texcoordArray[this.texcoordArrayIndex++] = tx;
    this.texcoordArray[this.texcoordArrayIndex++] = ty;
    this.texcoordArray[this.texcoordArrayIndex++] = tx2;
    this.texcoordArray[this.texcoordArrayIndex++] = ty;
    this.texcoordArray[this.texcoordArrayIndex++] = tx;
    this.texcoordArray[this.texcoordArrayIndex++] = ty2;

    // Second triangle
    this.positionArray[this.positionArrayIndex++] = x;
    this.positionArray[this.positionArrayIndex++] = y2;
    this.positionArray[this.positionArrayIndex++] = x2;
    this.positionArray[this.positionArrayIndex++] = y;
    this.positionArray[this.positionArrayIndex++] = x2;
    this.positionArray[this.positionArrayIndex++] = y2;

    this.texcoordArray[this.texcoordArrayIndex++] = tx;
    this.texcoordArray[this.texcoordArrayIndex++] = ty2;
    this.texcoordArray[this.texcoordArrayIndex++] = tx2;
    this.texcoordArray[this.texcoordArrayIndex++] = ty;
    this.texcoordArray[this.texcoordArrayIndex++] = tx2;
    this.texcoordArray[this.texcoordArrayIndex++] = ty2;

    for (let i = 0; i < 6; i++) {
      this.colorDataView.setUint32(this.colorArrayIndex, color, false);
      this.colorArrayIndex += 4;
    }
  }

  /**
   * Renders all sprites in the sprite buffers to the screen.
   * @param width Viewport width.
   * @param height Viewport height.
   */
  flush(width: number, height: number): void {
    if (!this.spriteTexture.loaded || this.positionArrayIndex === 0) {
      return;
    }

    const gl = this.gl;

    // Tell it to use our program (pair of shaders)
    gl.useProgram(this.program);

    // Update the viewport
    gl.uniform2f(this.viewportSizeLocation, width, height);

    // Use the leonardo spriteTexture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.spriteTexture);

    {
      // Bind the position buffer.
      gl.enableVertexAttribArray(this.positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.positionArray, gl.DYNAMIC_DRAW);

      // Tell the position attribute how to get data out of positionBuffer
      // (ARRAY_BUFFER)
      const size = 2; // 2 components per iteration
      const type = gl.FLOAT; // the data is 32bit floats
      const normalize = false; // don't normalize the data
      const stride = 0; // 0 = move forward size * sizeof(type) each iteration
      // to get the next position
      const offset = 0; // start at the beginning of the buffer
      gl.vertexAttribPointer(this.positionLocation, size, type, normalize, stride, offset);
    }

    {
      // Bind the texture coordinate buffer.
      gl.enableVertexAttribArray(this.texcoordLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.texcoordArray, gl.DYNAMIC_DRAW);

      // Tell the position attribute how to get data out of positionBuffer
      // (ARRAY_BUFFER)
      const size = 2; // 2 components per iteration
      const type = gl.FLOAT; // the data is 32bit floats
      const normalize = false; // don't normalize the data
      const stride = 0; // 0 = move forward size * sizeof(type) each iteration
      // to get the next position
      const offset = 0; // start at the beginning of the buffer
      gl.vertexAttribPointer(this.texcoordLocation, size, type, normalize, stride, offset);
    }

    {
      // Bind the color buffer.
      gl.enableVertexAttribArray(this.colorLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.colorUint8Array, gl.DYNAMIC_DRAW);

      // Tell the position attribute how to get data out of positionBuffer
      // (ARRAY_BUFFER)
      const size = 4; // 4 components per iteration
      const type = gl.UNSIGNED_BYTE; // the data is 8-bit unsigned bytes
      const normalize = true; // Normalize from 0-255 to 0.0-1.0
      const stride = 0; // 0 = move forward size * sizeof(type) each iteration
      // to get the next position
      const offset = 0; // start at the beginning of the buffer
      gl.vertexAttribPointer(this.colorLocation, size, type, normalize, stride, offset);
    }

    // Draw the rectangle.
    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = this.positionArrayIndex / 2;
    gl.drawArrays(primitiveType, offset, count);
  }
}
