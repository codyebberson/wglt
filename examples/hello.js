"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var terminal_1 = require("../src/terminal");
var colors_1 = require("../src/colors");
var keys_1 = require("../src/keys");
var term = new terminal_1.Terminal(document.querySelector('canvas'), 80, 45);
term.fillRect(0, 0, 80, 45, 0, colors_1.Colors.YELLOW, colors_1.Colors.DARK_BLUE);
var x = 10;
var y = 10;
term.update = function () {
    if (term.isKeyPressed(keys_1.Keys.VK_UP)) {
        y--;
    }
    if (term.isKeyPressed(keys_1.Keys.VK_LEFT)) {
        x--;
    }
    if (term.isKeyPressed(keys_1.Keys.VK_RIGHT)) {
        x++;
    }
    if (term.isKeyPressed(keys_1.Keys.VK_DOWN)) {
        y++;
    }
    term.clear();
    term.drawString(1, 1, 'Hello world!');
    term.drawString(1, 3, 'Use arrow keys to move');
    term.drawString(x, y, '@');
};
