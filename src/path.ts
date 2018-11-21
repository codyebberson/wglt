
import {FovCell, FovMap} from './fov';
import {Point} from './point';

const dxs = [-1, 0, 1, -1, 1, -1, 0, 1];
const dys = [-1, -1, -1, 0, 0, 1, 1, 1];
const costs = [1.5, 1, 1.5, 1, 1, 1.5, 1, 1.5];

/**
 * Calculates Dijkstra's algorithm.
 *
 * @param {!Object} source Starting point, must have x and y properties.
 * @param {!Object=} opt_dest Optional destination point, must have x and y properties.
 * @param {!number=} opt_maxDist Optional maximum distance to examine.
 * @return {?Array} Array of steps if destination found; null otherwise.
 */
export function computePath(
    map: FovMap, source: Point, dest: Point, maxDist: number) {
  clearDijkstra(map, dest);

  const sourceCell = map.grid[source.y][source.x];
  sourceCell.g = 0.0;

  const q: FovCell[] = [sourceCell];

  while (q.length > 0) {
    const u = getMinCell(q);

    if (u.x === dest.x && u.y === dest.y) {
      return buildPath(u);
    }

    for (let i = 0; i < dxs.length; i++) {
      const x = u.x + dxs[i];
      const y = u.y + dys[i];
      if (x >= 0 && x < map.width && y >= 0 && y < map.height) {
        const v = map.grid[y][x];
        const alt = u.g + costs[i];
        if (alt < v.g &&
            ((dest.x === v.x && dest.y === v.y) || !map.grid[y][x].blocked) &&
            (alt <= maxDist)) {
          v.g = alt;
          v.prev = u;
          q.push(v);
        }
      }
    }
  }
  return null;
}

function clearDijkstra(map: FovMap, dest: Point) {
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const cell = map.grid[y][x];
      cell.g = Infinity;
      cell.h = Math.min(Math.abs(x - dest.x), Math.abs(y - dest.y));
      cell.prev = null;
    }
  }
}

function getMinCell(q: FovCell[]): FovCell {
  let bestCell = null;
  let bestIndex = -1;
  let minDist = Infinity;

  for (let i = 0; i < q.length; i++) {
    const cell = q[i];
    if (cell.g !== Infinity && cell.g + cell.h < minDist) {
      bestCell = cell;
      bestIndex = i;
      minDist = cell.g + cell.h;
    }
  }

  q.splice(bestIndex, 1);
  return bestCell as FovCell;
}

function buildPath(cell: FovCell) {
  const result = [];
  let curr: FovCell|null = cell;
  while (curr) {
    result.push(curr);
    curr = curr.prev;
  }
  result.reverse();
  return result;
}