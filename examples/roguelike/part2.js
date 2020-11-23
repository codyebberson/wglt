"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var colors_1 = require("../../src/colors");
var console_1 = require("../../src/console");
var color_1 = require("../../src/color");
var keys_1 = require("../../src/keys");
var terminal_1 = require("../../src/terminal");
// Actual size of the window
var SCREEN_WIDTH = 80;
var SCREEN_HEIGHT = 45;
// Size of the map
var MAP_WIDTH = 80;
var MAP_HEIGHT = 45;
var COLOR_DARK_WALL = color_1.fromRgb(0, 0, 100);
var COLOR_DARK_GROUND = color_1.fromRgb(50, 50, 150);
var Entity = /** @class */ (function () {
    function Entity(x, y, char, color) {
        this.x = x;
        this.y = y;
        this.char = char;
        this.color = color;
    }
    Entity.prototype.move = function (dx, dy) {
        if (map.grid[this.y + dy][this.x + dx].blocked) {
            return;
        }
        this.x += dx;
        this.y += dy;
    };
    Entity.prototype.draw = function () {
        term.drawString(this.x, this.y, this.char, this.color);
    };
    return Entity;
}());
function handleKeys() {
    if (term.isKeyPressed(keys_1.Keys.VK_UP)) {
        player.move(0, -1);
    }
    if (term.isKeyPressed(keys_1.Keys.VK_LEFT)) {
        player.move(-1, 0);
    }
    if (term.isKeyPressed(keys_1.Keys.VK_RIGHT)) {
        player.move(1, 0);
    }
    if (term.isKeyPressed(keys_1.Keys.VK_DOWN)) {
        player.move(0, 1);
    }
}
function renderAll() {
    for (var y = 0; y < MAP_HEIGHT; y++) {
        for (var x = 0; x < MAP_WIDTH; x++) {
            var wall = map.grid[y][x].blockedSight;
            if (wall) {
                term.drawChar(x, y, 0, 0, COLOR_DARK_WALL);
            }
            else {
                term.drawChar(x, y, 0, 0, COLOR_DARK_GROUND);
            }
        }
    }
    for (var i = 0; i < entities.length; i++) {
        entities[i].draw();
    }
}
var term = new terminal_1.Terminal(document.querySelector('canvas'), SCREEN_WIDTH, SCREEN_HEIGHT);
var player = new Entity(40, 25, '@', colors_1.Colors.WHITE);
var npc = new Entity(40, 20, '@', colors_1.Colors.YELLOW);
var entities = [player, npc];
var map = new console_1.Console(MAP_WIDTH, MAP_HEIGHT);
map.grid[22][30].blocked = true;
map.grid[22][30].blockedSight = true;
map.grid[22][50].blocked = true;
map.grid[22][50].blockedSight = true;
term.update = function () {
    handleKeys();
    renderAll();
};
