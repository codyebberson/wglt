import { FovCell, FovMap } from './fov';
import { Point } from './point';
/**
 * Calculates Dijkstra's algorithm.
 *
 * @param {!Object} source Starting point, must have x and y properties.
 * @param {!Object=} opt_dest Optional destination point, must have x and y properties.
 * @param {!number=} opt_maxDist Optional maximum distance to examine.
 * @return {?Array} Array of steps if destination found; null otherwise.
 */
export declare function computePath(map: FovMap, source: Point, dest: Point, maxDist: number): FovCell[] | null;
