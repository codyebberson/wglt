
// Size of the map
const MAP_WIDTH = 60;
const MAP_HEIGHT = 40;

const TILE_SIZE = 16;
const TILE_WALL = 1 + 2 * 64 + 0;
const TILE_FLOOR = 1 + 2 * 64 + 1;

// Parameters for dungeon generator
const ROOM_MAX_SIZE = 10;
const ROOM_MIN_SIZE = 6;
const MAX_ROOMS = 30;
const MAX_ROOM_MONSTERS = 3;
const MAX_ROOM_ITEMS = 2;
const TORCH_RADIUS = 10;

// Spell values
const HEAL_AMOUNT = 4;
const LIGHTNING_DAMAGE = 20;
const LIGHTNING_RANGE = 5;
const CONFUSE_RANGE = 8;
const CONFUSE_NUM_TURNS = 10;
const FIREBALL_RANGE = 10;
const FIREBALL_RADIUS = 3;
const FIREBALL_DAMAGE = 12;

function createRoom(map, room) {
    for (let y = room.y1 + 1; y < room.y2; y++) {
        for (let x = room.x1 + 1; x < room.x2; x++) {
            map.setTile(0, x, y, TILE_FLOOR, false);
        }
    }
}

function createHTunnel(map, x1, x2, y) {
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
        map.setTile(0, x, y, TILE_FLOOR, false);
    }
}

function createVTunnel(map, y1, y2, x) {
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
        map.setTile(0, x, y, TILE_FLOOR, false);
    }
}

function createMap() {
    // Clear the map to all walls
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            map.setTile(0, x, y, TILE_WALL, true);
        }
    }

    // Reset field-of-view
    map.resetFov();

    const rooms = [];

    for (let r = 0; r < MAX_ROOMS; r++) {
        // Random width and height
        const w = rng.nextRange(ROOM_MIN_SIZE, ROOM_MAX_SIZE);
        const h = rng.nextRange(ROOM_MIN_SIZE, ROOM_MAX_SIZE);

        // Random position without going out of the boundaries of the map
        const x = rng.nextRange(1, MAP_WIDTH - w - 2);
        const y = rng.nextRange(1, MAP_HEIGHT - h - 2);

        // "Rect" class makes rectangles easier to work with
        const newRoom = new wglt.Rect(x, y, w, h);

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

    // Create stairs at the center of the last room
    const stairsLoc = rooms[rooms.length - 1].getCenter();
    stairs = new wglt.Entity(game, stairsLoc.x, stairsLoc.y, 'stairs', new wglt.Sprite(32, 32, 16, 16, 1), true);
    game.entities.push(stairs);

    // Initial FOV
    game.tileMap.computeFov(player.x, player.y, 12);
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
            monster = new wglt.Entity(game, x, y, 'Orc', new wglt.Sprite(32, 16, 16, 16, 2, true), true);
        } else {
            // Create a troll
            monster = new wglt.Entity(game, x, y, 'Troll', new wglt.Sprite(64, 16, 16, 16, 2, true), true);
        }

        monster.health = 20;
        monster.canAttack = true;
        monster.ai = new wglt.BasicMonster(monster);
        monster.onAttack = attackCallback;
        monster.onDeath = monsterDeath;
        game.entities.push(monster);
    }

    // Choose random number of items
    const numItems = rng.nextRange(0, MAX_ROOM_ITEMS);

    for (let i = 0; i < numItems; i++) {
        // Choose random spot for this item
        const x = rng.nextRange(room.x1 + 1, room.x2 - 1);
        const y = rng.nextRange(room.y1 + 1, room.y2 - 1);

        const dice = rng.nextRange(0, 100);
        let itemName = null;
        let itemSprite = null;
        let itemUse = null;

        if (dice < 50) {
            // Create a healing potion (50% chance)
            itemName = 'healing potion';
            itemSprite = new wglt.Sprite(128, 16, 16, 16, 1);
            itemUse = castHeal;

        } else if (dice < 50 + 20) {
            // Create a lightning bolt scroll (20% chance)
            itemName = 'scroll of lightning bolt';
            itemSprite = new wglt.Sprite(144, 16, 16, 16, 1);
            itemUse = castLightning;

        } else if (dice < 50 + 20 + 15) {
            // Create a fireball scroll (15% chance)
            itemName = 'scroll of fireball';
            itemSprite = new wglt.Sprite(144, 16, 16, 16, 1);
            itemUse = castFireball;

        } else {
            // Create a confuse scroll (15% chance)
            itemName = 'scroll of confusion';
            itemSprite = new wglt.Sprite(144, 16, 16, 16, 1);
            itemUse = castConfuse;
        }

        const item = new wglt.Entity(game, x, y, itemName, itemSprite);
        item.canPickup = true;
        item.onPickup = pickupCallback;
        item.onUse = itemUse;
        game.entities.push(item);
    }
}

