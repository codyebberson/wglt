"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var colors_1 = require("../src/colors");
var console_1 = require("../src/console");
var keys_1 = require("../src/keys");
var terminal_1 = require("../src/terminal");
var path_1 = require("../src/path");
var SCREEN_WIDTH = 80;
var SCREEN_HEIGHT = 45;
var MAP = new Array(SCREEN_HEIGHT);
for (var y = 0; y < SCREEN_HEIGHT; y++) {
    MAP[y] = new Array(SCREEN_WIDTH);
    for (var x = 0; x < SCREEN_WIDTH; x++) {
        MAP[y][x] = Math.random() < 0.4 ? '#' : '.';
    }
}
var VIEW_DISTANCE = 15;
function getTile(x, y) {
    return MAP[y][x];
}
function isBlocked(x, y) {
    return getTile(x, y) !== '.';
}
var term = new terminal_1.Terminal(document.querySelector('canvas'), SCREEN_WIDTH, SCREEN_HEIGHT);
var game = new console_1.Console(SCREEN_WIDTH, SCREEN_HEIGHT);
var player = {
    x: Math.floor(SCREEN_WIDTH / 2),
    y: Math.floor(SCREEN_HEIGHT / 2)
};
var fov = new console_1.Console(SCREEN_WIDTH, SCREEN_HEIGHT, isBlocked);
fov.computeFov(player.x, player.y, VIEW_DISTANCE);
function movePlayer(dx, dy) {
    var x = player.x + dx;
    var y = player.y + dy;
    if (x < 0 || x >= SCREEN_WIDTH || y < 0 || y >= SCREEN_HEIGHT || isBlocked(x, y)) {
        return;
    }
    player.x = x;
    player.y = y;
    fov.computeFov(player.x, player.y, VIEW_DISTANCE);
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
    term.clear();
    game.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 0, 0, colors_1.Colors.BLACK);
    for (var y = 0; y < SCREEN_HEIGHT; y++) {
        for (var x = 0; x < SCREEN_WIDTH; x++) {
            var c = getTile(x, y);
            var color = fov.isVisible(x, y) ? colors_1.Colors.WHITE : colors_1.Colors.DARK_GRAY;
            game.drawString(x, y, c, color);
        }
    }
    var path = path_1.computePath(fov, player, term.mouse, 1000);
    if (path) {
        for (var i = 1; i < path.length; i++) {
            var step = path[i];
            var cell = game.getCell(step.x, step.y);
            if (cell) {
                cell.setBackground(colors_1.Colors.DARK_RED);
            }
        }
    }
    game.drawString(player.x, player.y, '@');
    term.drawConsole(0, 0, game, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    term.drawString(1, 1, 'Hello world!', colors_1.Colors.WHITE);
    term.drawString(1, 3, 'Use arrow keys to move', colors_1.Colors.WHITE);
};
