/**
 * The FovOctants constants provide bitmasks for various directions.
 *
 *     \ 4 | 3 /
 *      \  |  /
 *    5  \ | /  2
 *        \|/
 *   ------+-------
 *        /|\
 *    6  / | \  1
 *      /  |  \
 *     / 7 | 0 \
 *
 */
export declare enum FovOctants {
    OCTANT_SOUTH_SOUTHEAST = 1,
    OCTANT_EAST_SOUTHEAST = 2,
    OCTANT_EAST_NORTHTHEAST = 4,
    OCTANT_NORTH_NORTHEAST = 8,
    OCTANT_NORTH_NORTHWEST = 16,
    OCTANT_WEST_NORTHEAST = 32,
    OCTANT_WEST_SOUTHWEST = 64,
    OCTANT_SOUTH_SOUTHWEST = 128
}
export declare enum FovQuadrants {
    QUADRANT_SOUTHEAST = 3,
    QUADRANT_EAST = 6,
    QUADRANT_NORTHEAST = 12,
    QUADRANT_NORTH = 24,
    QUADRANT_NORTHWEST = 48,
    QUADRANT_WEST = 96,
    QUADRANT_SOUTHWEST = 192,
    QUADRANT_SOUTH = 129
}
export declare function getFovQuadrant(dx: number, dy: number): FovQuadrants;
