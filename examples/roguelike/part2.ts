import { Color } from '../../src/color';
import { Colors } from '../../src/colors';
import { Console } from '../../src/console';
import { fromRgb } from '../../src/color';
import { Keys } from '../../src/keys';
import { Terminal } from '../../src/terminal';


// Actual size of the window
const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 45;

// Size of the map
const MAP_WIDTH = 80;
const MAP_HEIGHT = 45;

const COLOR_DARK_WALL = fromRgb(0, 0, 100);
const COLOR_DARK_GROUND = fromRgb(50, 50, 150);

class Entity {
    x: number;
    y: number;
    char: string;
    color: Color;

    constructor(x: number, y: number, char: string, color: Color) {
        this.x = x;
        this.y = y;
        this.char = char;
        this.color = color;
    }

    move(dx: number, dy: number) {
        if (map.grid[this.y + dy][this.x + dx].blocked) {
            return;
        }
        this.x += dx;
        this.y += dy;
    }

    draw() {
        term.drawString(this.x, this.y, this.char, this.color);
    }
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
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            let wall = map.grid[y][x].blockedSight;
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

const term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, SCREEN_WIDTH, SCREEN_HEIGHT);
const player = new Entity(40, 25, '@', Colors.WHITE);
const npc = new Entity(40, 20, '@', Colors.YELLOW);
const entities = [player, npc];
const map = new Console(MAP_WIDTH, MAP_HEIGHT);

map.grid[22][30].blocked = true;
map.grid[22][30].blockedSight = true;
map.grid[22][50].blocked = true;
map.grid[22][50].blockedSight = true;

term.update = function () {
    handleKeys();
    renderAll();
};
