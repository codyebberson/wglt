import {initShaderProgram} from './glutils';
import {Vec2} from './vec2';

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
    'uniform sampler2D tiles;' +
    'uniform sampler2D sprites;' +

    'void main(void) {' +
    '   vec4 tile = texture2D(tiles, texCoord);' +
    '   if(tile.x == 1.0 && tile.y == 1.0) { discard; }' +
    '   vec2 spriteOffset = floor(tile.xy * 256.0) * tileSize;' +
    '   vec2 spriteCoord = mod(pixelCoord, tileSize);' +
    '   gl_FragColor = texture2D(sprites, (spriteOffset + spriteCoord) / ' + TEXTURE_SIZE + '.0);' +
    '   if (gl_FragColor.a == 0.0) discard;' +
    '   gl_FragColor.a *= tile.a;' +
    '}';

export class TileMapCell extends Vec2 {
  tile: number;
  blocked: boolean;
  blockedSight: boolean;
  visible: boolean;
  seen: boolean;
  g: number;
  h: number;
  prev: TileMapCell|null;

  constructor(x: number, y: number, tile: number) {
    super(x, y);
    this.tile = tile;
    this.blocked = true;
    this.blockedSight = true;
    this.visible = false;
    this.seen = false;
    this.g = 0;
    this.h = 0;
    this.prev = null;
  }
}

/**
 * @constructor
 * @param {number} width
 * @param {number} height
 */
export class TileMapLayer {
  readonly width: number;
  readonly height: number;
  readonly imageData: Uint8Array;
  readonly dimensions: Float32Array;
  texture: WebGLTexture|null;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.imageData = new Uint8Array(4 * width * height);
    this.dimensions = new Float32Array([width, height]);
    this.texture = null;
    this.clear();
  }

  clear() {
    for (let i = 0; i < this.imageData.length; i++) {
      this.imageData[i] = 255;
    }
  }

  setAlpha(x: number, y: number, alpha: number) {
    this.imageData[4 * (y * this.width + x) + 3] = alpha;
  }

  initGl(gl: WebGLRenderingContext) {
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.imageData);

    // MUST be filtered with NEAREST or tile lookup fails
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  updateGl(gl: WebGLRenderingContext) {
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, this.imageData);
  }
}

/**
 * @constructor
 * @param {number} width
 * @param {number} height
 * @param {number} layerCount
 */
export class TileMap {
  readonly gl: WebGLRenderingContext;
  readonly width: number;
  readonly height: number;
  readonly grid: TileMapCell[][];
  readonly layers: TileMapLayer[];
  tileWidth: number;
  tileHeight: number;

  private readonly quadVertBuffer: WebGLBuffer;
  private readonly tilemapShader: WebGLShader;
  private readonly positionAttribute: number;
  private readonly textureAttribute: number;
  private readonly viewportSizeUniform: WebGLUniformLocation;
  private readonly viewOffsetUniform: WebGLUniformLocation;
  private readonly mapSizeUniform: WebGLUniformLocation;
  private readonly tileSizeUniform: WebGLUniformLocation;
  private readonly tileSamplerUniform: WebGLUniformLocation;
  private readonly spriteSamplerUniform: WebGLUniformLocation;

  // Field-of-view state
  private originX: number;
  private originY: number;
  private minX: number;
  private maxX: number;
  private minY: number;
  private maxY: number;

  constructor(gl: WebGLRenderingContext, width: number, height: number, layerCount: number) {
    this.gl = gl;
    this.width = width;
    this.height = height;
    this.grid = new Array(height);
    this.layers = new Array(layerCount);
    this.tileWidth = 16;
    this.tileHeight = 16;

    // Field-of-view state
    // By default, everything is visible
    this.originX = 0;
    this.originY = 0;
    this.minX = 0;
    this.maxX = width - 1;
    this.minY = 0;
    this.maxY = height - 1;

    for (let y = 0; y < height; y++) {
      this.grid[y] = new Array(width);
      for (let x = 0; x < width; x++) {
        this.grid[y][x] = new TileMapCell(x, y, 0);
      }
    }

    for (let i = 0; i < layerCount; i++) {
      this.layers[i] = new TileMapLayer(width, height);
    }

    const quadVerts = [
      // x  y  u  v
      -1, -1, 0, 1, 1, -1, 1, 1, 1,  1, 1, 0,

      -1, -1, 0, 1, 1, 1,  1, 0, -1, 1, 0, 0
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
    this.tileSamplerUniform = gl.getUniformLocation(this.tilemapShader, 'tiles') as WebGLUniformLocation;
    this.spriteSamplerUniform = gl.getUniformLocation(this.tilemapShader, 'sprites') as WebGLUniformLocation;

    for (let i = 0; i < this.layers.length; i++) {
      this.layers[i].initGl(gl);
    }
  }

  setTile(layerIndex: number, x: number, y: number, tile: number, blocked?: boolean, blockedSight?: boolean) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return;
    }

