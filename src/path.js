
/**
 * Calculates Dijkstra's algorithm.
 *
 * @param {!Object} source Starting point, must have x and y properties.
 * @param {!Object=} opt_dest Optional destination point, must have x and y properties.
 * @param {!number=} opt_maxDist Optional maximum distance to examine.
 * @return {?Array} Array of steps if destination found; null otherwise.
 */
function dijkstra(source, opt_dest, opt_maxDist) {
    clearDijkstra(opt_dest);

    source = map.grid[source.y][source.x];
    source.g = 0;

    const dxs = [-1, 0, 1, -1, 1, -1, 0, 1];
    const dys = [-1, -1, -1, 0, 0, 1, 1, 1];
    const costs = [1.5, 1, 1.5, 1, 1, 1.5, 1, 1.5];

    var q = [source];

    while (q.length > 0) {
        var u = getMinCell(q);

        if (opt_dest && u.x === opt_dest.x && u.y === opt_dest.y) {
            return buildPath(u);
        }

        for (var i = 0; i < dxs.length; i++) {
            var x = u.x + dxs[i];
            var y = u.y + dys[i];
            if (x >= 0 && x < map.width && y >= 0 && y < map.height) {
                var v = map.grid[y][x];
                var alt = u.g + costs[i];
                if (alt < v.g &&
                        ((opt_dest && opt_dest.x === v.x && opt_dest.y === v.y) || isEmpty(x, y)) &&
                        (!opt_maxDist || alt <= opt_maxDist)) {
                    v.g = alt;
                    v.prev = u;
                    q.push(v);
                }
            }
        }
    }
    return null;
}

function clearDijkstra(dest) {
    for (var y = 0; y < map.height; y++) {
        for (var x = 0; x < map.width; x++) {
            var cell = map.grid[y][x];
            cell.x = x;
            cell.y = y;
            cell.g = Infinity;
            cell.h = Math.min(Math.abs(x - dest.x), Math.abs(y - dest.y));
            cell.prev = null;
        }
    }
}

function getMinCell(q) {
    var bestCell = null;
    var bestIndex = -1;
    var minDist = Infinity;

    for (var i = 0; i < q.length; i++) {
        var cell = q[i];
        if (cell.g !== Infinity && cell.g + cell.h < minDist) {
            bestCell = cell;
            bestIndex = i;
            minDist = cell.g + cell.h;
        }
    }

    q.splice(bestIndex, 1);
    return bestCell;
}

function buildPath(cell) {
    var result = [];
    while (cell) {
        result.push(cell);
        cell = cell.prev;
    }
    result.reverse();
    return result;
}
