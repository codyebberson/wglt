"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var colors_1 = require("../src/colors");
var path_1 = require("../src/path");
var console_1 = require("../src/console");
var keys_1 = require("../src/keys");
var terminal_1 = require("../src/terminal");
var fov_1 = require("../src/fov");
var SCREEN_WIDTH = 80;
var SCREEN_HEIGHT = 45;
var MAP = [
    '    ########        #########        ########    ',
    '    #......#        #.......#        #......#    ',
    '    #......#        #...#...#        #......#    ',
    '    #....#.#        #.#####.#        #......#    ',
    '    #....#.#        #...#...#        #......#    ',
    '    #..###.#        #.......#        #......#    ',
    '    #......##########.......##########......#    ',
    '#####.......................................#####',
    '#...............................................#',
    '#...............................................#',
    '#...............................................#',
    '#...............................................#',
    '#...............................................#',
    '#####.......................................#####',
    '    #......##########.......##########......#    ',
    '    #......#        #.......#        #......#    ',
    '    #......#        #.......#        #......#    ',
    '    #......#        #.......#        #......#    ',
    '    #......#        #.......#        #......#    ',
    '    #......#        #.......#        #......#    ',
    '    #......#        #.......#        #......#    ',
    '    #......#        #.......#        #......#    ',
    '    #......##########.......##########......#    ',
    '#####.......................................#####',
    '#...............................................#',
    '#...............................................#',
    '#...............................................#',
    '#...............................................#',
    '#...............................................#',
    '#####.......................................#####',
    '    #......#############.#############......#    ',
    '    #......#        #..#.#..#        #......#    ',
    '    #..#####        #..#.#..#        #......#    ',
    '    #......#        #..#.#..#        #......#    ',
    '    #####..#        #.......#        #......#    ',
    '    #......#        #.......#        #......#    ',
    '    ########        #########        ########    ',
];
var MAP_WIDTH = MAP[0].length;
var MAP_HEIGHT = MAP.length;
var OFFSET_X = ((SCREEN_WIDTH - MAP_WIDTH) / 2) | 0;
var OFFSET_Y = ((SCREEN_HEIGHT - MAP_HEIGHT) / 2) | 0;
var VIEW_DISTANCE = 15;
function getTile(x, y) {
    return MAP[y].charAt(x);
}
function isBlocked(x, y) {
    return getTile(x, y) !== '.';
}
var term = new terminal_1.Terminal(document.querySelector('canvas'), SCREEN_WIDTH, SCREEN_HEIGHT);
var game = new console_1.Console(MAP_WIDTH, MAP_HEIGHT);
var player = {
    x: Math.floor(MAP_WIDTH / 2),
    y: Math.floor(MAP_HEIGHT / 2),
    direction: fov_1.FovQuadrants.QUADRANT_NORTH,
    path: null,
    pathIndex: 0
};
var tileMap = new console_1.Console(MAP_WIDTH, MAP_HEIGHT, isBlocked);
function computeFov() {
    tileMap.computeFov(player.x, player.y, VIEW_DISTANCE, false, player.direction);
    tileMap.updateExplored();
}
function movePlayer(dx, dy) {
    var x = player.x + dx;
    var y = player.y + dy;
    if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT || isBlocked(x, y)) {
        return;
    }
    player.x = x;
    player.y = y;
    player.direction = fov_1.getFovQuadrant(dx, dy);
    computeFov();
}
term.update = function () {
    if (term.isKeyPressed(keys_1.Keys.VK_UP)) {
        movePlayer(0, -1);
    }
    if (term.isKeyPressed(keys_1.Keys.VK_LEFT)) {
        movePlayer(-1, 0);
    }
    if (term.isKeyPressed(keys_1.Keys.VK_RIGHT)) {
        movePlayer(1, 0);
    }
    if (term.isKeyPressed(keys_1.Keys.VK_DOWN)) {
        movePlayer(0, 1);
    }
    if (player.path) {
        while (player.pathIndex < player.path.length &&
            player.x === player.path[player.pathIndex].x &&
            player.y === player.path[player.pathIndex].y) {
            player.pathIndex++;
        }
        if (player.pathIndex < player.path.length) {
            movePlayer(player.path[player.pathIndex].x - player.x, player.path[player.pathIndex].y - player.y);
        }
    }
    term.clear();
    game.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT, 0, 0, colors_1.Colors.BLACK);
    for (var y = 0; y < MAP_HEIGHT; y++) {
        for (var x = 0; x < MAP_WIDTH; x++) {
            var c = tileMap.getCell(x, y);
            if (c && c.explored) {
                var color = tileMap.isVisible(x, y) ? colors_1.Colors.WHITE : colors_1.Colors.DARK_GRAY;
                game.drawString(x, y, getTile(x, y), color);
            }
        }
    }
    var dest = { x: term.mouse.x - OFFSET_X, y: term.mouse.y - OFFSET_Y };
    var path = path_1.computePath(tileMap, player, dest, 1000);
    if (path) {
        for (var i = 1; i < path.length; i++) {
            var step = path[i];
            var cell = game.getCell(step.x, step.y);
            if (cell) {
                cell.setBackground(colors_1.Colors.DARK_RED);
            }
        }
        if (term.mouse.buttons[0].upCount === 1) {
            player.path = path;
            player.pathIndex = 0;
        }
    }
    term.drawString(1, 1, 'Hello world!');
    term.drawString(1, 3, 'Use arrow keys to move');
    game.drawString(player.x, player.y, '@');
    term.drawConsole(OFFSET_X, OFFSET_Y, game, 0, 0, MAP_WIDTH, MAP_HEIGHT);
};
computeFov();
