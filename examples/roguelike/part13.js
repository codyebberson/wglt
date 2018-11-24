
// Actual size of the window
const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 50;

// Size of the map
const MAP_WIDTH = 80;
const MAP_HEIGHT = 43;

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

// Experience and level-ups
const LEVEL_UP_BASE = 200;
const LEVEL_UP_FACTOR = 150;

const COLOR_DARK_WALL = wglt.fromRgb(0, 0, 100);
const COLOR_LIGHT_WALL = wglt.fromRgb(130, 110, 50);
const COLOR_DARK_GROUND = wglt.fromRgb(50, 50, 150);
const COLOR_LIGHT_GROUND = wglt.fromRgb(200, 180, 50);

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

function Entity(x, y, char, name, color, blocks, components) {
    this.x = x;
    this.y = y;
    this.char = char;
    this.name = name;
    this.color = color;
    this.blocks = !!blocks;

    if (components) {
        for (var property in components) {
            if (components.hasOwnProperty(property)) {
                this[property] = components[property];
                this[property].owner = this;
            }
        }
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

    this.distance = function (x, y) {
        return Math.hypot(x - this.x, y - this.y);
    };

    this.sendToBack = function () {
        this.remove();
        entities.unshift(this);
    };

    this.remove = function () {
        entities.splice(entities.indexOf(this), 1);
    };

    this.draw = function () {
        if (fovMap.isVisible(this.x, this.y)) {
            term.drawString(this.x, this.y, this.char, this.color);
        }
    };
}

function Fighter(hp, defense, power, xp, deathFunction) {
    this.owner = null;
    this.baseMaxHp = hp;
    this.baseDefense = defense;
    this.basePower = power;
    this.hp = hp;
    this.xp = xp;
    this.deathFunction = deathFunction || null;

    Object.defineProperty(this, 'maxHp', {
        get: function () {
            return this.baseMaxHp + getAllEquipped(this.owner).reduce((acc, item) => acc + item.maxHpBonus, 0);
        }
    });

    Object.defineProperty(this, 'defense', {
        get: function () {
            return this.baseDefense + getAllEquipped(this.owner).reduce((acc, item) => acc + item.defenseBonus, 0);
        }
    });

    Object.defineProperty(this, 'power', {
        get: function () {
            return this.basePower + getAllEquipped(this.owner).reduce((acc, item) => acc + item.powerBonus, 0);
        }
    });

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
            this.hp = 0;
            if (this.deathFunction) {
                this.deathFunction(this.owner);
            }
            if (this.owner !== player) {
                player.fighter.xp += this.xp;
                checkLevelUp();
            }
        }
    };

    this.heal = function (amount) {
        this.hp = Math.min(this.hp + amount, this.maxHp);
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

function ConfusedMonster(oldAi) {
    this.owner = null;
    this.oldAi = oldAi;
    this.numTurns = CONFUSE_NUM_TURNS;

    this.takeTurn = function () {
        if (this.numTurns > 0) {
            // Still confused...
            // Move in a random direction, and decrease the number of turns confused
            this.owner.move(rng.nextRange(-1, 1), rng.nextRange(-1, 1));
            this.numTurns--;
        } else {
            this.owner.ai = this.oldAi;
            addMessage('The ' + this.owner.name + ' is no longer confused!', wglt.Colors.LIGHT_RED);
        }
    }
}

function Item(useFunction) {
    this.useFunction = useFunction;

    this.pickUp = function () {
        if (inventory.length >= 26) {
            addMessage('Your inventory is full, cannot pick up ' + this.owner.name + '.', wglt.Colors.LIGHT_RED);
        } else {
            inventory.push(this.owner);
            this.owner.remove();
            addMessage('You picked up a ' + this.owner.name + '!', wglt.Colors.LIGHT_GREEN);
        }
    };

    this.use = function () {
        if (this.useFunction) {
            this.useFunction(this);
        } else if (this.owner.equipment) {
            this.owner.equipment.toggleEquip();
        } else {
            addMessage('The ' + this.owner.name + ' cannot be used.');
        }
    };

    this.remove = function () {
        inventory.splice(inventory.indexOf(this.owner), 1);
    };
}

function Equipment(slot, powerBonus, defenseBonus, maxHpBonus) {
    this.slot = slot;
    this.powerBonus = powerBonus;
    this.defenseBonus = defenseBonus;
    this.maxHpBonus = maxHpBonus;
    this.equipped = false;

    this.toggleEquip = function () {
        if (this.equipped) {
            this.dequip();
        } else {
            this.equip();
        }
    };

    this.equip = function () {
        // If the slot is already being used, dequip whatever is there first
        const old = getEquippedInSlot(this.slot);
        if (old) {
            old.dequip();
        }

        // Equip object and show a message about it
        this.equipped = true;
        addMessage('Equipped ' + this.owner.name + ' on ' + this.slot + '.', wglt.Colors.LIGHT_GREEN);
    };

    this.dequip = function () {
        // Dequip object and show a message about it
        if (!this.equipped) {
            return;
        }
        this.equipped = false;
        addMessage('Dequipped ' + this.owner.name + ' on ' + this.slot + '.', wglt.Colors.YELLOW);
    };
}

function getEquippedInSlot(slot) {
    for (let i = 0; i < inventory.length; i++) {
        const obj = inventory[i];
        if (obj.equipment && obj.equipment.slot === slot && obj.equipment.equipped) {
            return obj.equipment;
        }
    }
    return null;
}

function getAllEquipped(obj) {
    if (obj === player) {
        return inventory.filter(item => item.equipment && item.equipment.equipped).map(item => item.equipment);
    } else {
        return [];
    }
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

    // Create stairs at the center of the last room
    const stairsLoc = rooms[rooms.length - 1].getCenter();
    stairs = new Entity(stairsLoc.x, stairsLoc.y, '<', 'stairs', wglt.Colors.WHITE);
    entities.push(stairs);
    stairs.sendToBack();

    return map;
}

function fromDungeonLevel(table) {
    // Returns a value that depends on level.
    // The table specifies what value occurs after each level, default is 0.
    for (let i = 0; i < table.length; i++) {
        const value = table[i][0];
        const level = table[i][1];
        if (dungeonLevel >= level) {
            return value;
        }
    }
    return 0;
}

function placeObjects(room) {
    // This is where we decide the chance of each monster or item appearing.

    // Maximum number of monsters per room
    const maxMonsters = fromDungeonLevel([[2, 1], [3, 4], [5, 6]]);

    // Chance of each monster
    const monsterChances = {
        'orc': 80, // orc always shows up, even if all other monsters have 0 chance
        'troll': fromDungeonLevel([[15, 3], [30, 5], [60, 7]])
    };

    // Maximum number of items per room
    const maxItems = fromDungeonLevel([[1, 1], [2, 4]])

    // Chance of each item (by default they have a chance of 0 at level 1, which then goes up)
    const itemChances = {
        'heal': 35,  // healing potion always shows up, even if all other items have 0 chance
        'lightning': fromDungeonLevel([[25, 4]]),
        'fireball': fromDungeonLevel([[25, 6]]),
        'confuse': fromDungeonLevel([[10, 2]]),
        'sword': fromDungeonLevel([[5, 4]]),
        'shield': fromDungeonLevel([[15, 8]])
    };

    // Choose random number of monsters
    const numMonsters = rng.nextRange(0, maxMonsters + 1);

    for (let i = 0; i < numMonsters; i++) {
        // Choose random spot for this monster
        const x = rng.nextRange(room.x1 + 1, room.x2 - 1);
        const y = rng.nextRange(room.y1 + 1, room.y2 - 1);
        let monster = null;

        const choice = rng.chooseKey(monsterChances);
        if (choice === 'orc') {
            const fighter = new Fighter(20, 0, 4, 35, monsterDeath);
            const ai = new BasicMonster();
            monster = new Entity(x, y, 'o', 'orc', wglt.Colors.LIGHT_GREEN, true, { fighter: fighter, ai: ai });

        } else if (choice === 'troll') {
            const fighter = new Fighter(30, 2, 8, 100, monsterDeath);
            const ai = new BasicMonster();
            monster = new Entity(x, y, 'T', 'troll', wglt.Colors.DARK_GREEN, true, { fighter: fighter, ai: ai });
        }

        entities.push(monster);
    }

    // Choose random number of items
    const numItems = rng.nextRange(0, maxItems + 1);

    for (let i = 0; i < numItems; i++) {
        // Choose random spot for this item
        const x = rng.nextRange(room.x1 + 1, room.x2 - 1)
        const y = rng.nextRange(room.y1 + 1, room.y2 - 1)
        let item = null;

        const choice = rng.chooseKey(itemChances);
        if (choice === 'heal') {
            // Create a healing potion
            item = new Entity(x, y, '!', 'healing potion', wglt.Colors.DARK_MAGENTA, false, { item: new Item(castHeal) });

        } else if (choice === 'lightning') {
            // Create a lightning bolt scroll
            item = new Entity(x, y, '#', 'scroll of lightning bolt', wglt.Colors.YELLOW, false, { item: new Item(castLightning) });

        } else if (choice === 'fireball') {
            // Create a fireball scroll
            item = new Entity(x, y, '#', 'scroll of fireball', wglt.Colors.YELLOW, false, { item: new Item(castFireball) });

        } else if (choice === 'confuse') {
            // Create a confuse scroll
            item = new Entity(x, y, '#', 'scroll of confusion', wglt.Colors.YELLOW, false, { item: new Item(castConfuse) });

        } else if (choice === 'sword') {
            // Create a sword
            item = new Entity(x, y, '/', 'sword', wglt.Colors.LIGHT_CYAN, false, {
                equipment: new Equipment('right hand', 3, 0, 0),
                item: new Item()
            });

        } else if (choice === 'shield') {
            // Create a shield
            item = new Entity(x, y, '[', 'shield', wglt.Colors.BROWN, false, {
                equipment: new Equipment('left hand', 3, 0, 0),
                item: new Item()
            });
        }

        entities.push(item);
        item.sendToBack();  // items appear below other objects
    }
}

function renderBar(x, y, totalWidth, name, value, maximum, barColor, backColor) {
    // Render a bar (HP, experience, etc). first calculate the width of the bar
    const barWidth = Math.round(value / maximum * totalWidth);

    // Render the background first
    term.fillRect(x, y, totalWidth, 1, 0, 0, backColor);

    // Now render the bar on top
    if (barWidth > 0) {
        term.fillRect(x, y, barWidth, 1, 0, 0, barColor);
    }

    // Finally, some centered text with the values
    // term.fillForegroundRect(x, y, totalWidth, 1, wglt.Colors.WHITE);
    term.drawCenteredString(x + totalWidth / 2, y, name + ': ' + value + '/' + maximum, wglt.Colors.WHITE);
}

function getNamesUnderMouse() {
    const x = term.mouse.x;
    const y = term.mouse.y;

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

function addMessage(msg, opt_color) {
    while (messages.length >= MSG_HEIGHT) {
        messages.shift();
    }
    messages.push({ text: msg, color: (opt_color || wglt.Colors.WHITE) });
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
    if (player.fighter.hp <= 0) {
        return;
    }

    if (gui.handleInput()) {
        return;
    }

    if (targetFunction) {
        if (term.isKeyPressed(wglt.Keys.VK_ENTER) || term.mouse.buttons[0]) {
            endTargeting(targetCursor.x, targetCursor.y);
        }
        if (term.isKeyPressed(wglt.Keys.VK_ESCAPE) || term.mouse.buttons[2]) {
            cancelTargeting();
        }
        if (term.isKeyPressed(wglt.Keys.VK_UP)) {
            targetCursor.y--;
        }
        if (term.isKeyPressed(wglt.Keys.VK_LEFT)) {
            targetCursor.x--;
        }
        if (term.isKeyPressed(wglt.Keys.VK_RIGHT)) {
            targetCursor.x++;
        }
        if (term.isKeyPressed(wglt.Keys.VK_DOWN)) {
            targetCursor.y++;
        }
        if (term.mouse.dx !== 0 || term.mouse.dy !== 0) {
            targetCursor.x = term.mouse.x;
            targetCursor.y = term.mouse.y;
        }
        return;
    }

    if (term.isKeyPressed(wglt.Keys.VK_ESCAPE)) {
        saveGame();
        appState = 'menu';
    }
    if (term.isKeyPressed(wglt.Keys.VK_UP)) {
        playerMoveOrAttack(0, -1);
    }
    if (term.isKeyPressed(wglt.Keys.VK_LEFT)) {
        playerMoveOrAttack(-1, 0);
    }
    if (term.isKeyPressed(wglt.Keys.VK_RIGHT)) {
        playerMoveOrAttack(1, 0);
    }
    if (term.isKeyPressed(wglt.Keys.VK_DOWN)) {
        playerMoveOrAttack(0, 1);
    }
    if (term.isKeyPressed(wglt.Keys.VK_G)) {
        // Pick up an item
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            if (entity.x === player.x && entity.y === player.y && entity.item) {
                entity.item.pickUp();
            }
        }
    }
    if (term.isKeyPressed(wglt.Keys.VK_I)) {
        if (inventory.length === 0) {
            gui.add(new wglt.MessageDialog(term, 'ALERT', 'Inventory is empty'));
        } else {
            const options = inventory.map(item => {
                if (item.equipment && item.equipment.equipped) {
                    return item.name + ' (on ' + item.equipment.slot + ')';
                } else {
                    return item.name;
                }
            });
            gui.add(new wglt.SelectDialog(term, 'INVENTORY', options, useInventory));
        }
    }
    if (term.isKeyPressed(wglt.Keys.VK_C)) {
        const levelUpXp = LEVEL_UP_BASE + player.level * LEVEL_UP_FACTOR;
        gui.add(new wglt.MessageDialog(term, 'CHARACTER',
            'Level: ' + player.level +
            '\nExperience: ' + player.fighter.xp +
            '\nExperience to level up: ' + levelUpXp +
            '\n\nMaximum HP: ' + player.fighter.maxHp +
            '\nAttack: ' + player.fighter.power +
            '\nDefense: ' + player.fighter.defense));
    }
    if (term.isKeyPressed(wglt.Keys.VK_COMMA)) {
        if (player.x === stairs.x && player.y === stairs.y) {
            nextLevel();
        }
    }
}

function useInventory(choice) {
    if (choice >= 0) {
        inventory[choice].item.use();
    }
}

function checkLevelUp() {
    // See if the player's experience is enough to level-up
    const levelUpXp = LEVEL_UP_BASE + player.level * LEVEL_UP_FACTOR;
    if (player.fighter.xp >= levelUpXp) {
        player.level++;
        player.fighter.xp -= levelUpXp;
        addMessage('Your battle skills grow stronger! You reached level ' + player.level + '!', wglt.Colors.YELLOW);

        const options = [
            'Constitution (+20 HP, from ' + player.fighter.maxHp + ')',
            'Strength (+1 attack, from ' + player.fighter.power + ')',
            'Agility (+1 defense, from ' + player.fighter.defense + ')'
        ];

        gui.add(new wglt.SelectDialog(term, 'LEVEL UP', options, (choice) => {
            if (choice === 0) {
                player.fighter.baseMaxHp += 20;
                player.fighter.hp += 20;
            } else if (choice === 1) {
                player.fighter.basePower += 1;
            } else if (choice === 2) {
                player.fighter.baseDefense += 1;
            }
        }));
    }
}

function playerDeath(player) {
    addMessage('You died!', wglt.Colors.LIGHT_RED);
}

function monsterDeath(monster) {
    addMessage(capitalize(monster.name) + ' is dead! You gain ' + monster.fighter.xp + ' XP.', wglt.Colors.ORANGE);
    monster.char = '%';
    monster.color = wglt.Colors.DARK_RED;
    monster.blocks = false;
    monster.fighter = null;
    monster.ai = null;
    monster.name = 'remains of ' + monster.name;
    monster.sendToBack();
}

function getClosestMonster(x, y, range) {
    let minDist = range + 1;
    let result = null;
    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        if (entity.fighter && entity !== player) {
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

function castHeal(item) {
    // Heal the player
    if (player.fighter.hp === player.fighter.maxHp) {
        addMessage('You are already at full health.', wglt.Colors.DARK_RED);
        return;
    }

    addMessage('Your wounds start to feel better!', wglt.Colors.LIGHT_MAGENTA);
    player.fighter.heal(HEAL_AMOUNT);
    item.remove();
}

function castLightning(item) {
    // Find closest enemy (inside a maximum range) and damage it
    const monster = getClosestMonster(player.x, player.y, LIGHTNING_RANGE);
    if (!monster) {
        addMessage('No enemy is close enough to strike.', wglt.Colors.LIGHT_RED);
        return;
    }

    // Zap it!
    addMessage('A lightning bolt strikes the ' + monster.name + ' with a loud thunder!', wglt.Colors.LIGHT_BLUE);
    addMessage('The damage is ' + LIGHTNING_DAMAGE + ' hit points', wglt.Colors.LIGHT_BLUE);
    monster.fighter.takeDamage(LIGHTNING_DAMAGE);
    item.remove();
}

function castFireball(item) {
    // Ask the player for a target tile to throw a fireball at
    addMessage('Left-click to cast fireball, or right-click to cancel.', wglt.Colors.LIGHT_CYAN);
    startTargeting((x, y) => {
        if (player.distance(x, y) > FIREBALL_RANGE) {
            addMessage('Target out of range.', wglt.Colors.LIGHT_GRAY);
            return;
        }

        addMessage('The fireball explodes, burning everything within ' + FIREBALL_RADIUS + ' tiles!', wglt.Colors.ORANGE);

        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            if (entity.fighter && entity.distance(x, y) <= FIREBALL_RADIUS) {
                addMessage('The ' + entity.name + ' gets burned for ' + FIREBALL_DAMAGE + ' hit points.', wglt.Colors.ORANGE);
                entity.fighter.takeDamage(FIREBALL_DAMAGE);
            }
        }

        item.remove();
    });
}

function castConfuse(item) {
    // Ask the player for a target to confuse
    addMessage('Left-click to cast confuse, or right-click to cancel.', wglt.Colors.LIGHT_CYAN);
    startTargeting((x, y) => {
        if (player.distance(x, y) > CONFUSE_RANGE) {
            addMessage('Target out of range.', wglt.Colors.LIGHT_GRAY);
            return;
        }

        const monster = getMonsterAt(x, y);
        if (!monster) {
            addMessage('No monster there.', wglt.Colors.LIGHT_GRAY);
            return;
        }

        monster.ai = new ConfusedMonster(monster.ai);
        monster.ai.owner = monster;
        addMessage('The eyes of the ' + monster.name + ' look vacant, as he stumbles around!', wglt.Colors.LIGHT_GREEN);
        item.remove();
    });
}

function startTargeting(callback) {
    targetFunction = callback;
    targetCursor.x = player.x;
    targetCursor.y = player.y;
}

function endTargeting(x, y) {
    targetFunction(x, y);
    cancelTargeting();
}

function cancelTargeting() {
    targetFunction = null;
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
            let color = wglt.Colors.BLACK;

            if (visible) {
                // It's visible
                color = wall ? COLOR_LIGHT_WALL : COLOR_LIGHT_GROUND;
                map[y][x].explored = true;
            } else if (map[y][x].explored) {
                // It's remembered
                color = wall ? COLOR_DARK_WALL : COLOR_DARK_GROUND;
            }

            term.drawChar(x, y, 0, 0, color);
        }
    }

    for (let i = 0; i < entities.length; i++) {
        entities[i].draw();
    }

    // Prepare to render the GUI panel
    term.fillRect(0, PANEL_Y, SCREEN_WIDTH, PANEL_HEIGHT, 0, wglt.Colors.WHITE, wglt.Colors.BLACK);

    // Print the game messages, one line at a time
    y = PANEL_Y + 1;
    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        term.drawString(MSG_X, y, message.text, message.color);
        y++;
    }

    // Show the player's stats
    renderBar(
        1, PANEL_Y + 1, BAR_WIDTH,
        'HP', player.fighter.hp, player.fighter.maxHp,
        wglt.Colors.LIGHT_RED, wglt.Colors.DARK_RED);

    renderBar(
        1, PANEL_Y + 2, BAR_WIDTH,
        'XP', player.fighter.xp, LEVEL_UP_BASE + player.level * LEVEL_UP_FACTOR,
        wglt.Colors.LIGHT_MAGENTA, wglt.Colors.DARK_MAGENTA);

    term.drawString(1, PANEL_Y + 4, 'Dungeon level ' + dungeonLevel, wglt.Colors.ORANGE);

    // Display names of objects under the mouse
    term.drawString(1, PANEL_Y, getNamesUnderMouse(), wglt.Colors.LIGHT_GRAY);

    if (targetFunction) {
        term.getCell(targetCursor.x, targetCursor.y).setBackground(wglt.Colors.WHITE);
    }

    // Draw dialog boxes
    gui.draw();
}

