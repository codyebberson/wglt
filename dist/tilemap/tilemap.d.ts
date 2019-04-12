import { TileMapCell } from "./tilemapcell";
import { Rect } from "../rect";
import { TileMapLayer } from "./tilemaplayer";
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
    readonly depth: number;
    readonly tileSize: Rect;
    readonly grid: TileMapCell[][];
    readonly layers: TileMapLayer[];
    dirty: boolean;
    originX: number;
    originY: number;
    visibleRect: Rect;
    prevVisibleRect: Rect;
    constructor(width: number, height: number, layerCount: number, tileSize: Rect);
    isOutOfRange(x: number, y: number, z: number): boolean;
    clear(): void;
    getTile(x: number, y: number, z: number): number;
    setTile(x: number, y: number, z: number, tile: number): void;
    isBlocked(x: number, y: number): boolean;
    setBlocked(x: number, y: number, blocked: boolean, blockedSight?: boolean): void;
    getCell(x: number, y: number): TileMapCell | null;
    isVisible(x: number, y: number): boolean;
    isSeen(x: number, y: number): boolean | null;
    setSeen(x: number, y: number, seen: boolean): void;
    isAnimated(x: number, y: number, z: number): boolean;
    setAnimated(x: number, y: number, z: number, animated: boolean): void;
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
