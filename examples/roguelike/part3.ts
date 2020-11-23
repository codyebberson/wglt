
import { Color } from '../../src/color';
import { Colors } from '../../src/colors';
import { Console } from '../../src/console';
import { fromRgb } from '../../src/color';
import { Keys } from '../../src/keys';
import { Rect } from '../../src/rect';
import { RNG } from '../../src/rng';
import { Terminal } from '../../src/terminal';


// Actual size of the window
const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 45;

// Size of the map
const MAP_WIDTH = 80;
const MAP_HEIGHT = 45;

// Parameters for dungeon generator
const ROOM_MAX_SIZE = 10;
const ROOM_MIN_SIZE = 6;
const MAX_ROOMS = 30;

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

function createRoom(map: Console, room: Rect) {
    for (let y = room.y + 1; y < room.y2; y++) {
        for (let x = room.x + 1; x < room.x2; x++) {
            map.grid[y][x].blocked = false;
            map.grid[y][x].blockedSight = false;
        }
    }
}

function createHTunnel(map: Console, x1: number, x2: number, y: number) {
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
        map.grid[y][x].blocked = false;
        map.grid[y][x].blockedSight = false;
    }
}

function createVTunnel(map: Console, y1: number, y2: number, x: number) {
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        map.grid[y][x].blocked = false;
        map.grid[y][x].blockedSight = false;
    }
}

function createMap() {
    const map = new Console(MAP_WIDTH, MAP_HEIGHT);
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            map.grid[y][x].blocked = true;
            map.grid[y][x].blockedSight = true;
        }
    }

    const rooms = [];

    for (let r = 0; r < MAX_ROOMS; r++) {
        // Random width and height
        const w = rng.nextRange(ROOM_MIN_SIZE, ROOM_MAX_SIZE);
        const h = rng.nextRange(ROOM_MIN_SIZE, ROOM_MAX_SIZE);

        // Random position without going out of the boundaries of the map
        const x = rng.nextRange(0, MAP_WIDTH - w - 1);
        const y = rng.nextRange(0, MAP_HEIGHT - h - 1);

        // "Rect" class makes rectangles easier to work with
        const newRoom = new Rect(x, y, w, h);

        // Run through the other rooms and see if they intersect with this one
        let failed = false;
        for (let j = 0; j < rooms.length; j++) {
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
            const center = newRoom.getCenter();

            if (rooms.length === 0) {
                // This is the first room, where the player starts at
                player.x = center.x;
                player.y = center.y;
            } else {
                // All rooms after the first:
                // Connect it to the previous room with a tunnel

                // Center coordinates of previous room
                const prev = rooms[rooms.length - 1].getCenter();

                // Draw a coin (random number that is either 0 or 1)
                if (rng.nextRange(0, 1) === 1) {
                    // First move horizontally, then vertically
                    createHTunnel(map, prev.x, center.x, prev.y);
                    createVTunnel(map, prev.y, center.y, center.x);
                } else {
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
const rng = new RNG(1);
const player = new Entity(40, 25, '@', Colors.WHITE);
const npc = new Entity(40, 20, '@', Colors.YELLOW);
const entities = [player, npc];
const map = createMap();

term.update = function () {
    handleKeys();
    renderAll();
};