    if (layerIndex === 0) {
      this.grid[y][x].tile = tile;
      this.grid[y][x].blocked = !!blocked;
      this.grid[y][x].blockedSight = (blockedSight !== undefined) ? blockedSight : !!blocked;
    }

    const layer = this.layers[layerIndex];
    const ti = 4 * (y * layer.width + x);
    const tx = tile === 0 ? 255 : ((tile - 1) % 64) | 0;
    const ty = tile === 0 ? 255 : ((tile - 1) / 64) | 0;
    layer.imageData[ti + 0] = tx;
    layer.imageData[ti + 1] = ty;
  }

  getCell(tx: number, ty: number) {
    if (tx < 0 || tx >= this.width || ty < 0 || ty >= this.height) {
      return null;
    }
    return this.grid[ty][tx];
  }

  getTile(tx: number, ty: number) {
    const cell = this.getCell(tx, ty);
    return cell ? cell.tile : 0;
  }

  isBlocked(tx: number, ty: number) {
    const cell = this.getCell(tx, ty);
    return !cell || cell.blocked;
  }

  isVisible(x: number, y: number) {
    if (x < this.minX || x > this.maxX || y < this.minY || y > this.maxY) {
      return false;
    }
    return this.grid[y][x].visible;
  }

  isSeen(tx: number, ty: number) {
    const cell = this.getCell(tx, ty);
    return cell && cell.seen;
  }

  setSeen(tx: number, ty: number, seen: boolean) {
    const cell = this.getCell(tx, ty);
    if (cell) {
      cell.seen = seen;
    }
  }

  draw(x: number, y: number, width: number, height: number) {
    const gl = this.gl;

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
    gl.uniform2f(this.tileSizeUniform, this.tileWidth, this.tileHeight);

    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(this.spriteSamplerUniform, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.uniform1i(this.tileSamplerUniform, 1);

    const tx1 = (x / this.tileWidth) | 0;
    const ty1 = (y / this.tileHeight) | 0;
    const tx2 = ((x + width) / this.tileWidth) | 0;
    const ty2 = ((y + height) / this.tileHeight) | 0;

    // Draw each layer of the map
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];

      for (let ty = ty1; ty <= ty2; ty++) {
        for (let tx = tx1; tx <= tx2; tx++) {
          const alpha = this.isVisible(tx, ty) ? 255 : this.isSeen(tx, ty) ? 144 : 0;
          layer.setAlpha(tx, ty, alpha);
        }
      }

      gl.uniform2fv(this.mapSizeUniform, layer.dimensions);
      gl.bindTexture(gl.TEXTURE_2D, layer.texture);
      layer.updateGl(gl);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }

  resetFov() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.grid[y][x].seen = false;
        this.grid[y][x].visible = false;
      }
    }
  }

  computeFov(originX: number, originY: number, radius: number) {
    this.originX = originX;
    this.originY = originY;
    this.minX = Math.max(0, originX - radius);
    this.minY = Math.max(0, originY - radius);
    this.maxX = Math.min(this.width - 1, originX + radius);
    this.maxY = Math.min(this.height - 1, originY + radius);

    for (let y = this.minY; y <= this.maxY; y++) {
      for (let x = this.minX; x <= this.maxX; x++) {
        this.grid[y][x].seen = this.grid[y][x].seen || this.grid[y][x].visible;
        this.grid[y][x].visible = false;
      }
    }

    this.grid[originY][originX].visible = true;

    this.computeOctantY(1, 1);
    this.computeOctantX(1, 1);
    this.computeOctantY(1, -1);
    this.computeOctantX(1, -1);
    this.computeOctantY(-1, 1);
    this.computeOctantX(-1, 1);
    this.computeOctantY(-1, -1);
    this.computeOctantX(-1, -1);
  }

  /**
   * Compute the FOV in an octant adjacent to the Y axis
   */
  private computeOctantY(deltaX: number, deltaY: number) {
    const startSlopes: number[] = [];
    const endSlopes: number[] = [];
    let iteration = 1;
    let totalObstacles = 0;
    let obstaclesInLastLine = 0;
    let minSlope = 0;
    let x;
    let y;
    let halfSlope;
    let processedCell;
    let visible;
    let extended;
    let centreSlope;
    let startSlope;
    let endSlope;
    let previousEndSlope;

    for (y = this.originY + deltaY; y >= this.minY && y <= this.maxY;
         y += deltaY, obstaclesInLastLine = totalObstacles, ++iteration) {
      halfSlope = 0.5 / iteration;
      previousEndSlope = -1;
      for (processedCell = Math.floor(minSlope * iteration + 0.5), x = this.originX + (processedCell * deltaX);
           processedCell <= iteration && x >= this.minX && x <= this.maxX;
           x += deltaX, ++processedCell, previousEndSlope = endSlope) {
        visible = true;
        extended = false;
        centreSlope = processedCell / iteration;
        startSlope = previousEndSlope;
        endSlope = centreSlope + halfSlope;

        if (obstaclesInLastLine > 0) {
          if (!(this.grid[y - deltaY][x].visible && !this.grid[y - deltaY][x].blockedSight) &&
              !(this.grid[y - deltaY][x - deltaX].visible && !this.grid[y - deltaY][x - deltaX].blockedSight)) {
            visible = false;
          } else {
            for (let idx = 0; idx < obstaclesInLastLine && visible; ++idx) {
              if (startSlope <= endSlopes[idx] && endSlope >= startSlopes[idx]) {
                if (!this.grid[y][x].blockedSight) {
                  if (centreSlope > startSlopes[idx] && centreSlope < endSlopes[idx]) {
                    visible = false;
                    break;
                  }
                } else {
                  if (startSlope >= startSlopes[idx] && endSlope <= endSlopes[idx]) {
                    visible = false;
                    break;
                  } else {
                    startSlopes[idx] = Math.min(startSlopes[idx], startSlope);
                    endSlopes[idx] = Math.max(endSlopes[idx], endSlope);
                    extended = true;
                  }
                }
              }
            }
          }
        }
        if (visible) {
          this.grid[y][x].visible = true;
          if (this.grid[y][x].blockedSight) {
            if (minSlope >= startSlope) {
              minSlope = endSlope;
            } else if (!extended) {
              startSlopes[totalObstacles] = startSlope;
              endSlopes[totalObstacles++] = endSlope;
            }
          }
        }
      }
    }
  }

  /**
   * Compute the FOV in an octant adjacent to the X axis
   */
  private computeOctantX(deltaX: number, deltaY: number) {
    const startSlopes: number[] = [];
    const endSlopes: number[] = [];
    let iteration = 1;
    let totalObstacles = 0;
    let obstaclesInLastLine = 0;
    let minSlope = 0;
    let x;
    let y;
    let halfSlope;
    let processedCell;
    let visible;
    let extended;
    let centreSlope;
    let startSlope;
    let endSlope;
    let previousEndSlope;

    for (x = this.originX + deltaX; x >= this.minX && x <= this.maxX;
         x += deltaX, obstaclesInLastLine = totalObstacles, ++iteration) {
      halfSlope = 0.5 / iteration;
      previousEndSlope = -1;
      for (processedCell = Math.floor(minSlope * iteration + 0.5), y = this.originY + (processedCell * deltaY);
           processedCell <= iteration && y >= this.minY && y <= this.maxY;
           y += deltaY, ++processedCell, previousEndSlope = endSlope) {
        visible = true;
        extended = false;
        centreSlope = processedCell / iteration;
        startSlope = previousEndSlope;
        endSlope = centreSlope + halfSlope;

        if (obstaclesInLastLine > 0) {
          if (!(this.grid[y][x - deltaX].visible && !this.grid[y][x - deltaX].blockedSight) &&
              !(this.grid[y - deltaY][x - deltaX].visible && !this.grid[y - deltaY][x - deltaX].blockedSight)) {
            visible = false;
          } else {
            for (let idx = 0; idx < obstaclesInLastLine && visible; ++idx) {
              if (startSlope <= endSlopes[idx] && endSlope >= startSlopes[idx]) {
                if (!this.grid[y][x].blockedSight) {
                  if (centreSlope > startSlopes[idx] && centreSlope < endSlopes[idx]) {
                    visible = false;
                    break;
                  }
                } else {
                  if (startSlope >= startSlopes[idx] && endSlope <= endSlopes[idx]) {
                    visible = false;
                    break;
                  } else {
                    startSlopes[idx] = Math.min(startSlopes[idx], startSlope);
                    endSlopes[idx] = Math.max(endSlopes[idx], endSlope);
                    extended = true;
                  }
                }
              }
            }
          }
        }
        if (visible) {
          this.grid[y][x].visible = true;
          if (this.grid[y][x].blockedSight) {
            if (minSlope >= startSlope) {
              minSlope = endSlope;
            } else if (!extended) {
              startSlopes[totalObstacles] = startSlope;
              endSlopes[totalObstacles++] = endSlope;
            }
          }
        }
      }
    }
  }
}
