/**
 * Returns the numeric tile ID for a given tile.
 * The underlying format is based on Tiled, an open source tilemap editor.
 * Tile 0 (zero) is a special null tile that is not rendered.
 * Tile 1 and beyond represent the tiles in left-to-right and then top-to-bottom order.
 * The arguments should be specified in tile coordinates, not pixel coordinates.
 * For example, if using 16 pixel x 16 pixel tiles, the tile at x=64, y=32 would be (4, 2).
 * @param tileX The x-coordinate of the tile in the sprite sheet.
 * @param tileY The y-coordinate of the tile in the sprite sheet.
 * @param tilesPerRow - Optional number of tiles per row in the sprite sheet. Default is 64.
 * @returns The numeric tile ID.
 */
export function getTileId(tileX: number, tileY: number, tilesPerRow: number = 64): number {
  return tileY * tilesPerRow + tileX;
}
