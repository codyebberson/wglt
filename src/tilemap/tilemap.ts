import { TileMapCell } from "./tilemapcell";
import { Rect } from "../rect";

/**
 * Returns the numeric tile ID for a given tile.
 * The underlying format is based on Tiled, an open source tilemap editor.
 * Tile 0 (zero) is a special null tile that is not rendered.
 * Tile 1 and beyond represent the tiles in left-to-right and then top-to-bottom order.
 * The arguments should be specified in tile coordinates, not pixel coordinates.
 * For example, if using 16 pixel x 16 pixel tiles, the tile at x=64, y=32 would be (4, 2).
 * @param tileX The x-coordinate of the tile in the sprite sheet.
 * @param tileY The y-coordinate of the tile in the sprite sheet.
 */
export function getTileId(tileX: number, tileY: number) {
  return 1 + tileY * 64 + tileX;
}

/**
 * @constructor
 * @param {number} width
 * @param {number} height
 * @param {number} layerCount
 */
export class TileMap {
  // readonly gl: WebGLRenderingContext;
  readonly width: number;
  readonly height: number;
  readonly tileSize: Rect;
  readonly grid: TileMapCell[][];
  // readonly layers: TileMapLayer[];
  readonly layerImageData: Uint8Array[];
  tileWidth: number;
  tileHeight: number;
  dirty: boolean;

  // private readonly quadVertBuffer: WebGLBuffer;
  // private readonly tilemapShader: WebGLShader;
  // private readonly positionAttribute: number;
  // private readonly textureAttribute: number;
  // private readonly viewportSizeUniform: WebGLUniformLocation;
  // private readonly viewOffsetUniform: WebGLUniformLocation;
  // private readonly mapSizeUniform: WebGLUniformLocation;
  // private readonly tileSizeUniform: WebGLUniformLocation;
  // private readonly animFrameUniform: WebGLUniformLocation;
  // private readonly tileSamplerUniform: WebGLUniformLocation;
  // private readonly spriteSamplerUniform: WebGLUniformLocation;

  // Field-of-view state
  originX: number;
  originY: number;
  visibleRect: Rect;
  prevVisibleRect: Rect;

  constructor(width: number, height: number, layerCount: number, tileSize: Rect) {
    // this.gl = gl;
    console.log('create tilemap', width, height);
    this.width = width;
    this.height = height;
    this.tileSize = tileSize;
    this.grid = new Array(height);
    this.layerImageData = new Array(layerCount);
    this.tileWidth = 16;
    this.tileHeight = 16;
    this.dirty = true;

    // Field-of-view state
    // By default, everything is visible
    this.originX = 0;
    this.originY = 0;
    this.visibleRect = new Rect(0, 0, width, height);
    this.prevVisibleRect = new Rect(0, 0, width, height);

    for (let y = 0; y < height; y++) {
      this.grid[y] = new Array(width);
      for (let x = 0; x < width; x++) {
        this.grid[y][x] = new TileMapCell(x, y, 0);
      }
    }

    for (let i = 0; i < layerCount; i++) {
      //this.layers[i] = new TileMapLayer(width, height);
      this.layerImageData[i] = new Uint8Array(4 * width * height);
    }

    // const quadVerts = [
    //   // x   y   u  v
    //   -1, -1, 0, 1,
    //   1, -1, 1, 1,
    //   1, 1, 1, 0,
    //   -1, -1, 0, 1,
    //   1, 1, 1, 0,
    //   -1, 1, 0, 0
    // ];

    // this.quadVertBuffer = gl.createBuffer() as WebGLBuffer;
    // gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVertBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quadVerts), gl.STATIC_DRAW);

    // this.tilemapShader = initShaderProgram(gl, tilemapVS, tilemapFS);
    // this.positionAttribute = gl.getAttribLocation(this.tilemapShader, 'position');
    // this.textureAttribute = gl.getAttribLocation(this.tilemapShader, 'texture');
    // this.viewportSizeUniform = gl.getUniformLocation(this.tilemapShader, 'viewportSize') as WebGLUniformLocation;
    // this.viewOffsetUniform = gl.getUniformLocation(this.tilemapShader, 'viewOffset') as WebGLUniformLocation;
    // this.mapSizeUniform = gl.getUniformLocation(this.tilemapShader, 'mapSize') as WebGLUniformLocation;
    // this.tileSizeUniform = gl.getUniformLocation(this.tilemapShader, 'tileSize') as WebGLUniformLocation;
    // this.animFrameUniform = gl.getUniformLocation(this.tilemapShader, 'animFrame') as WebGLUniformLocation;
    // this.tileSamplerUniform = gl.getUniformLocation(this.tilemapShader, 'tiles') as WebGLUniformLocation;
    // this.spriteSamplerUniform = gl.getUniformLocation(this.tilemapShader, 'sprites') as WebGLUniformLocation;

    // for (let i = 0; i < this.layers.length; i++) {
    //   this.layers[i].initGl(gl);
    // }
  }

