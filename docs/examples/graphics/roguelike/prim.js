
/**
 * Creates a "prim" level.
 *
 * The map is a randomly generated maze using the Prim algorithm:
 * http://stackoverflow.com/a/29810293
 *
 * There are a fixed number of health potions and bombs randomly scattered.
 */
function createPrimLevel(width, height, wallTile, emptyTile) {
    var frontiers = [[1, 1, 1, 1]];
    var lastX = 0;
    var lastY = 0;

    let result = new Console(width, height);
    result.brush = wallTile;
    result.fillRect(0, 0, width, height);

    while (frontiers.length > 0) {
        var r = Math.floor(Math.random() * frontiers.length);
        var f = frontiers.splice(r, 1)[0];
        var x = f[2];
        var y = f[3];
        if (result.getCell(x, y).charCode === wallTile.charCode) {
            result.drawCell(x, y, emptyTile);
            result.drawCell(f[0], f[1], emptyTile);
            lastX = x;
            lastY = y;

            if (x >= 3 && result.getCell(x - 2, y).charCode === wallTile.charCode) {
                frontiers.push([x - 1, y, x - 2, y]);
            }

            if (y >= 3 && result.getCell(x, y - 2).charCode === wallTile.charCode) {
                frontiers.push([x, y - 1, x, y - 2]);
            }

            if (x < width - 3 && result.getCell(x + 2, y).charCode === wallTile.charCode) {
                frontiers.push([x + 1, y, x + 2, y]);
            }

            if (y < height - 3 && result.getCell(x, y + 2).charCode === wallTile.charCode) {
                frontiers.push([x, y + 1, x, y + 2]);
            }
        }
    }

    return result;
}
