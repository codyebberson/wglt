"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var colors_1 = require("../src/colors");
var color_1 = require("../src/color");
var rng_1 = require("../src/rng");
var terminal_1 = require("../src/terminal");
var w = 80;
var h = 45;
var rain = new Array(h);
for (var y = 0; y < h; y++) {
    rain[y] = new Array(w);
    for (var x = 0; x < w; x++) {
        rain[y][x] = 0;
    }
}
var term = new terminal_1.Terminal(document.querySelector('canvas'), w, h);
var rng = new rng_1.RNG();
term.update = function () {
    // Update bottom rows
    for (var y = h - 1; y >= 1; y--) {
        for (var x = 0; x < w; x++) {
            // Move rain down
            rain[y][x] = rain[y - 1][x];
            if (rain[y][x] === 255) {
                // Head of streak, new character
                term.drawChar(x, y, rng.nextRange(0, 255));
            }
        }
    }
    // Update the top row
    for (var x = 0; x < w; x++) {
        if (rng.nextFloat() > 0.99) {
            // 1% chance to start a new row
            rain[0][x] = 255;
            term.drawChar(x, 0, rng.nextRange(0, 255));
        }
        else {
            // Otherwise cooldown
            rain[0][x] = Math.max(0, rain[0][x] - 8);
        }
    }
    // Draw the rain to the screen
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            var color = rain[y][x] === 255 ?
                colors_1.Colors.WHITE :
                color_1.fromRgb(0, rain[y][x], 0);
            term.getCell(x, y).setForeground(color);
        }
    }
};
