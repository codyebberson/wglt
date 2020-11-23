"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var colors_1 = require("../../src/colors");
var console_1 = require("../../src/console");
var color_1 = require("../../src/color");
var keys_1 = require("../../src/keys");
var rect_1 = require("../../src/rect");
var rng_1 = require("../../src/rng");
var terminal_1 = require("../../src/terminal");
// Actual size of the window
var SCREEN_WIDTH = 80;
var SCREEN_HEIGHT = 45;
// Size of the map
var MAP_WIDTH = 80;
var MAP_HEIGHT = 45;
// Parameters for dungeon generator
var ROOM_MAX_SIZE = 10;
var ROOM_MIN_SIZE = 6;
var MAX_ROOMS = 30;
var TORCH_RADIUS = 10;
var COLOR_DARK_WALL = color_1.fromRgb(0, 0, 100);
var COLOR_LIGHT_WALL = color_1.fromRgb(130, 110, 50);
var COLOR_DARK_GROUND = color_1.fromRgb(50, 50, 150);
var COLOR_LIGHT_GROUND = color_1.fromRgb(200, 180, 50);
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
        if (map.isVisible(this.x, this.y)) {
            term.drawString(this.x, this.y, this.char, this.color);
        }
    };
    return Entity;
}());
function createRoom(map, room) {
    for (var y = room.y + 1; y < room.y2; y++) {
        for (var x = room.x + 1; x < room.x2; x++) {
            map.grid[y][x].blocked = false;
            map.grid[y][x].blockedSight = false;
        }
    }
}
function createHTunnel(map, x1, x2, y) {
    for (var x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
        map.grid[y][x].blocked = false;
        map.grid[y][x].blockedSight = false;
    }
}
function createVTunnel(map, y1, y2, x) {
    for (var y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        map.grid[y][x].blocked = false;
        map.grid[y][x].blockedSight = false;
    }
}
function createMap() {
    var map = new console_1.Console(MAP_WIDTH, MAP_HEIGHT);
    for (var y = 0; y < MAP_HEIGHT; y++) {
        for (var x = 0; x < MAP_WIDTH; x++) {
            map.grid[y][x].blocked = true;
            map.grid[y][x].blockedSight = true;
        }
    }
    var rooms = [];
    for (var r = 0; r < MAX_ROOMS; r++) {
        // Random width and height
        var w = rng.nextRange(ROOM_MIN_SIZE, ROOM_MAX_SIZE);
        var h = rng.nextRange(ROOM_MIN_SIZE, ROOM_MAX_SIZE);
        // Random position without going out of the boundaries of the map
        var x = rng.nextRange(0, MAP_WIDTH - w - 1);
        var y = rng.nextRange(0, MAP_HEIGHT - h - 1);
        // "Rect" class makes rectangles easier to work with
        var newRoom = new rect_1.Rect(x, y, w, h);
        // Run through the other rooms and see if they intersect with this one
        var failed = false;
        for (var j = 0; j < rooms.length; j++) {
            if (newRoom.intersects(rooms[j])) {
                failed = true;
                break;
            }
        }
        if (!failed) {
            // This means there are no intersections, so this room is valid
            // "paint" it to the map's tiles
            createRoom(map, newRoom);
            // Center coordinates of new room, will be useful later
            var center = newRoom.getCenter();
            if (rooms.length === 0) {
                // This is the first room, where the player starts at
                player.x = center.x;
                player.y = center.y;
            }
            else {
                // All rooms after the first:
                // Connect it to the previous room with a tunnel
                // Center coordinates of previous room
                var prev = rooms[rooms.length - 1].getCenter();
                // Draw a coin (random number that is either 0 or 1)
                if (rng.nextRange(0, 1) === 1) {
                    // First move horizontally, then vertically
                    createHTunnel(map, prev.x, center.x, prev.y);
                    createVTunnel(map, prev.y, center.y, center.x);
                }
                else {
                    // First move vertically, then horizontally
                    createVTunnel(map, prev.y, center.y, prev.x);
                    createHTunnel(map, prev.x, center.x, center.y);
                }
            }
            // Finally, append the new room to the list
            rooms.push(newRoom);
        }
    }
    return map;
}
function handleKeys() {
    if (term.isKeyPressed(keys_1.Keys.VK_UP)) {
        player.move(0, -1);
        fovRecompute = true;
    }
    if (term.isKeyPressed(keys_1.Keys.VK_LEFT)) {
        player.move(-1, 0);
        fovRecompute = true;
    }
    if (term.isKeyPressed(keys_1.Keys.VK_RIGHT)) {
        player.move(1, 0);
        fovRecompute = true;
    }
    if (term.isKeyPressed(keys_1.Keys.VK_DOWN)) {
        player.move(0, 1);
        fovRecompute = true;
    }
}
function renderAll() {
    if (fovRecompute) {
        map.computeFov(player.x, player.y, TORCH_RADIUS);
        fovRecompute = false;
    }
    for (var y = 0; y < MAP_HEIGHT; y++) {
        for (var x = 0; x < MAP_WIDTH; x++) {
            var visible = map.isVisible(x, y);
            var wall = map.grid[y][x].blockedSight;
            var color = colors_1.Colors.BLACK;
            if (visible) {
                // It's visible
                color = wall ? COLOR_LIGHT_WALL : COLOR_LIGHT_GROUND;
                map.grid[y][x].explored = true;
            }
            else if (map.grid[y][x].explored) {
                // It's remembered
                color = wall ? COLOR_DARK_WALL : COLOR_DARK_GROUND;
            }
            term.drawChar(x, y, 0, 0, color);
        }
    }
    for (var i = 0; i < entities.length; i++) {
        entities[i].draw();
    }
}
var term = new terminal_1.Terminal(document.querySelector('canvas'), SCREEN_WIDTH, SCREEN_HEIGHT);
var rng = new rng_1.RNG(1);
var player = new Entity(40, 25, '@', colors_1.Colors.WHITE);
var npc = new Entity(40, 20, '@', colors_1.Colors.YELLOW);
var entities = [player, npc];
var map = createMap();
var fovRecompute = true;
term.update = function () {
    handleKeys();
    renderAll();
};
