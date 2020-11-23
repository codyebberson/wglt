"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("../src/color");
var font_1 = require("../src/font");
var keys_1 = require("../src/keys");
var terminal_1 = require("../src/terminal");
var term = new terminal_1.Terminal(document.querySelector('canvas'), 20, 15, { font: new font_1.Font('graphics.png', 16, 16, 2.0, true) });
var TILE_EMPTY = color_1.fromRgb(15, 15, 0);
var TILE_WALL = color_1.fromRgb(1, 0, 0);
var TILE_GROUND = color_1.fromRgb(2, 0, 0);
var MAP = [
    '    ########        ',
    '  ###......#        ',
    '  #........#        ',
    '  #......#.#        ',
    '  #......#.#        ',
    '  ###..###.#        ',
    '    #......#########',
    '#####..............#',
    '#..................#',
    '#..................#',
    '#..................#',
    '#..................#',
    '#..................#',
    '#####..............#',
    '    ################',
];
var x = 4;
var y = 4;
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
    for (var ty = 0; ty < MAP.length; ty++) {
        for (var tx = 0; tx < MAP[ty].length; tx++) {
            var tileChar = MAP[ty].charAt(tx);
            var tile = TILE_EMPTY;
            if (tileChar === '#') {
                tile = TILE_WALL;
            }
            else if (tileChar === '.') {
                tile = TILE_GROUND;
            }
            term.getCell(tx, ty).setBackground(tile);
        }
    }
    term.drawChar(10, 10, 4);
    term.drawChar(12, 10, 5);
    term.drawChar(14, 10, 6);
    term.drawChar(16, 10, 7);
    term.drawChar(x, y, 3);
};
