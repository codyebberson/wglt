
import {Terminal} from '../../src/terminal.js';
import {Colors} from '../../src/colors.js';
import {Keys} from '../../src/keys.js';
import {fromRgb} from '../../src/color.js';

// Actual size of the window
const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 50;

// Size of the map
const MAP_WIDTH = 80;
const MAP_HEIGHT = 45;

const COLOR_DARK_WALL = fromRgb(0, 0, 100);
const COLOR_DARK_GROUND = fromRgb(50, 50, 150);

function Tile(blocked) {
    this.blocked = blocked;
    this.blockSight = blocked;
}

function Entity(x, y, char, color) {
    this.x = x;
    this.y = y;
    this.char = char;
    this.color = color;

    this.move = function (dx, dy) {
        if (map[this.y + dy][this.x + dx].blocked) {
            return;
        }
        this.x += dx;
        this.y += dy;
    };

    this.draw = function () {
        term.drawString(this.x, this.y, this.char, this.color);
    };
}

function createMap() {
    const map = new Array(MAP_HEIGHT);
    for (let y = 0; y < MAP_HEIGHT; y++) {
        map[y] = new Array(MAP_WIDTH);
        for (let x = 0; x < MAP_WIDTH; x++) {
            map[y][x] = new Tile(false);
        }
    }
    return map;
}

function handleKeys() {
    if (term.isKeyPressed(Keys.VK_UP)) {
        player.move(0, -1);
    }
    if (term.isKeyPressed(Keys.VK_LEFT)) {
        player.move(-1, 0);
    }
    if (term.isKeyPressed(Keys.VK_RIGHT)) {
        player.move(1, 0);
    }
    if (term.isKeyPressed(Keys.VK_DOWN)) {
        player.move(0, 1);
    }
}

function renderAll() {
    term.clear();

    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            let wall = map[y][x].blockSight;
            if (wall) {
                term.drawChar(x, y, 0, 0, COLOR_DARK_WALL);
            } else {
                term.drawChar(x, y, 0, 0, COLOR_DARK_GROUND);
            }
        }
    }

    for (let i = 0; i < entities.length; i++) {
        entities[i].draw();
    }
}

const term = new Terminal(document.querySelector('canvas'), SCREEN_WIDTH, SCREEN_HEIGHT);
const player = new Entity(40, 25, '@', Colors.WHITE);
const npc = new Entity(40, 20, '@', Colors.YELLOW);
const entities = [player, npc];
const map = createMap();

map[22][30].blocked = true;
map[22][30].blockSight = true;
map[22][50].blocked = true;
map[22][50].blockSight = true;

term.update = function () {
    handleKeys();
    renderAll();
};