function saveGame() {
    // TODO: JSON.stringify does not support prototypes and circular references
    // Investigate Cryo: https://github.com/hunterloftis/cryo
}

function loadGame() {
    // TODO
    if (!player) {
        return;
    }
    appState = 'game';
}

function newGame() {
    rng = new wglt.RNG(Date.now());
    player = new Entity(40, 25, '@', 'player', wglt.Colors.WHITE, true, { fighter: new Fighter(100, 1, 4, 0, playerDeath) });
    player.level = 1;
    entities = [player];
    messages = [];
    dungeonLevel = 1;
    map = createMap();
    fovMap = new wglt.FovMap(MAP_WIDTH, MAP_HEIGHT, (x, y) => map[y][x].blocked);
    fovRecompute = true;
    inventory = [];
    addMessage('Welcome stranger! Prepare to perish!', wglt.Colors.DARK_RED);

    // Initial equipment: a dagger
    const dagger = new Entity(0, 0, '-', 'dagger', wglt.Colors.LIGHT_CYAN, false, {
        equipment: new Equipment('right hand', 2, 0, 0),
        item: new Item()
    });
    inventory.push(dagger);
    dagger.equipment.equip();

    appState = 'game';
}

function nextLevel() {
    // Advance to the next level
    addMessage('You take a moment to rest, and recover your strength.', wglt.Colors.LIGHT_MAGENTA);
    player.fighter.heal(player.fighter.maxHp / 2); // heal the player by 50%
    dungeonLevel++;
    addMessage('After a rare moment of peace, you descend deeper...', wglt.Colors.LIGHT_RED);
    entities = [player];
    map = createMap(); // Create a fresh new level!
    fovMap = new wglt.FovMap(MAP_WIDTH, MAP_HEIGHT, (x, y) => map[y][x].blocked);
    fovRecompute = true;
}

