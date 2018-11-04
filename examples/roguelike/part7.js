
// Actual size of the window
const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 50;

// Size of the map
const MAP_WIDTH = 80;
const MAP_HEIGHT = 45;

// Sizes and coordinates relevant for the GUI
const BAR_WIDTH = 20;
const PANEL_HEIGHT = 7;
const PANEL_Y = SCREEN_HEIGHT - PANEL_HEIGHT;
const MSG_X = BAR_WIDTH + 2;
const MSG_WIDTH = SCREEN_WIDTH - BAR_WIDTH - 2;
const MSG_HEIGHT = PANEL_HEIGHT - 1;

// Parameters for dungeon generator
const ROOM_MAX_SIZE = 10;
const ROOM_MIN_SIZE = 6;
const MAX_ROOMS = 30;
const MAX_ROOM_MONSTERS = 3;
const TORCH_RADIUS = 10;

const COLOR_DARK_WALL = wglt.createColor(0, 0, 100);
const COLOR_LIGHT_WALL = wglt.createColor(130, 110, 50);
const COLOR_DARK_GROUND = wglt.createColor(50, 50, 150);
const COLOR_LIGHT_GROUND = wglt.createColor(200, 180, 50);

function Tile(blocked) {
    this.blocked = blocked;
    this.blockSight = blocked;
    this.explored = false;
}

function Rect(x, y, w, h) {
    this.x1 = x;
    this.y1 = y;
    this.x2 = x + w;
    this.y2 = y + h;

    this.getCenter = function () {
        return {
            x: ((this.x1 + this.x2) / 2) | 0,
            y: ((this.y1 + this.y2) / 2) | 0
        };
    }

    this.intersects = function (other) {
        return this.x1 <= other.x2 && this.x2 >= other.x1 &&
            this.y1 <= other.y2 && this.y2 >= other.y1;
    }
}

function Entity(x, y, char, name, color, blocks, fighter, ai) {
    this.x = x;
    this.y = y;
    this.char = char;
    this.name = name;
    this.color = color;
    this.blocks = !!blocks;
    this.fighter = fighter || null;
    this.ai = ai || null;

    if (fighter) {
        fighter.owner = this;
    }

    if (ai) {
        ai.owner = this;
    }

    this.move = function (dx, dy) {
        if (isBlocked(this.x + dx, this.y + dy)) {
            return;
        }
        this.x += dx;
        this.y += dy;
    };

    this.moveToward = function (targetX, targetY) {
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.hypot(dx, dy);
        this.move(Math.round(dx / distance), Math.round(dy / distance));
    };

    this.distanceTo = function (other) {
        return Math.hypot(other.x - this.x, other.y - this.y);
    };

    this.sendToBack = function () {
        const index = entities.indexOf(this);
        entities.splice(index, 1);
        entities.unshift(this);
    };

    this.draw = function () {
        if (fovMap.isVisible(this.x, this.y)) {
            term.setForegroundColor(this.x, this.y, this.color);
            term.drawString(this.x, this.y, this.char);
        }
    };
}

function Fighter(hp, defense, power, deathFunction) {
    this.owner = null;
    this.maxHp = hp;
    this.hp = hp;
    this.defense = defense;
    this.power = power;
    this.deathFunction = deathFunction || null;

    this.attack = function (target) {
        const damage = this.power - target.fighter.defense;

        if (damage > 0) {
            addMessage(capitalize(this.owner.name) + ' attacks ' + target.name + ' for ' + damage + ' hit points.');
            target.fighter.takeDamage(damage);
        } else {
            addMessage(capitalize(this.owner.name) + ' attacks ' + target.name + ' but it has no effect!');
        }
    };

    this.takeDamage = function (damage) {
        this.hp -= damage;

        // Check for death. if there's a death function, call it
        if (this.hp <= 0) {
            if (this.deathFunction) {
                this.deathFunction(this.owner);
            }
        }
    };
}

function BasicMonster() {
    this.owner = null;

    this.takeTurn = function () {
        const monster = this.owner;

        // A basic monster takes its turn. if you can see it, it can see you
        if (fovMap.isVisible(monster.x, monster.y)) {

            if (monster.distanceTo(player) >= 2) {
                // Move towards player if far away
                monster.moveToward(player.x, player.y);

            } else if (player.fighter.hp > 0) {
                // Close enough, attack! (if the player is still alive.)
                monster.fighter.attack(player);
            }
        }
    };
}

function isBlocked(x, y) {
    // First test the map tile
    if (map[y][x].blocked) {
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

function createRoom(map, room) {
    for (let y = room.y1 + 1; y < room.y2; y++) {
        for (let x = room.x1 + 1; x < room.x2; x++) {
            map[y][x].blocked = false;
            map[y][x].blockSight = false;
        }
    }
}

function createHTunnel(map, x1, x2, y) {
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
        map[y][x].blocked = false;
        map[y][x].blockSight = false;
    }
}

function createVTunnel(map, y1, y2, x) {
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        map[y][x].blocked = false;
        map[y][x].blockSight = false;
    }
}

