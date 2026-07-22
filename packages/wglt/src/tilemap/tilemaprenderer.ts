import { initShaderProgram } from '../core/glutils.ts';
import { GraphicsApp } from '../graphics/graphicsapp.ts';
import { TileMap } from './tilemap.ts';

const VS_SOURCE = `#version 300 es
precision highp float;

layout(location = 0) in vec2 position;
layout(location = 1) in vec2 texture;

uniform vec2 viewOffset;
uniform vec2 viewportSize;
uniform vec2 tileSize;
uniform vec2 mapSize;

out vec2 pixelCoord;
out vec2 texCoord;

void main(void) {
   pixelCoord = (texture * viewportSize) + viewOffset;
   texCoord = pixelCoord / mapSize / tileSize;
   gl_Position = vec4(position, 0.0, 1.0);
}`;

const FS_SOURCE = `#version 300 es
precision highp float;

in vec2 pixelCoord;
in vec2 texCoord;

uniform vec2 tileSize;
uniform vec2 textureSize;
uniform float animFrame;
uniform sampler2D tiles;
uniform sampler2D sprites;

out vec4 fragColor;

void main(void) {
   if (texCoord.x < 0.0 || texCoord.y < 0.0 || texCoord.x > 1.0 || texCoord.y > 1.0) {
     discard;
   }
   vec4 tile = texture(tiles, texCoord);
   if(tile.x == 0.0 && tile.y == 0.0) { discard; }
   vec2 spriteOffset = floor(tile.xy * 256.0) * tileSize;
   if(tile.z != 0.0) spriteOffset.x += animFrame * tileSize.x;
   vec2 spriteCoord = mod(pixelCoord, tileSize);
   fragColor = texture(sprites, (spriteOffset + spriteCoord) / textureSize);
   if (fragColor.a == 0.0) discard;
   fragColor.a *= tile.a;
}`;

export class TileMapRenderer {
  private readonly app: GraphicsApp;
  private readonly gl: WebGL2RenderingContext;
  private readonly tileMap: TileMap;
  private readonly vao: WebGLVertexArrayObject;
  private readonly quadBuffer: WebGLBuffer;
  private readonly program: WebGLProgram;
  private readonly layerTextures: WebGLTexture[];

  // Uniforms
  private readonly viewportSizeUniform: WebGLUniformLocation;
  private readonly viewOffsetUniform: WebGLUniformLocation;
  private readonly mapSizeUniform: WebGLUniformLocation;
  private readonly tileSizeUniform: WebGLUniformLocation;
  private readonly textureSizeUniform: WebGLUniformLocation;
  private readonly animFrameUniform: WebGLUniformLocation;
  private readonly tileSamplerUniform: WebGLUniformLocation;
  private readonly spriteSamplerUniform: WebGLUniformLocation;
  private disposed = false;

  constructor(app: GraphicsApp, tileMap: TileMap) {
    this.app = app;
    this.gl = app.gl;
    this.tileMap = tileMap;

    const gl = this.gl;

    // Create shader program first
    this.program = initShaderProgram(gl, VS_SOURCE, FS_SOURCE);

    // Get uniform locations
    this.viewportSizeUniform = gl.getUniformLocation(
      this.program,
      'viewportSize'
    ) as WebGLUniformLocation;
    this.viewOffsetUniform = gl.getUniformLocation(
      this.program,
      'viewOffset'
    ) as WebGLUniformLocation;
    this.mapSizeUniform = gl.getUniformLocation(this.program, 'mapSize') as WebGLUniformLocation;
    this.tileSizeUniform = gl.getUniformLocation(this.program, 'tileSize') as WebGLUniformLocation;
    this.textureSizeUniform = gl.getUniformLocation(
      this.program,
      'textureSize'
    ) as WebGLUniformLocation;
    this.animFrameUniform = gl.getUniformLocation(
      this.program,
      'animFrame'
    ) as WebGLUniformLocation;
    this.tileSamplerUniform = gl.getUniformLocation(this.program, 'tiles') as WebGLUniformLocation;
    this.spriteSamplerUniform = gl.getUniformLocation(
      this.program,
      'sprites'
    ) as WebGLUniformLocation;

    // Create and setup VAO
    this.vao = gl.createVertexArray() as WebGLVertexArrayObject;
    gl.bindVertexArray(this.vao);

    // Setup quad vertices
    const quadVerts = new Float32Array([
      // x   y   u  v
      -1, -1, 0, 1, 1, -1, 1, 1, 1, 1, 1, 0, -1, -1, 0, 1, 1, 1, 1, 0, -1, 1, 0, 0,
    ]);

    this.quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadVerts, gl.STATIC_DRAW);

    // Set up vertex attributes
    gl.enableVertexAttribArray(0); // position
    gl.enableVertexAttribArray(1); // texture
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);

    // Create layer textures
    this.layerTextures = new Array(tileMap.depth);
    for (let i = 0; i < tileMap.depth; i++) {
      const texture = gl.createTexture() as WebGLTexture;
      const imageData = tileMap.layers[i].imageData;

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        tileMap.width,
        tileMap.height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        imageData
      );

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      this.layerTextures[i] = texture;
    }

    // Cleanup
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  draw(x: number, y: number, width: number, height: number, animFrame?: number): void {
    const gl = this.gl;
    const tileMap = this.tileMap;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);

    // Set uniforms
    gl.uniform2f(this.viewOffsetUniform, x, y);
    gl.uniform2f(this.viewportSizeUniform, width, height);
    gl.uniform2f(this.tileSizeUniform, tileMap.tileSize.width, tileMap.tileSize.height);
    gl.uniform2f(this.textureSizeUniform, tileMap.textureSize.width, tileMap.textureSize.height);
    gl.uniform1f(this.animFrameUniform, animFrame || 0);

    // Set up textures
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.app.atlas);
    gl.uniform1i(this.spriteSamplerUniform, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.uniform1i(this.tileSamplerUniform, 1);

    const minX = Math.min(tileMap.visibleRect.x1, tileMap.prevVisibleRect.x1);
    const minY = Math.min(tileMap.visibleRect.y1, tileMap.prevVisibleRect.y1);
    const maxX = Math.max(tileMap.visibleRect.x2, tileMap.prevVisibleRect.x2);
    const maxY = Math.max(tileMap.visibleRect.y2, tileMap.prevVisibleRect.y2);

    // Draw each layer
    for (let i = 0; i < tileMap.depth; i++) {
      const layer = tileMap.layers[i];
      const texture = this.layerTextures[i];

      gl.uniform2f(this.mapSizeUniform, tileMap.width, tileMap.height);
      gl.bindTexture(gl.TEXTURE_2D, texture);

      if (tileMap.dirty) {
        for (let y = minY; y < maxY; y++) {
          for (let x = minX; x < maxX; x++) {
            const alpha = tileMap.isVisible(x, y) ? 255 : tileMap.isSeen(x, y) ? 144 : 0;
            layer.setAlpha(x, y, alpha);
          }
        }
        gl.texSubImage2D(
          gl.TEXTURE_2D,
          0,
          0,
          0,
          layer.width,
          layer.height,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          layer.imageData
        );
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    // Cleanup
    gl.bindVertexArray(null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.useProgram(null);

    tileMap.dirty = false;
  }

  /** Releases the WebGL resources owned by this renderer. */
  dispose(): void {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    const gl = this.gl;
    for (const texture of this.layerTextures) {
      gl.deleteTexture(texture);
    }
    gl.deleteProgram(this.program);
    gl.deleteBuffer(this.quadBuffer);
    gl.deleteVertexArray(this.vao);
  }
}