function playGame() {
    handleKeys();
    renderAll();
}

function mainMenu() {
    if (gui.dialogs.length === 0) {
        const options = ['Play a new game', 'Continue last game'];
        gui.add(new wglt.SelectDialog(term, 'MAIN MENU', options, (choice) => {
            if (choice === 0) {
                newGame();
            } else if (choice === 1) {
                loadGame();
            }
        }));
    }

    gui.handleInput();

    term.clear();

    if (menuBg) {
        term.drawConsole(0, 0, menuBg, 0, 0, 80, 50);
    }

    term.drawCenteredString(40, 10, 'TOMBS OF THE ANCIENT KINGS', wglt.Colors.YELLOW);
    term.drawCenteredString(40, 12, 'By Jotaf', wglt.Colors.YELLOW);
    gui.draw();
}

const term = new wglt.Terminal(document.querySelector('canvas'), SCREEN_WIDTH, SCREEN_HEIGHT);
const gui = new wglt.GUI(term);
let rng = null;
let player = null;
let stairs = null;
let entities = null;
let messages = null;
let dungeonLevel = 0;
let map = null;
let fovMap = null;
let fovRecompute = true;
let inventory = null;
let targetFunction = null;
let targetCursor = { x: 0, y: 0 };
let appState = 'menu';
let menuBg = null;

wglt.loadImage2x('menu.png', (result) => { menuBg = result });

term.update = function () {
    switch (appState) {
        case 'menu':
            mainMenu();
            break;

        case 'game':
            playGame();
            break;
    }
};
