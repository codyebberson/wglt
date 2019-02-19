
import {Color} from './color';
import {createTexture, ExtendedTexture, initShaderProgram} from './glutils';
import {Rect} from './rect';

/**
 * Maximum number of elements per buffer.
 *
 * Some browsers / video cards allow large buffers, but 16-bit is the safe max.
 * https://stackoverflow.com/a/5018021/2051724
 *
 * @const {number}
 */
const BUFFER_SIZE = 65536;

const spriteVertexShader = 'uniform vec2 u_viewportSize;' +
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

const spriteFragmentShader = 'precision highp float;' +

    // our texture
    'uniform sampler2D u_image;' +

    // the texCoords passed in from the vertex shader.
    'varying vec2 v_texCoord;' +

    // the color overrides passed in from the vertex shader.
    'varying vec4 v_color;' +

    'void main() {' +
    'gl_FragColor = texture2D(u_image, v_texCoord);' +
    'if (gl_FragColor.a < 0.1) discard;' +
    'if (v_color.a > 0.5) gl_FragColor = v_color;' +
    '}';

export class RenderSet {
  readonly glyphSize: Rect;
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

  constructor(gl: WebGLRenderingContext, url: string, glyphSize: Rect) {
    this.gl = gl;
    this.glyphSize = glyphSize;

    const program = initShaderProgram(gl, spriteVertexShader, spriteFragmentShader);

    this.program = program;
    this.viewportSizeLocation = gl.getUniformLocation(program, 'u_viewportSize') as WebGLUniformLocation;
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
   * @param {string} str The text string to draw.
   * @param {number} x The x-coordinate of the center.
   * @param {number} y The y-coordinate of the top-left corner.
   * @param {number=} color Optional color.
   */
  drawCenteredString(str: string, x: number, y: number, color?: Color) {
    const x2 = x - ((this.glyphSize.width * str.length) / 2) | 0;
    this.drawString(str, x2, y, color);
  }

  /**
   * Draws a string.
   * @param {string} str The text string to draw.
   * @param {number} x The x-coordinate of the top-left corner.
   * @param {number} y The y-coordinate of the top-left corner.
   * @param {number=} color Optional color.
   */
  drawString(str: string, x: number, y: number, color?: Color) {
    const lines = str.toUpperCase().split('\n');
    const glyphWidth = this.glyphSize.width;
    const glyphHeight = this.glyphSize.height;
    for (let i = 0; i < lines.length; i++) {
      for (let j = 0; j < lines[i].length; j++) {
        this.drawChar(lines[i].charCodeAt(j), x + j * glyphWidth, y + i * glyphHeight, color);
      }
    }
  }

  /**
   * Draws a character.
   * @param {number} c The ASCII character code.
   * @param {number} x The x-coordinate of the top-left corner.
   * @param {number} y The y-coordinate of the top-left corner.
   * @param {number=} color Optional color.
   */
  drawChar(c: number, x: number, y: number, color?: Color) {
    if (c >= 33 && c <= 127) {
      this.drawImage(x, y, (c - 33) * 8, 0, 8, 10, color);
    }
  }

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
  drawImage(
      x: number, y: number, u: number, v: number, w: number, h: number, optColor?: Color, optDw?: number,
      optDh?: number) {
    const spriteTexture = this.spriteTexture;
    if (!spriteTexture.loaded) {
      return;
    }

    const dw = optDw !== undefined ? optDw : w;
    const dh = optDh !== undefined ? optDh : h;
    const x2 = x + Math.abs(dw);
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
   * @param {number} width Viewport width.
   * @param {number} height Viewport height.
   */
  flush(width: number, height: number) {
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
      const size = 2;           // 2 components per iteration
      const type = gl.FLOAT;    // the data is 32bit floats
      const normalize = false;  // don't normalize the data
      const stride = 0;         // 0 = move forward size * sizeof(type) each iteration
                                // to get the next position
      const offset = 0;         // start at the beginning of the buffer
      gl.vertexAttribPointer(this.positionLocation, size, type, normalize, stride, offset);
    }

    {
      // Bind the texture coordinate buffer.
      gl.enableVertexAttribArray(this.texcoordLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.texcoordArray, gl.DYNAMIC_DRAW);

      // Tell the position attribute how to get data out of positionBuffer
      // (ARRAY_BUFFER)
      const size = 2;           // 2 components per iteration
      const type = gl.FLOAT;    // the data is 32bit floats
      const normalize = false;  // don't normalize the data
      const stride = 0;         // 0 = move forward size * sizeof(type) each iteration
                                // to get the next position
      const offset = 0;         // start at the beginning of the buffer
      gl.vertexAttribPointer(this.texcoordLocation, size, type, normalize, stride, offset);
    }

    {
      // Bind the color buffer.
      gl.enableVertexAttribArray(this.colorLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.colorUint8Array, gl.DYNAMIC_DRAW);

      // Tell the position attribute how to get data out of positionBuffer
      // (ARRAY_BUFFER)
      const size = 4;                 // 4 components per iteration
      const type = gl.UNSIGNED_BYTE;  // the data is 8-bit unsigned bytes
      const normalize = true;         // Normalize from 0-255 to 0.0-1.0
      const stride = 0;               // 0 = move forward size * sizeof(type) each iteration
                                      // to get the next position
      const offset = 0;               // start at the beginning of the buffer
      gl.vertexAttribPointer(this.colorLocation, size, type, normalize, stride, offset);
    }

    // Draw the rectangle.
    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = this.positionArrayIndex / 2;
    gl.drawArrays(primitiveType, offset, count);
  }
}
