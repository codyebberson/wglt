
import { initShaderProgram } from "../glutils";
import { TileMap } from "./tilemap";

const TEXTURE_SIZE = 1024;

// Shader
const tilemapVS = 'precision highp float;' +

  'attribute vec2 position;' +
  'attribute vec2 texture;' +

  'varying vec2 pixelCoord;' +
  'varying vec2 texCoord;' +

  'uniform vec2 viewOffset;' +
  'uniform vec2 viewportSize;' +
  'uniform vec2 tileSize;' +
  'uniform vec2 mapSize;' +

  'void main(void) {' +
  '   pixelCoord = (texture * viewportSize) + viewOffset;' +
  '   texCoord = pixelCoord / mapSize / tileSize;' +
  '   gl_Position = vec4(position, 0.0, 1.0);' +
  '}';

const tilemapFS = 'precision highp float;' +

  'varying vec2 pixelCoord;' +
  'varying vec2 texCoord;' +

  'uniform vec2 tileSize;' +
  'uniform float animFrame;' +
  'uniform sampler2D tiles;' +
  'uniform sampler2D sprites;' +

  'void main(void) {' +
  '   vec4 tile = texture2D(tiles, texCoord);' +
  '   if(tile.x == 0.0 && tile.y == 0.0) { discard; }' +
  '   vec2 spriteOffset = floor(tile.xy * 256.0) * tileSize;' +
  '   if(tile.z != 0.0) spriteOffset.x += animFrame * tileSize.x;' +
  '   vec2 spriteCoord = mod(pixelCoord, tileSize);' +
  '   gl_FragColor = texture2D(sprites, (spriteOffset + spriteCoord) / ' + TEXTURE_SIZE + '.0);' +
  '   if (gl_FragColor.a == 0.0) discard;' +
  '   gl_FragColor.a *= tile.a;' +
  '}';


/**
 * @constructor
 * @param {number} width
 * @param {number} height
 * @param {number} layerCount
 */
export class TileMapRenderer {
  readonly gl: WebGLRenderingContext;
  readonly tileMap: TileMap;
  private readonly quadVertBuffer: WebGLBuffer;
  private readonly tilemapShader: WebGLShader;
  private readonly positionAttribute: number;
  private readonly textureAttribute: number;
  private readonly viewportSizeUniform: WebGLUniformLocation;
  private readonly viewOffsetUniform: WebGLUniformLocation;
  private readonly mapSizeUniform: WebGLUniformLocation;
  private readonly tileSizeUniform: WebGLUniformLocation;
  private readonly animFrameUniform: WebGLUniformLocation;
  private readonly tileSamplerUniform: WebGLUniformLocation;
  private readonly spriteSamplerUniform: WebGLUniformLocation;
  private readonly layerTextures: WebGLTexture[];

  constructor(gl: WebGLRenderingContext, tileMap: TileMap) {
    this.gl = gl;
    this.tileMap = tileMap;

    const quadVerts = [
      // x   y   u  v
      -1, -1, 0, 1,
      1, -1, 1, 1,
      1, 1, 1, 0,
      -1, -1, 0, 1,
      1, 1, 1, 0,
      -1, 1, 0, 0
    ];

    this.quadVertBuffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quadVerts), gl.STATIC_DRAW);

    this.tilemapShader = initShaderProgram(gl, tilemapVS, tilemapFS);
    this.positionAttribute = gl.getAttribLocation(this.tilemapShader, 'position');
    this.textureAttribute = gl.getAttribLocation(this.tilemapShader, 'texture');
    this.viewportSizeUniform = gl.getUniformLocation(this.tilemapShader, 'viewportSize') as WebGLUniformLocation;
    this.viewOffsetUniform = gl.getUniformLocation(this.tilemapShader, 'viewOffset') as WebGLUniformLocation;
    this.mapSizeUniform = gl.getUniformLocation(this.tilemapShader, 'mapSize') as WebGLUniformLocation;
    this.tileSizeUniform = gl.getUniformLocation(this.tilemapShader, 'tileSize') as WebGLUniformLocation;
    this.animFrameUniform = gl.getUniformLocation(this.tilemapShader, 'animFrame') as WebGLUniformLocation;
    this.tileSamplerUniform = gl.getUniformLocation(this.tilemapShader, 'tiles') as WebGLUniformLocation;
    this.spriteSamplerUniform = gl.getUniformLocation(this.tilemapShader, 'sprites') as WebGLUniformLocation;

    this.layerTextures = new Array(tileMap.depth);

    for (let i = 0; i < tileMap.depth; i++) {
      const texture = gl.createTexture() as WebGLTexture;
      const imageData = tileMap.layers[i].imageData;

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, tileMap.width, tileMap.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, imageData);

      // MUST be filtered with NEAREST or tile lookup fails
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      this.layerTextures[i] = texture;
    }
  }

  draw(x: number, y: number, width: number, height: number, animFrame?: number) {
    const gl = this.gl;
    const tileMap = this.tileMap;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.useProgram(this.tilemapShader);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVertBuffer);

    gl.enableVertexAttribArray(this.positionAttribute);
    gl.enableVertexAttribArray(this.textureAttribute);
    gl.vertexAttribPointer(this.positionAttribute, 2, gl.FLOAT, false, 16, 0);
    gl.vertexAttribPointer(this.textureAttribute, 2, gl.FLOAT, false, 16, 8);

    gl.uniform2f(this.viewOffsetUniform, x, y);
    gl.uniform2f(this.viewportSizeUniform, width, height);
    gl.uniform2f(this.tileSizeUniform, tileMap.tileSize.width, tileMap.tileSize.height);
    gl.uniform1f(this.animFrameUniform, animFrame || 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(this.spriteSamplerUniform, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.uniform1i(this.tileSamplerUniform, 1);

    const minX = Math.min(tileMap.visibleRect.x1, tileMap.prevVisibleRect.x1);
    const minY = Math.min(tileMap.visibleRect.y1, tileMap.prevVisibleRect.y1);
    const maxX = Math.max(tileMap.visibleRect.x2, tileMap.prevVisibleRect.x2);
    const maxY = Math.max(tileMap.visibleRect.y2, tileMap.prevVisibleRect.y2);

    // Draw each layer of the map
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
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, layer.width, layer.height, gl.RGBA, gl.UNSIGNED_BYTE, layer.imageData);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    tileMap.dirty = false;
  }
}
