import { Vec2 } from './vec2';
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
export declare function getTileId(tileX: number, tileY: number): number;
export declare class TileMapCell extends Vec2 {
    tile: number;
    blocked: boolean;
    blockedSight: boolean;
    visible: boolean;
    seen: boolean;
    g: number;
    h: number;
    prev: TileMapCell | null;
    constructor(x: number, y: number, tile: number);
}
/**
 * @constructor
 * @param {number} width
 * @param {number} height
 */
export declare class TileMapLayer {
    readonly width: number;
    readonly height: number;
    readonly imageData: Uint8Array;
    readonly dimensions: Float32Array;
    texture: WebGLTexture | null;
    constructor(width: number, height: number);
    clear(): void;
    setAlpha(x: number, y: number, alpha: number): void;
    initGl(gl: WebGLRenderingContext): void;
    updateGl(gl: WebGLRenderingContext): void;
}
/**
 * @constructor
 * @param {number} width
 * @param {number} height
 * @param {number} layerCount
 */
export declare class TileMap {
    readonly gl: WebGLRenderingContext;
    readonly width: number;
    readonly height: number;
    readonly grid: TileMapCell[][];
    readonly layers: TileMapLayer[];
    tileWidth: number;
    tileHeight: number;
    dirty: boolean;
    private readonly quadVertBuffer;
    private readonly tilemapShader;
    private readonly positionAttribute;
    private readonly textureAttribute;
    private readonly viewportSizeUniform;
    private readonly viewOffsetUniform;
    private readonly mapSizeUniform;
    private readonly tileSizeUniform;
    private readonly animFrameUniform;
    private readonly tileSamplerUniform;
    private readonly spriteSamplerUniform;
    private originX;
    private originY;
    private visibleRect;
    private prevVisibleRect;
    constructor(gl: WebGLRenderingContext, width: number, height: number, layerCount: number);
    clear(): void;
    setTile(layerIndex: number, x: number, y: number, tile: number, blocked?: boolean, blockedSight?: boolean): void;
    getCell(tx: number, ty: number): TileMapCell | null;
    getTile(tx: number, ty: number): number;
    isBlocked(tx: number, ty: number): boolean;
    isVisible(x: number, y: number): boolean;
    isSeen(tx: number, ty: number): boolean | null;
    setSeen(tx: number, ty: number, seen: boolean): void;
    isAnimated(tx: number, ty: number, layerIndex: number): boolean;
    setAnimated(tx: number, ty: number, layerIndex: number, animated: boolean): void;
    draw(x: number, y: number, width: number, height: number, animFrame?: number): void;
    resetFov(): void;
    computeFov(originX: number, originY: number, radius: number, vradius?: number): void;
    /**
     * Compute the FOV in an octant adjacent to the Y axis
     */
    private computeOctantY;
    /**
     * Compute the FOV in an octant adjacent to the X axis
     */
    private computeOctantX;
}
