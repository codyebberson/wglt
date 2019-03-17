
// Size of the map
const MAP_WIDTH = 60;
const MAP_HEIGHT = 40;

const TILE_SIZE = 16;
const TILE_WALL = 1 + 2 * 64 + 0;
const TILE_FLOOR = 1 + 2 * 64 + 1;
const TILE_SHADOW = 1 + 10 * 64 + 10;

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
            map.setAnimated(x, y, 0, false);
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
                map.setTile(1, player.x, player.y, TILE_SHADOW);
                map.setAnimated(player.x, player.y, 0, true);

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
    game.resetViewport();
    game.recomputeFov();
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
            monster = new wglt.Actor(game, x, y, 'Orc', new wglt.Sprite(32, 16, 16, 16, 2, true), true);
        } else {
            // Create a troll
            monster = new wglt.Actor(game, x, y, 'Troll', new wglt.Sprite(64, 16, 16, 16, 2, true), true);
        }

        monster.hp = 20;
        monster.ai = new wglt.BasicMonster(monster, calculateDamage);
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
        let itemAbility = null;
        let itemTooltips = null;

        if (dice < 50) {
            // Create a healing potion (50% chance)
            itemName = 'healing potion';
            itemSprite = new wglt.Sprite(128, 16, 16, 16, 1);
            itemUse = castHeal;
            itemTooltips = [
                new wglt.Message('Ancient Healing Potion', wglt.Colors.BLUE),
                new wglt.Message('Item Level 5', wglt.Colors.YELLOW),
                new wglt.Message('Use: Restore 10 health', wglt.Colors.GREEN),
            ];

        } else if (dice < 50 + 20) {
            // Create a lightning bolt scroll (20% chance)
            itemName = 'scroll of lightning bolt';
            itemSprite = new wglt.Sprite(144, 16, 16, 16, 1);
            itemUse = readScroll;
            itemAbility = lightningAbility;

        } else if (dice < 50 + 20 + 15) {
            // Create a fireball scroll (15% chance)
            itemName = 'scroll of fireball';
            itemSprite = new wglt.Sprite(144, 16, 16, 16, 1);
            itemUse = readScroll;
            itemAbility = fireballAbility;

        } else {
            // Create a confuse scroll (15% chance)
            itemName = 'scroll of confusion';
            itemSprite = new wglt.Sprite(144, 16, 16, 16, 1);
            itemUse = readScroll;
            itemAbility = confuseAbility;
        }

        const item = new wglt.Item(game, x, y, itemName, itemSprite);
        item.onPickup = pickupCallback;
        item.onUse = itemUse;
        item.ability = itemAbility;
        item.tooltipMessages = itemTooltips;
        game.entities.push(item);
    }
}

function pickupCallback(entity) {
    const item = this;
    game.log(entity.name + ' picked up a ' + item.name, wglt.Colors.LIGHT_GREEN);
}

