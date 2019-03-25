import {TileMap, TileMapCell} from './tilemap';
import {Vec2} from './vec2';

const dxs = [-1, 0, 1, -1, 1, -1, 0, 1];
const dys = [-1, -1, -1, 0, 0, 1, 1, 1];
const costs = [1.5, 1, 1.5, 1, 1, 1.5, 1, 1.5];

// const dxs = [0, -1, 1, 0];
// const dys = [-1, 0, 0, 1];
// const costs = [1, 1, 1, 1];

/**
 * Calculates Dijkstra's algorithm.
 *
 * @param {!Object} source Starting point, must have x and y properties.
 * @param {!Object=} dest Optional destination point, must have x and y properties.
 * @param {!number=} maxDist Optional maximum distance to examine.
 * @return {?Array} Array of steps if destination found; null otherwise.
 */
export function computePath(map: TileMap, source: Vec2, dest: Vec2, maxDist: number) {
  clearDijkstra(map, dest);

  const sourceCell = map.grid[source.y][source.x];
  sourceCell.g = 0.0;

  const q: TileMapCell[] = [sourceCell];

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
        if (alt < v.g && alt <= maxDist && ((x === dest.x && y === dest.y) || !map.grid[y][x].blocked)) {
          v.g = alt;
          v.prev = u;
          q.push(v);
        }
      }
    }
  }
  return undefined;
}

function clearDijkstra(map: TileMap, dest: Vec2) {
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const cell = map.grid[y][x];
      cell.g = Infinity;
      cell.h = Math.min(Math.abs(x - dest.x), Math.abs(y - dest.y));
      cell.prev = null;
    }
  }
}

function getMinCell(q: TileMapCell[]): TileMapCell {
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
  return bestCell as TileMapCell;
}

function buildPath(cell: TileMapCell) {
  const result = [];
  let curr: TileMapCell|null = cell;
  while (curr) {
    result.push(curr);
    curr = curr.prev;
  }
  result.reverse();
  return result;
}
