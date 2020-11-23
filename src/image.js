"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadImage2x = exports.loadImage = void 0;
var chars_1 = require("./chars");
var color_1 = require("./color");
var console_1 = require("./console");
/**
 * All available 2x2 patterns for 2x image loading.
 * Note: The strict IBM CGA font only has halves, not quadrants.
 */
var PATTERNS = [
    { charCode: chars_1.Chars.BLOCK_TOP_HALF, active: [1, 1, 0, 0] },
    { charCode: chars_1.Chars.BLOCK_RIGHT_HALF, active: [0, 1, 0, 1] },
];
function loadImage(url, callback) {
    var img = new Image();
    img.onload = function () {
        var w = img.width;
        var h = img.height;
        var data = getImageData(img);
        var result = new console_1.Console(w, h);
        var i = 0;
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                var cell = result.getCell(x, y);
                cell.setBackground(color_1.fromRgb(data[i++], data[i++], data[i++], data[i++]));
            }
        }
        callback(result);
    };
    img.src = url;
}
exports.loadImage = loadImage;
function loadImage2x(url, callback) {
    var img = new Image();
    img.onload = function () {
        var w = img.width;
        var h = img.height;
        var data = getImageData(img);
        var result = new console_1.Console(w / 2, h / 2);
        for (var y = 0; y < h; y += 2) {
            for (var x = 0; x < w; x += 2) {
                draw2x2(result, data, x, y, w);
            }
        }
        callback(result);
    };
    img.src = url;
}
exports.loadImage2x = loadImage2x;
function getImageData(img) {
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, img.width, img.height).data;
}
function draw2x2(con, data, x, y, w) {
    // Top left
    var i1 = 4 * (y * w + x);
    var r1 = data[i1];
    var g1 = data[i1 + 1];
    var b1 = data[i1 + 2];
    // Top right
    var i2 = 4 * (y * w + x + 1);
    var r2 = data[i2];
    var g2 = data[i2 + 1];
    var b2 = data[i2 + 2];
    // Bottom left
    var i3 = 4 * ((y + 1) * w + x);
    var r3 = data[i3];
    var g3 = data[i3 + 1];
    var b3 = data[i3 + 2];
    // Bottom right
    var i4 = 4 * ((y + 1) * w + x + 1);
    var r4 = data[i4];
    var g4 = data[i4 + 1];
    var b4 = data[i4 + 2];
    var colors = [[r1, g1, b1], [r2, g2, b2], [r3, g3, b3], [r4, g4, b4]];
    // For each possible pattern, calculate the total error
    // Find the pattern with minum error
    var minError = Number.MAX_VALUE;
    var bestCharCode = 0;
    var bestBg = null;
    var bestFg = null;
    for (var i = 0; i < PATTERNS.length; i++) {
        var pattern = PATTERNS[i];
        var patternColors = computeColors(pattern.active, colors);
        if (patternColors.error < minError) {
            minError = patternColors.error;
            bestCharCode = pattern.charCode;
            bestBg = patternColors.bg;
            bestFg = patternColors.fg;
        }
    }
    con.drawChar(x / 2, y / 2, bestCharCode, arrayToColor(bestFg), arrayToColor(bestBg));
}
function computeColors(pattern, colors) {
    var sum = [[0, 0, 0], [0, 0, 0]];
    var avg = [[0, 0, 0], [0, 0, 0]];
    var count = [0, 0];
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 3; j++) {
            sum[pattern[i]][j] += colors[i][j];
        }
        count[pattern[i]]++;
    }
    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 3; j++) {
            avg[i][j] = sum[i][j] / count[i];
        }
    }
    var error = 0.0;
    for (var i = 0; i < 4; i++) {
        var cellError = 0.0;
        for (var j = 0; j < 3; j++) {
            var delta = colors[i][j] - avg[pattern[i]][j];
            cellError += delta * delta;
        }
        error += Math.sqrt(cellError);
    }
    return { bg: avg[0], fg: avg[1], error: error };
}
function arrayToColor(rgb) {
    return color_1.fromRgb(rgb[0], rgb[1], rgb[2]);
}
