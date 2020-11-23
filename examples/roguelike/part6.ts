
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
const MAX_ROOM_MONSTERS = 3;
const TORCH_RADIUS = 10;

const COLOR_DARK_WALL = fromRgb(0, 0, 100);
const COLOR_LIGHT_WALL = fromRgb(130, 110, 50);
const COLOR_DARK_GROUND = fromRgb(50, 50, 150);
const COLOR_LIGHT_GROUND = fromRgb(200, 180, 50);

class Entity {
    x: number;
    y: number;
    char: string;
    name: string;
    color: Color;
    blocks: boolean;
    fighter?: Fighter;
    ai?: BasicMonster;

    constructor(x: number, y: number, char: string, name: string, color: Color, blocks: boolean, components?: any) {
        this.x = x;
        this.y = y;
        this.char = char;
        this.name = name;
        this.color = color;
        this.blocks = !!blocks;

        if (components) {
            if ('fighter' in components) {
                this.fighter = components.fighter;
                (this.fighter as Fighter).owner = this;
            }
            if ('ai' in components) {
                this.ai = components.ai;
                (this.ai as BasicMonster).owner = this;
            }
        }
    }

    move(dx: number, dy: number) {
        if (isBlocked(this.x + dx, this.y + dy)) {
            return;
        }
        this.x += dx;
        this.y += dy;
    }

    moveToward(targetX: number, targetY: number) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.hypot(dx, dy);
        this.move(Math.round(dx / distance), Math.round(dy / distance));
    }

    distanceTo(other: Entity) {
        return Math.hypot(other.x - this.x, other.y - this.y);
    }

    sendToBack() {
        this.remove();
        entities.unshift(this);
    }

    remove() {
        entities.splice(entities.indexOf(this), 1);
    }

    draw() {
        if (map.isVisible(this.x, this.y)) {
            term.drawString(this.x, this.y, this.char, this.color);
        }
    }
}

class Fighter {
    owner?: Entity;
    maxHp: number;
    defense: number;
    power: number;
    hp: number;
    deathFunction?: (e: Entity) => void;

    constructor(hp: number, defense: number, power: number, deathFunction?: (e: Entity) => void) {
        this.owner = undefined;
        this.maxHp = hp;
        this.defense = defense;
        this.power = power;
        this.hp = hp;
        this.deathFunction = deathFunction;
    }

    attack(target: Entity) {
        if (!this.owner || !target.fighter) {
            return;
        }

        const damage = this.power - target.fighter.defense;

        if (damage > 0) {
            console.log(this.owner.name + ' attacks ' + target.name + ' for ' + damage + ' hit points.');
            target.fighter.takeDamage(damage);
        } else {
            console.log(this.owner.name + ' attacks ' + target.name + ' but it has no effect!');
        }
    }

    takeDamage(damage: number) {
        if (!this.owner) {
            return;
        }

        this.hp -= damage;

        // Check for death. if there's a death function, call it
        if (this.hp <= 0) {
            this.hp = 0;
            if (this.deathFunction) {
                this.deathFunction(this.owner);
            }
        }
    }
}

class BasicMonster {
    owner?: Entity;

    constructor() {
        this.owner = undefined;
    }

    takeTurn() {
        if (!player.fighter) {
            return;
        }

        const monster = this.owner;
        if (!monster || !monster.fighter) {
            return;
        }

        // A basic monster takes its turn. if you can see it, it can see you
        if (map.isVisible(monster.x, monster.y)) {

            if (monster.distanceTo(player) >= 2) {
                // Move towards player if far away
                monster.moveToward(player.x, player.y);

            } else if (player.fighter.hp > 0) {
                // Close enough, attack! (if the player is still alive.)
                monster.fighter.attack(player);
            }
        }
    }
}

function isBlocked(x: number, y: number) {
    // First test the map tile
    if (map.grid[y][x].blocked) {
        return true;
    }

    // Now check for any blocking objects
    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        if (entity.blocks && entity.x === x && entity.y === y) {
            return true;
        }
    }

    return false;
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

            // Add some contents to this room, such as monsters
            placeObjects(newRoom);

            // Finally, append the new room to the list
            rooms.push(newRoom);
        }
    }

    return map;
}

