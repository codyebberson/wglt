"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var terminal_1 = require("../src/terminal");
var rng_1 = require("../src/rng");
var color_1 = require("../src/color");
var WIDTH = 80;
var HEIGHT = 45;
var term = new terminal_1.Terminal(document.querySelector('canvas'), WIDTH, HEIGHT, { frameRate: 60 });
var rng = new rng_1.RNG();
var randomComp = function () { return rng.nextRange(0, 255); };
var randomColor = function () { return color_1.fromRgb(randomComp(), randomComp(), randomComp()); };
term.update = function () {
    for (var y = 0; y < HEIGHT; y++) {
        for (var x = 0; x < WIDTH; x++) {
            term.drawChar(x, y, randomComp(), randomColor(), randomColor());
        }
    }
};
