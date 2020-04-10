
const dxs = [-1, 0, 1, -1, 1, -1, 0, 1];
const dys = [-1, -1, -1, 0, 0, 1, 1, 1];
const costs = [1.5, 1, 1.5, 1, 1, 1.5, 1, 1.5];
let pathId = 0;

/**
 * Calculates Dijkstra's algorithm.
 *
 * @param {!Object} source Starting point, must have x and y properties.
 * @param {!Object=} opt_dest Optional destination point, must have x and y properties.
 * @param {!number=} opt_maxDist Optional maximum distance to examine.
 * @return {?Array} Array of steps if destination found; null otherwise.
 */
export function computePath(map, source, dest, maxDist) {
  pathId++;

  const sourceCell = map.grid[source.y][source.x];
  sourceCell.pathId = pathId;
  sourceCell.g = 0.0;
  sourceCell.h = Math.min(Math.abs(source.x - dest.x), Math.abs(source.y - dest.y));
  sourceCell.prev = null;

  const q = new SortedSet([sourceCell]);

  while (q.size() > 0) {
    const u = q.pop();

    if (u.x === dest.x && u.y === dest.y) {
      return buildPath(u);
    }

    for (let i = 0; i < dxs.length; i++) {
      const x = u.x + dxs[i];
      const y = u.y + dys[i];
      if (x >= 0 && x < map.width && y >= 0 && y < map.height) {
        const v = map.grid[y][x];
        if (v.pathId !== pathId) {
          v.pathId = pathId;
          v.g = Infinity;
          v.h = Math.min(Math.abs(x - dest.x), Math.abs(y - dest.y));
          v.prev = null;
        }
        const alt = u.g + costs[i];
        if (alt < v.g && alt <= maxDist && (!map.grid[y][x].blocked || (x === dest.x && y === dest.y))) {
          v.g = alt;
          v.prev = u;
          q.insert(v);
        }
      }
    }
  }
  return null;
}

function buildPath(cell) {
  const result = [];
  let curr = cell;
  while (curr) {
    result.push(curr);
    curr = curr.prev;
  }
  result.reverse();
  return result;
}

class SortedSet {
  constructor(initialValues) {
    this.values = initialValues
  }

  insert(cell) {
    const array = this.values;
    let low = 0;
    let high = array.length;

    while (low < high) {
      const mid = (low + high) >>> 1;
      const midCell = array[mid];
      if (midCell.g + midCell.h > cell.g + cell.h) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    array.splice(low + 1, 0, cell);
  }

  pop() {
    return this.values.pop();
  }

  size() {
    return this.values.length;
  }
}