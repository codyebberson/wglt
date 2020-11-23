"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var colors_1 = require("../../src/colors");
var keys_1 = require("../../src/keys");
var terminal_1 = require("../../src/terminal");
// Actual size of the window
var SCREEN_WIDTH = 80;
var SCREEN_HEIGHT = 45;
function handleKeys() {
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
}
function renderAll() {
    term.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 0, colors_1.Colors.YELLOW, colors_1.Colors.DARK_BLUE);
    term.drawString(1, 1, 'Hello world!');
    term.drawString(1, 3, 'Use arrow keys to move');
    term.drawString(x, y, '@');
}
var term = new terminal_1.Terminal(document.querySelector('canvas'), SCREEN_WIDTH, SCREEN_HEIGHT);
var x = 10;
var y = 10;
term.update = function () {
    handleKeys();
    renderAll();
};
