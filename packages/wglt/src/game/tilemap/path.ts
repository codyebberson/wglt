import { PointLike } from '../../core/point';
import { TileMap } from './tilemap';
import { TileMapCell } from './tilemapcell';

const dxs = [-1, 0, 1, -1, 1, -1, 0, 1];
const dys = [-1, -1, -1, 0, 0, 1, 1, 1];
const costs = [1.5, 1, 1.5, 1, 1, 1.5, 1, 1.5];
let pathId = 0;

/**
 * Calculates Dijkstra's algorithm.
 *
 * @param source Starting point, must have x and y properties.
 * @param dest Optional destination point, must have x and y properties.
 * @param maxDist Optional maximum distance to examine.
 * @returns Array of steps if destination found; undefined otherwise.
 */
export function computePath(
  map: TileMap,
  source: PointLike,
  dest: PointLike | undefined,
  maxDist = 100
): TileMapCell[] | undefined {
  pathId++;

  const sourceCell = map.grid[source.y][source.x];
  sourceCell.pathId = pathId;
  sourceCell.g = 0.0;
  sourceCell.h = calculateHeuristic(source, dest);
  sourceCell.prev = null;

  const q = new SortedSet([sourceCell]);

  while (q.size() > 0) {
    const u = q.pop() as TileMapCell;

    if (!dest) {
      // No destination
      // Special case for searching for "not explored"
      if (!u.explored) {
        return buildPath(u);
      }
    } else {
      // Otherwise looking for the destination
      if (u.x === dest.x && u.y === dest.y) {
        return buildPath(u);
      }
    }

    for (let i = 0; i < dxs.length; i++) {
      const x = u.x + dxs[i];
      const y = u.y + dys[i];
      if (x >= 0 && x < map.width && y >= 0 && y < map.height) {
        const v = map.grid[y][x];
        if (v.blocked && v.explored && (x !== dest?.x || y !== dest?.y)) {
          continue;
        }
        if (v.pathId !== pathId) {
          v.pathId = pathId;
          v.g = Number.POSITIVE_INFINITY;
          v.h = calculateHeuristic(v, dest);
          v.prev = null;
        }
        const alt = u.g + costs[i];
        if (alt < v.g && alt <= maxDist) {
          v.g = alt;
          v.prev = u;
          q.insert(v);
        }
      }
    }
  }
  return undefined;
}

function calculateHeuristic(cell: PointLike, dest: PointLike | undefined): number {
  if (!dest) {
    return 0;
  }
  return Math.hypot(cell.x - dest.x, cell.y - dest.y);
}

function buildPath(cell: TileMapCell): TileMapCell[] {
  const result = [];
  let curr: TileMapCell | null = cell;
  while (curr) {
    result.push(curr);
    curr = curr.prev;
  }
  result.reverse();
  return result;
}

class SortedSet {
  private readonly values: TileMapCell[];

  constructor(initialValues: TileMapCell[]) {
    this.values = initialValues;
  }

  insert(cell: TileMapCell): void {
    const array = this.values;
    let low = 0;
    let high = array.length;
    let index = 0;

    while (low < high) {
      const mid = (low + high) >>> 1;
      const midCell = array[mid];
      if (midCell.g + midCell.h > cell.g + cell.h) {
        low = mid + 1;
        index = low;
      } else {
        high = mid;
        index = high;
      }
    }
    array.splice(index, 0, cell);
  }

  pop(): TileMapCell | undefined {
    return this.values.pop();
  }

  size(): number {
    return this.values.length;
  }
}
