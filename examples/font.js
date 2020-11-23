"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var colors_1 = require("../src/colors");
var font_1 = require("../src/font");
var keys_1 = require("../src/keys");
var terminal_1 = require("../src/terminal");
var term = new terminal_1.Terminal(document.querySelector('canvas'), 80, 25, { font: new font_1.Font('terminal8x14_gs_ro.png', 8, 14) });
term.fillRect(0, 0, 80, 25, 0, colors_1.Colors.YELLOW, colors_1.Colors.DARK_BLUE);
var x = 10;
var y = 10;
term.update = function () {
    if (term.isKeyDown(keys_1.Keys.VK_UP)) {
        y--;
    }
    if (term.isKeyDown(keys_1.Keys.VK_LEFT)) {
        x--;
    }
    if (term.isKeyDown(keys_1.Keys.VK_RIGHT)) {
        x++;
    }
    if (term.isKeyDown(keys_1.Keys.VK_DOWN)) {
        y++;
    }
    term.clear();
    term.drawString(1, 1, 'Hello world!');
    term.drawString(1, 3, 'Use arrow keys to move');
    term.drawString(x, y, '@');
};
