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
export declare function getTileId(tileX: number, tileY: number): number;
/**
 * @constructor
 * @param {number} width
 * @param {number} height
 * @param {number} layerCount
 */
export declare class TileMap {
    readonly width: number;
    readonly height: number;
    readonly tileSize: Rect;
    readonly grid: TileMapCell[][];
    readonly layerImageData: Uint8Array[];
    tileWidth: number;
    tileHeight: number;
    dirty: boolean;
    originX: number;
    originY: number;
    visibleRect: Rect;
    prevVisibleRect: Rect;
    constructor(width: number, height: number, layerCount: number, tileSize: Rect);
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
