"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var colors_1 = require("../src/colors");
var image_1 = require("../src/image");
var keys_1 = require("../src/keys");
var terminal_1 = require("../src/terminal");
var term = new terminal_1.Terminal(document.querySelector('canvas'), 80, 45);
term.fillRect(0, 0, 80, 45, 0, colors_1.Colors.YELLOW, colors_1.Colors.DARK_BLUE);
var x = 10;
var y = 10;
var img = null;
image_1.loadImage2x('starry2x.png', function (result) { return img = result; });
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
    if (img) {
        term.drawConsole(0, 0, img, 0, 0, 80, 45);
    }
    term.drawString(1, 1, 'Hello world!', colors_1.Colors.WHITE);
    term.drawString(1, 3, 'Use arrow keys to move', colors_1.Colors.WHITE);
    term.drawString(x, y, '@', colors_1.Colors.WHITE);
};
