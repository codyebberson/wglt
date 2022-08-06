import { Cell } from './cell';
import { Console } from './console';
import { PointLike } from './point';
/**
 * Calculates path between two points using Dijkstra's algorithm.
 *
 * @param source Starting point, must have x and y properties.
 * @param dest Destination point, must have x and y properties.
 * @param maxDist Maximum distance to examine.
 * @return Array of steps if destination found; undefined otherwise.
 */
export declare function computePath(map: Console, source: PointLike, dest: PointLike, maxDist: number): Cell[] | undefined;
