import type { Color } from '../core/color';
import { createTexture, type ExtendedTexture, initShaderProgram } from '../core/glutils';

const BUFFER_SIZE = 65536;
const ELEMENTS_PER_INSTANCE = 9;
const INSTANCE_STRIDE = 36; // bytes

const VS_SOURCE = `#version 300 es
uniform vec2 u_viewportSize;

// Quad vertices (same for all instances)
layout(location = 0) in vec2 a_position;

// Instance attributes
layout(location = 1) in vec4 a_dstRect;    // x, y, w, h
layout(location = 2) in vec4 a_srcRect;    // x, y, w, h
layout(location = 3) in uint a_color;      // 32-bit packed color

out vec2 v_texCoord;
out vec4 v_color;

void main() {
  // Calculate actual position based on instance data
  vec2 position = a_dstRect.xy + (a_position * a_dstRect.zw);
  
  // Convert to clip space
  vec2 zeroToOne = position / u_viewportSize;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  
  // Calculate texture coordinates
  v_texCoord = a_srcRect.xy + (a_position * a_srcRect.zw);
  
  // Unpack color
  v_color = vec4(
    float((a_color >> 24) & 0xFFu) / 255.0,
    float((a_color >> 16) & 0xFFu) / 255.0,
    float((a_color >> 8) & 0xFFu) / 255.0,
    float(a_color & 0xFFu) / 255.0
  );
}`;

const FS_SOURCE = `#version 300 es
precision highp float;

uniform sampler2D u_image;

in vec2 v_texCoord;
in vec4 v_color;
out vec4 fragColor;

void main() {
  fragColor = texture(u_image, v_texCoord);
  if (fragColor.a < 0.1) discard;
  if (v_color.a != 0.0) fragColor = v_color;
}`;

export class DrawList {
  readonly gl: WebGL2RenderingContext;
  readonly program: WebGLProgram;
  readonly viewportSizeLocation: WebGLUniformLocation;
  readonly spriteTexture: ExtendedTexture;
  private readonly vao: WebGLVertexArrayObject;
  private readonly quadBuffer: WebGLBuffer;
  private readonly instanceBuffer: WebGLBuffer;
  private readonly instanceData: ArrayBuffer;
  private readonly instanceDataF32: Float32Array;
  private readonly instanceDataU32: Uint32Array;
  private instanceCount = 0;

  constructor(gl: WebGL2RenderingContext, url: string) {
    this.gl = gl;
    this.spriteTexture = createTexture(gl, url);

    // Create VAO
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    // Setup static quad vertices (single quad shared by all instances)
    const quadVertices = new Float32Array([
      0,
      0, // Top-left
      1,
      0, // Top-right
      0,
      1, // Bottom-left
      0,
      1, // Bottom-left
      1,
      0, // Top-right
      1,
      1, // Bottom-right
    ]);

    this.quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    // Setup instance buffer
    this.instanceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);

    // Enable instance attributes
    // Destination rect (x,y,w,h)
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, INSTANCE_STRIDE, 0);
    gl.vertexAttribDivisor(1, 1);

    // Source rect (x,y,w,h)
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 4, gl.FLOAT, false, INSTANCE_STRIDE, 16);
    gl.vertexAttribDivisor(2, 1);

    // Color (as uint32)
    gl.enableVertexAttribArray(3);
    gl.vertexAttribIPointer(3, 1, gl.UNSIGNED_INT, INSTANCE_STRIDE, 32);
    gl.vertexAttribDivisor(3, 1);

    // Allocate instance data buffer
    // Note: Using ArrayBuffer with multiple views for efficient data access
    this.instanceData = new ArrayBuffer(BUFFER_SIZE * INSTANCE_STRIDE);
    this.instanceDataF32 = new Float32Array(this.instanceData);
    this.instanceDataU32 = new Uint32Array(this.instanceData);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.instanceData, gl.DYNAMIC_DRAW); // Allocate full size upfront

    this.program = initShaderProgram(gl, VS_SOURCE, FS_SOURCE);

    this.viewportSizeLocation = gl.getUniformLocation(
      this.program,
      'u_viewportSize'
    ) as WebGLUniformLocation;
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

    const baseIdx = this.instanceCount * ELEMENTS_PER_INSTANCE;

    // Destination rectangle
    this.instanceDataF32[baseIdx + 0] = x | 0;
    this.instanceDataF32[baseIdx + 1] = y | 0;
    this.instanceDataF32[baseIdx + 2] = optDw ?? w;
    this.instanceDataF32[baseIdx + 3] = optDh ?? h;

    // Source rectangle (normalized texture coordinates)
    this.instanceDataF32[baseIdx + 4] = u / this.spriteTexture.width;
    this.instanceDataF32[baseIdx + 5] = v / this.spriteTexture.height;
    this.instanceDataF32[baseIdx + 6] = w / this.spriteTexture.width;
    this.instanceDataF32[baseIdx + 7] = h / this.spriteTexture.height;

    // Color
    this.instanceDataU32[baseIdx + 8] = optColor ?? 0;

    this.instanceCount++;
  }

  flush(width: number, height: number): void {
    if (!this.spriteTexture.loaded || this.instanceCount === 0) {
      return;
    }

    const gl = this.gl as WebGL2RenderingContext;

    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);

    // Update viewport size
    gl.uniform2f(this.viewportSizeLocation, width, height);

    // Bind texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.spriteTexture);

    // Update instance data
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
    gl.bufferSubData(
      gl.ARRAY_BUFFER,
      0,
      this.instanceDataF32,
      0,
      this.instanceCount * ELEMENTS_PER_INSTANCE
    );

    // Draw all instances
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, this.instanceCount);

    // Cleanup
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.useProgram(null);

    // Reset for next frame
    this.instanceCount = 0;
  }
}