function placeObjects(room: Rect) {
    // Choose random number of monsters
    const numMonsters = rng.nextRange(0, MAX_ROOM_MONSTERS);

    for (let i = 0; i < numMonsters; i++) {
        // Choose random spot for this monster
        const x = rng.nextRange(room.x + 1, room.x2 - 1);
        const y = rng.nextRange(room.y + 1, room.y2 - 1);
        let monster = null;

        // Only place it if the tile is not blocked
        // 80% chance of getting an orc
        if (rng.nextRange(0, 100) < 80) {
            // Create an orc
            const fighter = new Fighter(10, 0, 3, monsterDeath);
            const ai = new BasicMonster();
            monster = new Entity(x, y, 'o', 'orc', Colors.LIGHT_GREEN, true, { fighter: fighter, ai: ai });
        } else {
            // Create a troll
            const fighter = new Fighter(16, 1, 4, monsterDeath);
            const ai = new BasicMonster();
            monster = new Entity(x, y, 'T', 'troll', Colors.DARK_GREEN, true, { fighter: fighter, ai: ai });
        }

        entities.push(monster);
    }
}

function playerMoveOrAttack(dx: number, dy: number) {
    const x = player.x + dx;
    const y = player.y + dy;

    let target = null;
    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        if (entity.fighter && entity.x === x && entity.y === y) {
            target = entity;
            break;
        }
    }

    if (target) {
        (player.fighter as Fighter).attack(target);
    } else {
        player.move(dx, dy);
        fovRecompute = true;
    }

    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        if (entity.ai) {
            entity.ai.takeTurn();
        }
    }
}

function handleKeys() {
    if (!player.fighter || player.fighter.hp <= 0) {
        return;
    }
    if (term.isKeyPressed(Keys.VK_UP)) {
        playerMoveOrAttack(0, -1);
    }
    if (term.isKeyPressed(Keys.VK_LEFT)) {
        playerMoveOrAttack(-1, 0);
    }
    if (term.isKeyPressed(Keys.VK_RIGHT)) {
        playerMoveOrAttack(1, 0);
    }
    if (term.isKeyPressed(Keys.VK_DOWN)) {
        playerMoveOrAttack(0, 1);
    }
}

function playerDeath(player: Entity) {
    console.log('You died!');
}

function monsterDeath(monster: Entity) {
    console.log(monster.name + ' is dead');
    monster.char = '%';
    monster.color = Colors.DARK_RED;
    monster.blocks = false;
    monster.fighter = undefined;
    monster.ai = undefined;
    monster.name = 'remains of ' + monster.name;
    monster.sendToBack();
}

function renderAll() {
    if (fovRecompute) {
        map.computeFov(player.x, player.y, TORCH_RADIUS);
        fovRecompute = false;
    }

    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const visible = map.isVisible(x, y);
            const wall = map.grid[y][x].blockedSight;
            let color = Colors.BLACK;

            if (visible) {
                // It's visible
                color = wall ? COLOR_LIGHT_WALL : COLOR_LIGHT_GROUND;
                map.grid[y][x].explored = true;
            } else if (map.grid[y][x].explored) {
                // It's remembered
                color = wall ? COLOR_DARK_WALL : COLOR_DARK_GROUND;
            }

            term.drawChar(x, y, 0, 0, color);
        }
    }

    for (let i = 0; i < entities.length; i++) {
        entities[i].draw();
    }
}

const term = new Terminal(document.querySelector('canvas') as HTMLCanvasElement, SCREEN_WIDTH, SCREEN_HEIGHT);
const rng = new RNG(1);
const player = new Entity(40, 25, '@', 'player', Colors.WHITE, true, { fighter: new Fighter(20, 2, 5, playerDeath) });
const entities = [player];
const map = createMap();
let fovRecompute = true;

term.update = function () {
    handleKeys();
    renderAll();
};