function pickupCallback(entity, item) {
    messageLog.add(entity.name + ' picked up a ' + item.name, wglt.Colors.LIGHT_GREEN);
}

function getClosestMonster(x, y, range) {
    let minDist = range + 1;
    let result = null;
    for (let i = 0; i < game.entities.length; i++) {
        const entity = game.entities[i];
        if (entity !== player && entity.canAttack) {
            const dist = entity.distance(x, y);
            if (dist < minDist) {
                minDist = dist;
                result = entity;
            }
        }
    }
    return result;
}

function getMonsterAt(x, y) {
    return getClosestMonster(x, y, 0);
}

function castHeal(item, entity) {
    // Heal the player
    if (player.health === player.maxHealth) {
        messageLog.add('You are already at full health.', wglt.Colors.DARK_RED);
        return;
    }

    messageLog.add('Your wounds start to feel better!', wglt.Colors.LIGHT_MAGENTA);
    player.health += HEAL_AMOUNT;
    player.inventory.remove(item);
}

function castLightning(item) {
    // Find closest enemy (inside a maximum range) and damage it
    const monster = getClosestMonster(player.x, player.y, LIGHTNING_RANGE);
    if (!monster) {
        messageLog.add('No enemy is close enough to strike.', wglt.Colors.LIGHT_RED);
        return;
    }

    // Zap it!
    messageLog.add('A lightning bolt strikes the ' + monster.name + ' with a loud thunder!', wglt.Colors.LIGHT_BLUE);
    messageLog.add('The damage is ' + LIGHTNING_DAMAGE + ' hit points', wglt.Colors.LIGHT_BLUE);
    monster.takeDamage(LIGHTNING_DAMAGE);
    player.inventory.remove(item);
}

function castFireball(item) {
    // Ask the player for a target tile to throw a fireball at
    messageLog.add('Left-click to cast fireball, or right-click to cancel.', wglt.Colors.LIGHT_CYAN);
    game.startTargeting((x, y) => {
        const distance = player.distance(x, y);
        if (distance > FIREBALL_RANGE) {
            messageLog.add('Target out of range.', wglt.Colors.LIGHT_GRAY);
            return;
        }

        const speed = 8;
        const count = distance * (game.tileWidth / speed);
        const dx = (x * game.tileWidth - player.pixelX) / count;
        const dy = (y * game.tileHeight - player.pixelY) / count;

        game.effects.push(new wglt.ProjectileEffect(
            new wglt.Sprite(128, 32, 16, 16, 3, false),
            new wglt.Vec2(player.pixelX, player.pixelY),
            new wglt.Vec2(dx, dy),
            count
        ));

        game.effects.push(new wglt.ProjectileEffect(
            new wglt.Sprite(176, 32, 16, 16, 4, false, 4),
            new wglt.Vec2(x * game.tileWidth, y * game.tileHeight),
            new wglt.Vec2(0, 0),
            16
        ));

        messageLog.add('The fireball explodes, burning everything within ' + FIREBALL_RADIUS + ' tiles!', wglt.Colors.ORANGE);

        for (let i = game.entities.length - 1; i >= 0; i--) {
            const entity = game.entities[i];
            if (entity.canAttack && entity.distance(x, y) <= FIREBALL_RADIUS) {
                messageLog.add('The ' + entity.name + ' gets burned for ' + FIREBALL_DAMAGE + ' hit points.', wglt.Colors.ORANGE);
                entity.takeDamage(FIREBALL_DAMAGE);
            }
        }

        player.actionPoints = 0;
        player.inventory.remove(item);
    });
}

function castConfuse(item) {
    // Ask the player for a target to confuse
    messageLog.add('Left-click to cast confuse, or right-click to cancel.', wglt.Colors.LIGHT_CYAN);
    game.startTargeting((x, y) => {
        if (player.distance(x, y) > CONFUSE_RANGE) {
            messageLog.add('Target out of range.', wglt.Colors.LIGHT_GRAY);
            return;
        }

        const monster = getMonsterAt(x, y);
        if (!monster) {
            messageLog.add('No monster there.', wglt.Colors.LIGHT_GRAY);
            return;
        }

        monster.ai = new wglt.ConfusedMonster(monster);
        // monster.ai.owner = monster;
        messageLog.add('The eyes of the ' + monster.name + ' look vacant, as he stumbles around!', wglt.Colors.LIGHT_GREEN);
        player.inventory.remove(item);
    });
}