  clear() {
    // for (let i = 0; i < this.layers.length; i++) {
    //   this.layers[i].clear();
    // }

    for (let i = 0; i < this.layerImageData.length; i++) {
      const imageData = this.layerImageData[i];

      let j = 0;
      while (j < imageData.length) {
        imageData[j++] = 255;
        imageData[j++] = 255;
        imageData[j++] = 0;
        imageData[j++] = 0;
      }
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

    // const layer = this.layers[layerIndex];
    const imageData = this.layerImageData[layerIndex];
    const ti = 4 * (y * this.width + x);
    const tx = tile === 0 ? 255 : ((tile - 1) % 64) | 0;
    const ty = tile === 0 ? 255 : ((tile - 1) / 64) | 0;
    imageData[ti + 0] = tx;
    imageData[ti + 1] = ty;
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
    if (x < this.visibleRect.x1 || x >= this.visibleRect.x2 || y < this.visibleRect.y1 || y >= this.visibleRect.y2) {
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

  isAnimated(tx: number, ty: number, layerIndex: number) {
    if (tx < 0 || tx >= this.width || ty < 0 || ty >= this.height) {
      return false;
    }

    // const layer = this.layers[layerIndex];
    const ti = 4 * (ty * this.width + tx);
    return this.layerImageData[layerIndex][ti + 2] !== 0;
  }

  setAnimated(tx: number, ty: number, layerIndex: number, animated: boolean) {
    if (tx < 0 || tx >= this.width || ty < 0 || ty >= this.height) {
      return;
    }

    // const layer = this.layers[layerIndex];
    const ti = 4 * (ty * this.width + tx);
    this.layerImageData[layerIndex][ti + 2] = animated ? 1 : 0;
  }

  // draw(x: number, y: number, width: number, height: number, animFrame?: number) {
  //   const gl = this.gl;

  //   gl.enable(gl.BLEND);
  //   gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  //   gl.useProgram(this.tilemapShader);

  //   gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVertBuffer);

  //   gl.enableVertexAttribArray(this.positionAttribute);
  //   gl.enableVertexAttribArray(this.textureAttribute);
  //   gl.vertexAttribPointer(this.positionAttribute, 2, gl.FLOAT, false, 16, 0);
  //   gl.vertexAttribPointer(this.textureAttribute, 2, gl.FLOAT, false, 16, 8);

  //   gl.uniform2f(this.viewOffsetUniform, x, y);
  //   gl.uniform2f(this.viewportSizeUniform, width, height);
  //   gl.uniform2f(this.tileSizeUniform, this.tileWidth, this.tileHeight);
  //   gl.uniform1f(this.animFrameUniform, animFrame || 0);

  //   gl.activeTexture(gl.TEXTURE0);
  //   gl.uniform1i(this.spriteSamplerUniform, 0);

  //   gl.activeTexture(gl.TEXTURE1);
  //   gl.uniform1i(this.tileSamplerUniform, 1);

  //   const minX = Math.min(this.visibleRect.x1, this.prevVisibleRect.x1);
  //   const minY = Math.min(this.visibleRect.y1, this.prevVisibleRect.y1);
  //   const maxX = Math.max(this.visibleRect.x2, this.prevVisibleRect.x2);
  //   const maxY = Math.max(this.visibleRect.y2, this.prevVisibleRect.y2);

  //   // Draw each layer of the map
  //   for (let i = 0; i < this.layers.length; i++) {
  //     const layer = this.layers[i];
  //     gl.uniform2fv(this.mapSizeUniform, layer.dimensions);
  //     gl.bindTexture(gl.TEXTURE_2D, layer.texture);

  //     if (this.dirty) {
  //       for (let y = minY; y < maxY; y++) {
  //         for (let x = minX; x < maxX; x++) {
  //           const alpha = this.isVisible(x, y) ? 255 : this.isSeen(x, y) ? 144 : 0;
  //           layer.setAlpha(x, y, alpha);
  //         }
  //       }
  //       layer.updateGl(gl);
  //     }

  //     gl.drawArrays(gl.TRIANGLES, 0, 6);
  //   }
  //   this.dirty = false;
  // }

  resetFov() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.grid[y][x].seen = false;
        this.grid[y][x].visible = false;
      }
    }
  }

  computeFov(originX: number, originY: number, radius: number, vradius?: number) {
    this.originX = originX;
    this.originY = originY;
    this.prevVisibleRect.copy(this.visibleRect);

    const dx = radius;
    const dy = vradius || radius;
    this.visibleRect.x = Math.max(0, originX - dx);
    this.visibleRect.y = Math.max(0, originY - dy);
    this.visibleRect.width = Math.min(this.width - 1, originX + dx) - this.visibleRect.x + 1;
    this.visibleRect.height = Math.min(this.height - 1, originY + dy) - this.visibleRect.y + 1;

    for (let y = this.visibleRect.y1; y < this.visibleRect.y2; y++) {
      for (let x = this.visibleRect.x1; x < this.visibleRect.x2; x++) {
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
    this.dirty = true;
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

    for (y = this.originY + deltaY; y >= this.visibleRect.y1 && y < this.visibleRect.y2;
      y += deltaY, obstaclesInLastLine = totalObstacles, ++iteration) {
      halfSlope = 0.5 / iteration;
      previousEndSlope = -1;
      for (processedCell = Math.floor(minSlope * iteration + 0.5), x = this.originX + (processedCell * deltaX);
        processedCell <= iteration && x >= this.visibleRect.x1 && x < this.visibleRect.x2;
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
          this.grid[y][x].seen = true;
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

    for (x = this.originX + deltaX; x >= this.visibleRect.x1 && x < this.visibleRect.x2;
      x += deltaX, obstaclesInLastLine = totalObstacles, ++iteration) {
      halfSlope = 0.5 / iteration;
      previousEndSlope = -1;
      for (processedCell = Math.floor(minSlope * iteration + 0.5), y = this.originY + (processedCell * deltaY);
        processedCell <= iteration && y >= this.visibleRect.y1 && y < this.visibleRect.y2;
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
          this.grid[y][x].seen = true;
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
