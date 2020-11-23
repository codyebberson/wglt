"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var boxutils_1 = require("../src/boxutils");
var colors_1 = require("../src/colors");
var console_1 = require("../src/console");
var terminal_1 = require("../src/terminal");
var chars_1 = require("../src/chars");
var SCREEN_WIDTH = 80;
var SCREEN_HEIGHT = 45;
var term = new terminal_1.Terminal(document.querySelector('canvas'), SCREEN_WIDTH, SCREEN_HEIGHT);
var game = new console_1.Console(SCREEN_WIDTH, SCREEN_HEIGHT);
for (var y = 0; y < SCREEN_HEIGHT; y++) {
    for (var x = 0; x < SCREEN_WIDTH; x++) {
        if (Math.random() < 0.5) {
            var c = Math.random() < 0.5 ?
                chars_1.Chars.BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL :
                chars_1.Chars.BOX_DOUBLE_VERTICAL_AND_DOUBLE_HORIZONTAL;
            game.getCell(x, y).setValue(c, colors_1.Colors.WHITE, colors_1.Colors.DARK_BLUE);
        }
    }
}
// This will update all box cells in the console such that stems match
boxutils_1.fixBoxCells(game);
term.update = function () {
    term.clear();
    term.drawConsole(0, 0, game, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    term.drawString(1, 1, 'Hello world!', colors_1.Colors.WHITE);
};