function attackCallback(attacker, target, damage) {
    if (damage > 0) {
        messageLog.add(attacker.name + ' attacks ' + target.name + ' for ' + damage + ' hit points.', 0x808080FF);
    } else {
        messageLog.add(attacker.name + ' attacks ' + target.name + ' but it has no effect!', 0x808080FF);
    }
}

function playerDeath(player) {
    messageLog.add('You died!');
}

function monsterDeath(monster) {
    messageLog.add(monster.name + ' is dead');
    monster.char = '%';
    monster.color = wglt.Colors.DARK_RED;
    monster.blocks = false;
    monster.ai = null;
    monster.name = 'remains of ' + monster.name;
    monster.sendToBack();

    const xpGain = 10;
    player.xp += xpGain;

    while (player.xp >= player.maxXp) {
        player.level++;
        player.xp = 0;
        player.maxXp *= 2;
        messageLog.add('You reached level ' + player.level, 0xFF8000FF);
    }
}

function nextLevel() {
    // Advance to the next level
    messageLog.add('You take a moment to rest, and recover your strength.', wglt.Colors.LIGHT_MAGENTA);
    messageLog.add('After a rare moment of peace, you descend deeper...', wglt.Colors.LIGHT_RED);
    game.entities = [player];
    createMap();
}

const app = new wglt.App({
    canvas: document.querySelector('canvas'),
    imageUrl: '../graphics.png',
    width: 400,
    height: 224,
});

const game = new wglt.Game(app, {
    tileWidth: 16,
    tileHeight: 16
});

game.targetSprite = new wglt.Sprite(0, 48, 16, 16);
game.gui.renderer.baseRect = new wglt.Rect(0, 64, 24, 24);

const rng = new wglt.RNG(1);
const sprite = new wglt.Sprite(0, 16, 16, 16, 2, true);
const player = new wglt.Entity(game, 30, 20, 'Player', sprite, true);
player.canAttack = true;
player.onAttack = attackCallback;
player.onDeath = playerDeath;
player.level = 1;
player.xp = 0;
player.maxXp = 10;
player.onBump = function (other) {
    if (other.canPickup) {
        player.moveToward(other.x, other.y);
        player.pickup(other);
        return true;
    }
    if (other.canAttack) {
        player.attack(other);
        return true;
    }
    if (other.name === 'stairs') {
        nextLevel();
        return true;
    }
};

const map = new wglt.TileMap(app.gl, MAP_WIDTH, MAP_HEIGHT, 1);
game.tileMap = map;
game.player = player;
game.entities.push(player);

const messageLog = new wglt.MessageLog(game.gui, new wglt.Rect(1, 224 - 50, 100, 100));
messageLog.add('Welcome stranger! Prepare to perish!', wglt.Colors.DARK_RED);
game.gui.add(messageLog);

const playerStats = new wglt.Panel(game.gui, new wglt.Rect(1, 1, 100, 100));
playerStats.drawContents = function () {
    const frameY = 0;
    app.drawString(player.name, 1, frameY);

    const hpPercent = player.health / player.maxHealth;
    app.drawImage(0, frameY + 7, 32, 64, 32, 12);
    app.drawImage(2, frameY + 9, 32, 80, 8, 8, undefined, Math.round(hpPercent * 28));
    app.drawString(player.health + '/' + player.maxHealth, 3, frameY + 10);

    const xpPercent = player.xp / player.maxXp;
    app.drawImage(32, frameY + 7, 32, 64, 32, 12);
    app.drawImage(34, frameY + 9, 32, 80, 8, 8, undefined, Math.round(xpPercent * 28));
    app.drawString(player.xp + '/' + player.maxXp, 35, frameY + 10);
};
game.gui.add(playerStats);

game.onUpdate = function () {
    if (app.isKeyPressed(wglt.Keys.VK_I)) {
        // Show inventory
        game.gui.add(new wglt.SelectDialog(
            game.gui,
            new wglt.Rect(40, 40, 100, 100),
            'INVENTORY',
            player.inventory,
            (choice) => {
                choice.use(player);
            }));
    }
};

// Generate the map
createMap();

const mainMenu = new wglt.AppState(app);
mainMenu.gui.renderer.baseRect = new wglt.Rect(0, 64, 24, 24);
mainMenu.gui.add(new wglt.ImagePanel(
    mainMenu.gui,
    new wglt.Rect(0, 768, 400, 224),
    new wglt.Rect(0, 0, 400, 224)
));
mainMenu.gui.add(new wglt.SelectDialog(
    mainMenu.gui,
    new wglt.Rect(150, 62, 100, 100),
    'INVENTORY',
    [
        { id: 'new', name: 'NEW GAME' },
        { id: 'continue', name: 'CONTINUE' }
    ],
    (choice) => {
        if (choice.id === 'new') {
            app.state = game;
        }
    }));

app.state = mainMenu;