function getClosestMonster(x, y, range) {
    let minDist = range + 1;
    let result = null;
    for (let i = 0; i < game.entities.length; i++) {
        const entity = game.entities[i];
        if (entity instanceof wglt.Actor && entity !== player) {
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

function calculateDamage(attacker, target) {
    return 10;
}

function castHeal(caster) {
    const item = this;

    // Heal the player
    if (caster.hp === caster.maxHp) {
        game.log('You are already at full health.', wglt.Colors.RED);
        return;
    }

    game.log('Your wounds start to feel better!', wglt.Colors.LIGHT_MAGENTA);
    caster.takeHeal(HEAL_AMOUNT);
    caster.inventory.remove(item);
    caster.ap--;
}

const lightningAbility = {
    name: 'Lightning',
    sprite: new wglt.Sprite(128, 32, 16, 16, 3),
    targetType: wglt.TargetType.SELF,
    cooldown: 10,
    tooltipMessages: [
        new wglt.Message('Lightning', wglt.Colors.WHITE),
        new wglt.Message('2% of base mana', wglt.Colors.WHITE),
        new wglt.Message('2 turn cast', wglt.Colors.WHITE),
        new wglt.Message('Hurls a bolt of lightning at the target', wglt.Colors.YELLOW),
        new wglt.Message('dealing 20 damage.', wglt.Colors.YELLOW),
    ],
    cast: function (caster) {
        // Find closest enemy (inside a maximum range) and damage it
        const monster = getClosestMonster(caster.x, caster.y, LIGHTNING_RANGE);
        if (!monster) {
            game.log('No enemy is close enough to strike.', wglt.Colors.LIGHT_RED);
            return false;
        }

        // Zap it!
        game.log('A lightning bolt strikes the ' + monster.name + ' with a loud thunder!', wglt.Colors.LIGHT_BLUE);
        game.log('The damage is ' + LIGHTNING_DAMAGE + ' hit points', wglt.Colors.LIGHT_BLUE);
        monster.takeDamage(LIGHTNING_DAMAGE);
        caster.ap--;
        return true;
    }
};

const fireballAbility = {
    name: 'Fireball',
    sprite: new wglt.Sprite(128, 32, 16, 16, 3),
    targetType: wglt.TargetType.TILE,
    cooldown: 20,
    tooltipMessages: [
        new wglt.Message('Fireball', wglt.Colors.WHITE),
        new wglt.Message('2% of base mana', wglt.Colors.WHITE),
        new wglt.Message('2 turn cast', wglt.Colors.WHITE),
        new wglt.Message('Throws a fiery ball causing 10 damage', wglt.Colors.YELLOW),
        new wglt.Message('to all enemies within 3 tiles.', wglt.Colors.YELLOW),
    ],
    cast: function (caster, target) {
        const distance = caster.distanceTo(target);
        if (distance > FIREBALL_RANGE) {
            game.log('Target out of range.', wglt.Colors.LIGHT_GRAY);
            return false;
        }

        const speed = 8;
        const count = distance * (game.tileSize.width / speed);
        const dx = (target.x * game.tileSize.width - caster.pixelX) / count;
        const dy = (target.y * game.tileSize.height - caster.pixelY) / count;

        game.effects.push(new wglt.ProjectileEffect(
            new wglt.Sprite(128, 32, 16, 16, 3, false),
            new wglt.Vec2(caster.pixelX, caster.pixelY),
            new wglt.Vec2(dx, dy),
            count
        ));

        game.effects.push(new wglt.ProjectileEffect(
            new wglt.Sprite(176, 32, 16, 16, 4, false, 4),
            new wglt.Vec2(target.x * game.tileSize.width, target.y * game.tileSize.height),
            new wglt.Vec2(0, 0),
            16
        ));

        game.log('The fireball explodes, burning everything within ' + FIREBALL_RADIUS + ' tiles!', wglt.Colors.ORANGE);

        for (let i = game.entities.length - 1; i >= 0; i--) {
            const entity = game.entities[i];
            if (entity instanceof wglt.Actor && entity.distanceTo(target) <= FIREBALL_RADIUS) {
                game.log('The ' + entity.name + ' gets burned for ' + FIREBALL_DAMAGE + ' hit points.', wglt.Colors.ORANGE);
                entity.takeDamage(FIREBALL_DAMAGE);
            }
        }

        caster.ap--;
        return true;
    }
};

const confuseAbility = {
    targetType: wglt.TargetType.ENTITY,
    cast: function (caster, target) {
        if (caster.distanceTo(target) > CONFUSE_RANGE) {
            game.log('Target out of range.', wglt.Colors.LIGHT_GRAY);
            return;
        }

        target.ai = new wglt.ConfusedMonster(target);
        game.log('The eyes of the ' + target.name + ' look vacant, as he stumbles around!', wglt.Colors.LIGHT_GREEN);
        caster.ap--;
        return true;
    }
};

function readScroll() {
    const item = this;
    const ability = this.ability;
    player.cast(ability, undefined, function () {
        player.inventory.remove(item);
    });
}

function attackCallback(target, damage) {
    const attacker = this;
    if (damage > 0) {
        game.log(attacker.name + ' attacks ' + target.name + ' for ' + damage + ' hit points.', 0x808080FF);
    } else {
        game.log(attacker.name + ' attacks ' + target.name + ' but it has no effect!', 0x808080FF);
    }
}

function playerDeath() {
    game.log('You died!');
}

function monsterDeath() {
    const monster = this;
    game.log(monster.name + ' is dead');
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
        game.log('You reached level ' + player.level, 0xFF8000FF);
    }
}

function nextLevel() {
    // Advance to the next level
    const fadeOut = new wglt.FadeOutEffect(30);
    const fadeIn = new wglt.FadeInEffect(30);

    fadeOut.onDone = () => {
        game.log('You take a moment to rest, and recover your strength.', wglt.Colors.LIGHT_MAGENTA);
        game.log('After a rare moment of peace, you descend deeper...', wglt.Colors.LIGHT_RED);
        game.entities = [player];
        game.stopAutoWalk();
        createMap();
    };

    game.effects.push(fadeOut);
    game.effects.push(fadeIn);
}

const app = new wglt.App({
    canvas: document.querySelector('canvas'),
    imageUrl: '../graphics.png',
    size: new wglt.Rect(0, 0, 400, 224)
});

const game = new wglt.Game(app, {
    tileWidth: 16,
    tileHeight: 16
});

game.targetSprite = new wglt.Sprite(0, 48, 16, 16);
game.cooldownSprite = new wglt.Sprite(0, 160, 16, 16, 24);
game.blackoutRect = new wglt.Rect(0, 32, 16, 16);
game.gui.renderer.baseRect = new wglt.Rect(0, 64, 24, 24);
game.gui.renderer.closeButtonRect = new wglt.Rect(208, 16, 16, 16);
game.gui.renderer.buttonSlotRect = new wglt.Rect(0, 88, 24, 24);

const rng = new wglt.RNG(1);
const sprite = new wglt.Sprite(0, 16, 16, 16, 2, true);
const player = new wglt.Actor(game, 30, 20, 'Player', sprite, true);
player.onAttack = attackCallback;
player.onDeath = playerDeath;
player.level = 1;
player.xp = 0;
player.maxXp = 10;
player.zIndex = 2;
player.onBump = function (other) {
    if (other instanceof wglt.Item) {
        player.moveToward(other.x, other.y);
        player.pickup(other);
        return true;
    }
    if (other instanceof wglt.Actor) {
        player.attack(other, 10);
        return true;
    }
    if (other.name === 'stairs') {
        nextLevel();
        return true;
    }
};

const map = new wglt.TileMap(app.gl, MAP_WIDTH, MAP_HEIGHT, 3);
game.tileMap = map;
game.player = player;
game.entities.push(player);

game.messageLog = new wglt.MessageLog(new wglt.Rect(1, -78, 100, 50));
game.gui.add(game.messageLog);
game.log('Welcome stranger! Prepare to perish!', wglt.Colors.DARK_RED);

const playerStats = new wglt.Panel(new wglt.Rect(1, 1, 100, 100));
playerStats.drawContents = function () {
    const frameY = 0;
    app.drawString(player.name, 1, frameY);

    const hpPercent = player.hp / player.maxHp;
    app.drawImage(0, frameY + 7, 32, 64, 32, 12);
    app.drawImage(2, frameY + 9, 32, 80, 8, 8, undefined, Math.round(hpPercent * 28));
    app.drawString(player.hp + '/' + player.maxHp, 3, frameY + 10);

    const xpPercent = player.xp / player.maxXp;
    app.drawImage(32, frameY + 7, 32, 64, 32, 12);
    app.drawImage(34, frameY + 9, 32, 80, 8, 8, undefined, Math.round(xpPercent * 28));
    app.drawString(player.xp + '/' + player.maxXp, 35, frameY + 10);
};
game.gui.add(playerStats);

const shortcutBar = new wglt.ShortcutBar(new wglt.Rect(1, 224 - 26, 26 * 6, 26), 6);
game.gui.add(shortcutBar);

const inventoryButton = new wglt.Button(
    new wglt.Rect(400 - 24, 224 - 24, 24, 24),
    new wglt.Sprite(192, 16, 16, 16),
    wglt.Keys.VK_I,
    function () {
        inventoryDialog.visible = !inventoryDialog.visible;
        talentsDialog.visible = false;
    });
inventoryButton.tooltipMessages = [
    new wglt.Message('Traveler\'s Backpack', wglt.Colors.GREEN),
    new wglt.Message('Item Level 55', wglt.Colors.YELLOW),
    new wglt.Message('16 Slot Bag', wglt.Colors.WHITE),
    new wglt.Message('Sell Price: 87 coins', wglt.Colors.WHITE)
];
game.gui.add(inventoryButton);

const talentsButton = new wglt.Button(
    new wglt.Rect(400 - 48, 224 - 24, 24, 24),
    new wglt.Sprite(192, 16, 16, 16),
    wglt.Keys.VK_N,
    function () {
        talentsDialog.visible = !talentsDialog.visible;
        inventoryDialog.visible = false;
    });
talentsButton.tooltipMessages = [
    new wglt.Message('Talents', wglt.Colors.WHITE),
    new wglt.Message('A list of all of your', wglt.Colors.YELLOW),
    new wglt.Message('character\'s talents.', wglt.Colors.YELLOW)
];
game.gui.add(talentsButton);

const inventoryDialog = new wglt.ItemContainerDialog(
    new wglt.Rect(10, 25, 110, 110),
    [
        new wglt.Message('Traveler\'s Backpack', wglt.Colors.GREEN),
        new wglt.Message('Click to use', wglt.Colors.LIGHT_GRAY),
        new wglt.Message('Drag for shortcut', wglt.Colors.LIGHT_GRAY),
    ],
    16,
    player.inventory);
inventoryDialog.visible = false;
game.gui.add(inventoryDialog);

const talentsDialog = new wglt.TalentsDialog(
    new wglt.Rect(10, 25, 110, 110),
    [
        new wglt.Message('Talents', wglt.Colors.GREEN),
        new wglt.Message('Click to use', wglt.Colors.LIGHT_GRAY),
        new wglt.Message('Drag for shortcut', wglt.Colors.LIGHT_GRAY),
    ],
    16,
    player.talents);
talentsDialog.visible = false;
game.gui.add(talentsDialog);

player.inventory.addListener({
    onAdd: (_, item) => {
        console.log('add item!', item);
        shortcutBar.addItem(player.inventory, item, true);
    },
    onRemove: (_, talent) => { }
});

player.talents.addListener({
    onAdd: (_, talent) => {
        console.log('add talent!', talent);
        shortcutBar.addTalent(talent);
    },
    onRemove: (_, talent) => { }
});

player.talents.add(new wglt.Talent(player, fireballAbility));
player.talents.add(new wglt.Talent(player, lightningAbility));

// Generate the map
createMap();

const mainMenu = new wglt.AppState(app);
mainMenu.gui.renderer.baseRect = new wglt.Rect(0, 64, 24, 24);
mainMenu.gui.add(new wglt.ImagePanel(
    new wglt.Rect(0, 768, 400, 224),
    new wglt.Rect(0, 0, 400, 224)
));
mainMenu.gui.add(new wglt.SelectDialog(
    new wglt.Rect(150, 62, 100, 100),
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
