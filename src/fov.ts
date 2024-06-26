/**
 * The FovOctants constants provide bitmasks for various directions.
 *
 * @example
 * ```
 *     \ 4 | 3 /
 *      \  |  /
 *    5  \ | /  2
 *        \|/
 *   ------+-------
 *        /|\
 *    6  / | \  1
 *      /  |  \
 *     / 7 | 0 \
 *```
 */
export const FovOctants = {
  OCTANT_SOUTH_SOUTHEAST: 0x001,
  OCTANT_EAST_SOUTHEAST: 0x002,
  OCTANT_EAST_NORTHTHEAST: 0x004,
  OCTANT_NORTH_NORTHEAST: 0x008,
  OCTANT_NORTH_NORTHWEST: 0x010,
  OCTANT_WEST_NORTHEAST: 0x020,
  OCTANT_WEST_SOUTHWEST: 0x040,
  OCTANT_SOUTH_SOUTHWEST: 0x080,
};

export const FovQuadrants = {
  QUADRANT_SOUTHEAST: 0x001 + 0x002,
  QUADRANT_EAST: 0x002 + 0x004,
  QUADRANT_NORTHEAST: 0x004 + 0x008,
  QUADRANT_NORTH: 0x008 + 0x010,
  QUADRANT_NORTHWEST: 0x010 + 0x020,
  QUADRANT_WEST: 0x020 + 0x040,
  QUADRANT_SOUTHWEST: 0x040 + 0x080,
  QUADRANT_SOUTH: 0x080 + 0x001,
};

export function getFovQuadrant(dx: number, dy: number): number {
  if (dx > 0) {
    if (dy > 0) {
      return FovQuadrants.QUADRANT_SOUTHEAST;
    }
    if (dy === 0) {
      return FovQuadrants.QUADRANT_EAST;
    }
    return FovQuadrants.QUADRANT_NORTHEAST;
  }
  if (dx < 0) {
    if (dy > 0) {
      return FovQuadrants.QUADRANT_SOUTHWEST;
    }
    if (dy === 0) {
      return FovQuadrants.QUADRANT_WEST;
    }
    return FovQuadrants.QUADRANT_NORTHWEST;
  }
  if (dy > 0) {
    return FovQuadrants.QUADRANT_SOUTH;
  }
  return FovQuadrants.QUADRANT_NORTH;
}
