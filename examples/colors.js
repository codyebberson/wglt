"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("../src/color");
var terminal_1 = require("../src/terminal");
var WIDTH = 80;
var HEIGHT = 45;
var term = new terminal_1.Terminal(document.querySelector('canvas'), WIDTH, HEIGHT);
var hue = 0;
term.update = function () {
    for (var y = 0; y < HEIGHT; y++) {
        for (var x = 0; x < WIDTH; x++) {
            var sat = x / WIDTH;
            var val = 1.0 - (y / HEIGHT);
            term.drawChar(x, y, 0, 0, color_1.fromHsv(hue, sat, val));
        }
    }
    hue += 0.001;
};
