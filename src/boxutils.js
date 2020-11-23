"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixBoxCells = void 0;
/**
 * Details about box characters.
 * The first element is the array of details for the first box char (0xB3).
 * Each sub array is the count of stems for top, right, bottom, and left.
 */
var BOX_CHAR_DETAILS = [
    [1, 0, 1, 0],
    [1, 0, 1, 1],
    [1, 0, 1, 2],
    [2, 0, 2, 1],
    [0, 0, 2, 1],
    [0, 0, 1, 2],
    [2, 0, 2, 2],
    [2, 0, 2, 0],
    [0, 0, 2, 2],
    [2, 0, 0, 2],
    [2, 0, 0, 1],
    [1, 0, 0, 2],
    [0, 0, 1, 1],
    [1, 1, 0, 0],
    [1, 1, 0, 1],
    [0, 1, 1, 1],
    [1, 1, 1, 0],
    [0, 1, 0, 1],
    [1, 1, 1, 1],
    [1, 2, 1, 0],
    [2, 1, 2, 0],
    [2, 2, 0, 0],
    [0, 2, 2, 0],
    [2, 2, 0, 2],
    [0, 2, 2, 2],
    [2, 2, 2, 0],
    [0, 2, 0, 2],
    [2, 2, 2, 2],
    [1, 2, 0, 2],
    [2, 1, 0, 1],
    [0, 2, 1, 2],
    [0, 1, 2, 1],
    [2, 1, 0, 0],
    [1, 2, 0, 0],
    [0, 2, 1, 0],
    [0, 1, 2, 0],
    [2, 1, 2, 1],
    [1, 2, 1, 2],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
];
function isBoxCell(con, x, y) {
    var charCode = con.getCell(x, y).charCode;
    return charCode >= 0xB3 && charCode <= 0xDA;
}
function getBoxCount(con, x, y, index) {
    if (x < 0 || y < 0 || x >= con.width || y >= con.height) {
        return 0;
    }
    var charCode = con.getCell(x, y).charCode;
    if (charCode < 0xB3 || charCode > 0xDA) {
        return 0;
    }
    return BOX_CHAR_DETAILS[charCode - 0xB3][index];
}
function getBoxCell(up, right, down, left) {
    for (var i = 0; i < BOX_CHAR_DETAILS.length; i++) {
        var row = BOX_CHAR_DETAILS[i];
        if (row[0] === up && row[1] === right && row[2] === down && row[3] === left) {
            return 0xB3 + i;
        }
    }
    return 0;
}
function fixBoxCells(con) {
    for (var y = 0; y < con.height; y++) {
        for (var x = 0; x < con.width; x++) {
            if (isBoxCell(con, x, y)) {
                var up = getBoxCount(con, x, y - 1, 2);
                var right = getBoxCount(con, x + 1, y, 3);
                var down = getBoxCount(con, x, y + 1, 0);
                var left = getBoxCount(con, x - 1, y, 1);
                // There are no single-direction stubs.
                // If we need one, then we create a full vertical or horizontal pipe.
                if (up > 0 && right === 0 && down === 0 && left === 0) {
                    down = up;
                }
                else if (up === 0 && right > 0 && down === 0 && left === 0) {
                    left = right;
                }
                else if (up === 0 && right === 0 && down > 0 && left === 0) {
                    up = down;
                }
                else if (up === 0 && right === 0 && down === 0 && left > 0) {
                    right = left;
                }
                // Vertical and horizontal axis must have same width.
                if (left > 0 && right > 0) {
                    left = right = Math.max(left, right);
                }
                if (up > 0 && down > 0) {
                    up = down = Math.max(up, down);
                }
                var charCode = getBoxCell(up, right, down, left);
                if ((up || right || down || left) && !(charCode >= 0xB3 && charCode <= 0xDA)) {
                    throw new Error('invalid char code! (up=' + up + ', right=' + right + ', down=' + down + ', left=' + left + ')');
                }
                con.getCell(x, y).setCharCode(charCode);
            }
        }
    }
}
exports.fixBoxCells = fixBoxCells;
