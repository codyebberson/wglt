"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computePath = void 0;
var dxs = [-1, 0, 1, -1, 1, -1, 0, 1];
var dys = [-1, -1, -1, 0, 0, 1, 1, 1];
var costs = [1.4, 1, 1.4, 1, 1, 1.4, 1, 1.4];
var pathId = 0;
/**
 * Calculates Dijkstra's algorithm.
 *
 * @param {!Object} source Starting point, must have x and y properties.
 * @param {!Object=} opt_dest Optional destination point, must have x and y properties.
 * @param {!number=} opt_maxDist Optional maximum distance to examine.
 * @return {?Array} Array of steps if destination found; null otherwise.
 */
function computePath(map, source, dest, maxDist) {
    pathId++;
    var sourceCell = map.grid[source.y][source.x];
    sourceCell.pathId = pathId;
    sourceCell.g = 0.0;
    sourceCell.h = Math.hypot(source.x - dest.x, source.y - dest.y);
    sourceCell.prev = null;
    var q = new SortedSet([sourceCell]);
    while (q.size() > 0) {
        var u = q.pop();
        if (u.x === dest.x && u.y === dest.y) {
            return buildPath(u);
        }
        for (var i = 0; i < dxs.length; i++) {
            var x = u.x + dxs[i];
            var y = u.y + dys[i];
            if (x >= 0 && x < map.width && y >= 0 && y < map.height) {
                var v = map.grid[y][x];
                if (v.blocked && v.explored && (x !== dest.x || y !== dest.y)) {
                    continue;
                }
                if (v.pathId !== pathId) {
                    v.pathId = pathId;
                    v.g = Infinity;
                    v.h = Math.hypot(x - dest.x, y - dest.y);
                    v.prev = null;
                }
                var alt = u.g + costs[i];
                if (alt < v.g && alt <= maxDist) {
                    v.g = alt;
                    v.prev = u;
                    q.insert(v);
                }
            }
        }
    }
    return null;
}
exports.computePath = computePath;
function buildPath(cell) {
    var result = [];
    var curr = cell;
    while (curr) {
        result.push(curr);
        curr = curr.prev;
    }
    result.reverse();
    return result;
}
var SortedSet = /** @class */ (function () {
    function SortedSet(initialValues) {
        this.values = initialValues;
    }
    SortedSet.prototype.insert = function (cell) {
        var array = this.values;
        var low = 0;
        var high = array.length;
        var index = 0;
        while (low < high) {
            var mid = (low + high) >>> 1;
            var midCell = array[mid];
            if (midCell.g + midCell.h > cell.g + cell.h) {
                low = mid + 1;
                index = low;
            }
            else {
                high = mid;
                index = high;
            }
        }
        array.splice(index, 0, cell);
    };
    SortedSet.prototype.pop = function () {
        return this.values.pop();
    };
    SortedSet.prototype.size = function () {
        return this.values.length;
    };
    return SortedSet;
}());
