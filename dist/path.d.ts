import { TileMap, TileMapCell } from './tilemap';
import { Vec2 } from './vec2';
/**
 * Calculates Dijkstra's algorithm.
 *
 * @param {!Object} source Starting point, must have x and y properties.
 * @param {!Object=} dest Optional destination point, must have x and y properties.
 * @param {!number=} maxDist Optional maximum distance to examine.
 * @return {?Array} Array of steps if destination found; null otherwise.
 */
export declare function computePath(map: TileMap, source: Vec2, dest: Vec2, maxDist: number): TileMapCell[] | undefined;