function createMap() {
    const map = new Array(MAP_HEIGHT);
    for (let y = 0; y < MAP_HEIGHT; y++) {
        map[y] = new Array(MAP_WIDTH);
        for (let x = 0; x < MAP_WIDTH; x++) {
            map[y][x] = new Tile(true);
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

function placeObjects(room) {
    // Choose random number of monsters
    const numMonsters = rng.nextRange(0, MAX_ROOM_MONSTERS);

    for (let i = 0; i < numMonsters; i++) {
        // Choose random spot for this monster
        const x = rng.nextRange(room.x1 + 1, room.x2 - 1);
        const y = rng.nextRange(room.y1 + 1, room.y2 - 1);
        let monster = null;

        // Only place it if the tile is not blocked
        // 80% chance of getting an orc
        if (rng.nextRange(0, 100) < 80) {
            // Create an orc
            const fighter = new Fighter(10, 0, 3, monsterDeath);
            const ai = new BasicMonster();
            monster = new Entity(x, y, 'o', 'orc', wglt.COLOR_LIGHT_GREEN, true, fighter, ai);
        } else {
            // Create a troll
            const fighter = new Fighter(16, 1, 4, monsterDeath);
            const ai = new BasicMonster();
            monster = new Entity(x, y, 'T', 'troll', wglt.COLOR_DARK_GREEN, true, fighter, ai);
        }

        entities.push(monster);
    }
}

function renderBar(x, y, totalWidth, name, value, maximum, barColor, backColor) {
    // Render a bar (HP, experience, etc). first calculate the width of the bar
    const barWidth = Math.round(value / maximum * totalWidth);

    // Render the background first
    term.fillBackgroundRect(x, y, totalWidth, 1, backColor);

    // Now render the bar on top
    if (barWidth > 0) {
        term.fillBackgroundRect(x, y, barWidth, 1, barColor);
    }

    // Finally, some centered text with the values
    term.fillForegroundRect(x, y, totalWidth, 1, wglt.COLOR_WHITE);
    term.drawCenteredString(x + totalWidth / 2, y, name + ': ' + value + '/' + maximum);
}

function getNamesUnderMouse() {
    const x = term.getMouse().x;
    const y = term.getMouse().y;

    if (!fovMap.isVisible(x, y)) {
        return '';
    }

    const names = [];

    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        if (entity.x === x && entity.y === y) {
            names.push(entity.name);
        }
    }

    return capitalize(names.join(', '));
}

const term = new wglt.Terminal(document.querySelector('canvas'), SCREEN_WIDTH, SCREEN_HEIGHT);
const rng = new wglt.RNG(1);
const player = new Entity(40, 25, '@', 'Hero', wglt.COLOR_WHITE, true, new Fighter(20, 2, 5, playerDeath));
const entities = [player];
const messages = [];
const map = createMap();
const fovMap = new wglt.FovMap(MAP_WIDTH, MAP_HEIGHT, (x, y) => map[y][x].blocked);
let fovRecompute = true;

addMessage('Welcome stranger! Prepare to perish!', wglt.COLOR_DARK_RED);

function addMessage(msg, opt_color) {
    while (messages.length >= MSG_HEIGHT) {
        messages.shift();
    }
    messages.push({ text: msg, color: (opt_color || wglt.COLOR_WHITE) });
}

function capitalize(str) {
    if (!str) {
        return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function playerMoveOrAttack(dx, dy) {
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
        player.fighter.attack(target);
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
    if (term.isKeyPressed(wglt.VK_UP)) {
        playerMoveOrAttack(0, -1);
    }
    if (term.isKeyPressed(wglt.VK_LEFT)) {
        playerMoveOrAttack(-1, 0);
    }
    if (term.isKeyPressed(wglt.VK_RIGHT)) {
        playerMoveOrAttack(1, 0);
    }
    if (term.isKeyPressed(wglt.VK_DOWN)) {
        playerMoveOrAttack(0, 1);
    }
}

function playerDeath(player) {
    addMessage('You died!', wglt.COLOR_LIGHT_RED);
}

function monsterDeath(monster) {
    addMessage(capitalize(monster.name) + ' is dead!', wglt.COLOR_BROWN);
    monster.char = '%';
    monster.color = wglt.COLOR_DARK_RED;
    monster.blocks = false;
    monster.fighter = null;
    monster.ai = null;
    monster.name = 'remains of ' + monster.name;
    monster.sendToBack();
}

function renderAll() {
    if (fovRecompute) {
        fovMap.computeFov(player.x, player.y, TORCH_RADIUS);
        fovRecompute = false;
    }

    term.clear();

    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const visible = fovMap.isVisible(x, y);
            const wall = map[y][x].blockSight;
            let color = wglt.COLOR_BLACK;

            if (visible) {
                // It's visible
                color = wall ? COLOR_LIGHT_WALL : COLOR_LIGHT_GROUND;
                map[y][x].explored = true;
            } else if (map[y][x].explored) {
                // It's remembered
                color = wall ? COLOR_DARK_WALL : COLOR_DARK_GROUND;
            }

            term.setBackgroundColor(x, y, color);
        }
    }

    for (let i = 0; i < entities.length; i++) {
        entities[i].draw();
    }

    // Prepare to render the GUI panel
    term.clearRect(0, PANEL_Y, SCREEN_WIDTH, PANEL_HEIGHT);

    // Print the game messages, one line at a time
    y = PANEL_Y + 1;
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        term.fillForegroundRect(MSG_X, y, message.text.length, 1, message.color);
        term.drawString(MSG_X, y, message.text);
        y++;
    }

    // Show the player's stats
    renderBar(
        1, PANEL_Y + 1, BAR_WIDTH,
        'HP', player.fighter.hp, player.fighter.maxHp,
        wglt.COLOR_LIGHT_RED, wglt.COLOR_DARK_RED);

    // Display names of objects under the mouse
    term.drawString(1, PANEL_Y, getNamesUnderMouse(), wglt.COLOR_LIGHT_GRAY);
}

term.update = function () {
    handleKeys();
    renderAll();
};
