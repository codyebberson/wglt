"use strict";
// Based on: https://lodev.org/cgtutor/fire.html
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("../src/color");
var rng_1 = require("../src/rng");
var terminal_1 = require("../src/terminal");
var w = 80;
var h = 45;
var fire = new Array(h);
for (var y = 0; y < h; y++) {
    fire[y] = new Array(w);
    for (var x = 0; x < w; x++) {
        fire[y][x] = 0;
    }
}
var term = new terminal_1.Terminal(document.querySelector('canvas'), w, h, { requestFullscreen: true });
var rng = new rng_1.RNG();
term.update = function () {
    // Randomize the bottom row
    for (var x = 0; x < w; x++) {
        fire[h - 1][x] = rng.nextRange(64, 255);
    }
    // Do the fire calculations for every cell except bottom row
    for (var y = 0; y < h - 1; y++) {
        for (var x = 0; x < w; x++) {
            fire[y][x] = Math.floor((fire[(y + 1) % h][(x - 1 + w) % w]
                + fire[(y + 1) % h][(x) % w]
                + fire[(y + 1) % h][(x + 1) % w]
                + fire[(y + 2) % h][(x) % w])
                * 0.24);
        }
    }
    // Draw the fire to the screen
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            var t = fire[y][x] / 256.0;
            var c = color_1.fromHsv(t / 6.0, 1.0, Math.min(1.0, t * 2));
            term.drawChar(x, y, 0, 0, c);
        }
    }
};
