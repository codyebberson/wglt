"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var colors_1 = require("../../src/colors");
var console_1 = require("../../src/console");
var color_1 = require("../../src/color");
var gui_1 = require("../../src/gui");
var keys_1 = require("../../src/keys");
var image_1 = require("../../src/image");
var messagedialog_1 = require("../../src/gui/messagedialog");
var rect_1 = require("../../src/rect");
var rng_1 = require("../../src/rng");
var selectdialog_1 = require("../../src/gui/selectdialog");
var terminal_1 = require("../../src/terminal");
// Actual size of the window
var SCREEN_WIDTH = 80;
var SCREEN_HEIGHT = 45;
// Size of the map
var MAP_WIDTH = 80;
var MAP_HEIGHT = 43;
// Sizes and coordinates relevant for the GUI
var BAR_WIDTH = 20;
var PANEL_HEIGHT = 7;
var PANEL_Y = SCREEN_HEIGHT - PANEL_HEIGHT;
var MSG_X = BAR_WIDTH + 2;
var MSG_WIDTH = SCREEN_WIDTH - BAR_WIDTH - 2;
var MSG_HEIGHT = PANEL_HEIGHT - 1;
// Parameters for dungeon generator
var ROOM_MAX_SIZE = 10;
var ROOM_MIN_SIZE = 6;
var MAX_ROOMS = 30;
var TORCH_RADIUS = 10;
// Spell values
var HEAL_AMOUNT = 4;
var LIGHTNING_DAMAGE = 20;
var LIGHTNING_RANGE = 5;
var CONFUSE_RANGE = 8;
var CONFUSE_NUM_TURNS = 10;
var FIREBALL_RANGE = 10;
var FIREBALL_RADIUS = 3;
var FIREBALL_DAMAGE = 12;
// Experience and level-ups
var LEVEL_UP_BASE = 200;
var LEVEL_UP_FACTOR = 150;
var COLOR_DARK_WALL = color_1.fromRgb(0, 0, 100);
var COLOR_LIGHT_WALL = color_1.fromRgb(130, 110, 50);
var COLOR_DARK_GROUND = color_1.fromRgb(50, 50, 150);
var COLOR_LIGHT_GROUND = color_1.fromRgb(200, 180, 50);
var Entity = /** @class */ (function () {
    function Entity(x, y, char, name, color, blocks, components) {
        this.x = x;
        this.y = y;
        this.char = char;
        this.name = name;
        this.color = color;
        this.blocks = !!blocks;
        if (components) {
            if ('fighter' in components) {
                this.fighter = components.fighter;
                this.fighter.owner = this;
            }
            if ('ai' in components) {
                this.ai = components.ai;
                this.ai.owner = this;
            }
            if ('item' in components) {
                this.item = components.item;
                this.item.owner = this;
            }
        }
    }
    Entity.prototype.move = function (dx, dy) {
        if (isBlocked(this.x + dx, this.y + dy)) {
            return;
        }
        this.x += dx;
        this.y += dy;
    };
    Entity.prototype.moveToward = function (targetX, targetY) {
        var dx = targetX - this.x;
        var dy = targetY - this.y;
        var distance = Math.hypot(dx, dy);
        this.move(Math.round(dx / distance), Math.round(dy / distance));
    };
    Entity.prototype.distanceTo = function (other) {
        return Math.hypot(other.x - this.x, other.y - this.y);
    };
    Entity.prototype.distance = function (x, y) {
        return Math.hypot(x - this.x, y - this.y);
    };
    Entity.prototype.sendToBack = function () {
        this.remove();
        entities.unshift(this);
    };
    Entity.prototype.remove = function () {
        entities.splice(entities.indexOf(this), 1);
    };
    Entity.prototype.draw = function () {
        if (map.isVisible(this.x, this.y)) {
            term.drawString(this.x, this.y, this.char, this.color);
        }
    };
    return Entity;
}());
var Fighter = /** @class */ (function () {
    function Fighter(hp, defense, power, xp, deathFunction) {
        this.owner = undefined;
        this.maxHp = hp;
        this.defense = defense;
        this.power = power;
        this.hp = hp;
        this.xp = xp;
        this.deathFunction = deathFunction || null;
    }
    Fighter.prototype.attack = function (target) {
        if (!this.owner || !target.fighter) {
            return;
        }
        var damage = this.power - target.fighter.defense;
        if (damage > 0) {
            addMessage(capitalize(this.owner.name) + ' attacks ' + target.name + ' for ' + damage + ' hit points.');
            target.fighter.takeDamage(damage);
        }
        else {
            addMessage(capitalize(this.owner.name) + ' attacks ' + target.name + ' but it has no effect!');
        }
    };
    Fighter.prototype.takeDamage = function (damage) {
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
            if (this.owner !== player) {
                player.fighter.xp += this.xp;
                checkLevelUp();
            }
        }
    };
    Fighter.prototype.heal = function (amount) {
        this.hp = Math.min(this.hp + amount, this.maxHp);
    };
    return Fighter;
}());
var BasicMonster = /** @class */ (function () {
    function BasicMonster() {
        this.owner = undefined;
    }
    BasicMonster.prototype.takeTurn = function () {
        if (!player.fighter) {
            return;
        }
        var monster = this.owner;
        if (!monster || !monster.fighter) {
            return;
        }
        // A basic monster takes its turn. if you can see it, it can see you
        if (map.isVisible(monster.x, monster.y)) {
            if (monster.distanceTo(player) >= 2) {
                // Move towards player if far away
                monster.moveToward(player.x, player.y);
            }
            else if (player.fighter.hp > 0) {
                // Close enough, attack! (if the player is still alive.)
                monster.fighter.attack(player);
            }
        }
    };
    return BasicMonster;
}());
var ConfusedMonster = /** @class */ (function () {
    function ConfusedMonster(oldAi) {
        this.owner = undefined;
        this.oldAi = oldAi;
        this.numTurns = CONFUSE_NUM_TURNS;
    }
    ConfusedMonster.prototype.takeTurn = function () {
        if (!this.owner) {
            return;
        }
        if (this.numTurns > 0) {
            // Still confused...
            // Move in a random direction, and decrease the number of turns confused
            this.owner.move(rng.nextRange(-1, 1), rng.nextRange(-1, 1));
            this.numTurns--;
        }
        else {
            this.owner.ai = this.oldAi;
            addMessage('The ' + this.owner.name + ' is no longer confused!', colors_1.Colors.LIGHT_RED);
        }
    };
    return ConfusedMonster;
}());
var Item = /** @class */ (function () {
    function Item(useFunction) {
        this.useFunction = useFunction;
    }
    Item.prototype.pickUp = function () {
        if (!this.owner) {
            return;
        }
        if (inventory.length >= 26) {
            addMessage('Your inventory is full, cannot pick up ' + this.owner.name + '.', colors_1.Colors.LIGHT_RED);
        }
        else {
            inventory.push(this.owner);
            this.owner.remove();
            addMessage('You picked up a ' + this.owner.name + '!', colors_1.Colors.LIGHT_GREEN);
        }
    };
    Item.prototype.use = function () {
        if (!this.owner) {
            return;
        }
        if (this.useFunction) {
            this.useFunction(this);
        }
        else {
            addMessage('The ' + this.owner.name + ' cannot be used.');
        }
    };
    Item.prototype.remove = function () {
        if (!this.owner) {
            return;
        }
        inventory.splice(inventory.indexOf(this.owner), 1);
    };
    return Item;
}());
function isBlocked(x, y) {
    // First test the map tile
    if (map.grid[y][x].blocked) {
        return true;
    }
    // Now check for any blocking objects
    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        if (entity.blocks && entity.x === x && entity.y === y) {
            return true;
        }
    }
    return false;
}
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
            // Add some contents to this room, such as monsters
            placeObjects(newRoom);
            // Finally, append the new room to the list
            rooms.push(newRoom);
        }
    }
    // Create stairs at the center of the last room
    var stairsLoc = rooms[rooms.length - 1].getCenter();
    stairs = new Entity(stairsLoc.x, stairsLoc.y, '<', 'stairs', colors_1.Colors.WHITE);
    entities.push(stairs);
    stairs.sendToBack();
    return map;
}
function fromDungeonLevel(table) {
    // Returns a value that depends on level.
    // The table specifies what value occurs after each level, default is 0.
    for (var i = 0; i < table.length; i++) {
        var value = table[i][0];
        var level = table[i][1];
        if (dungeonLevel >= level) {
            return value;
        }
    }
    return 0;
}
function placeObjects(room) {
    // This is where we decide the chance of each monster or item appearing.
    // Maximum number of monsters per room
    var maxMonsters = fromDungeonLevel([[2, 1], [3, 4], [5, 6]]);
    // Chance of each monster
    var monsterChances = {
        'orc': 80,
        'troll': fromDungeonLevel([[15, 3], [30, 5], [60, 7]])
    };
    // Maximum number of items per room
    var maxItems = fromDungeonLevel([[1, 1], [2, 4]]);
    // Chance of each item (by default they have a chance of 0 at level 1, which then goes up)
    var itemChances = {
        'heal': 35,
        'lightning': fromDungeonLevel([[25, 4]]),
        'fireball': fromDungeonLevel([[25, 6]]),
        'confuse': fromDungeonLevel([[10, 2]])
    };
    // Choose random number of monsters
    var numMonsters = rng.nextRange(0, maxMonsters + 1);
    for (var i = 0; i < numMonsters; i++) {
        // Choose random spot for this monster
        var x = rng.nextRange(room.x + 1, room.x2 - 1);
        var y = rng.nextRange(room.y + 1, room.y2 - 1);
        var monster = null;
        var choice = rng.chooseKey(monsterChances);
        if (choice === 'orc') {
            var fighter = new Fighter(20, 0, 4, 35, monsterDeath);
            var ai = new BasicMonster();
            monster = new Entity(x, y, 'o', 'orc', colors_1.Colors.LIGHT_GREEN, true, { fighter: fighter, ai: ai });
        }
        else if (choice === 'troll') {
            var fighter = new Fighter(30, 2, 8, 100, monsterDeath);
            var ai = new BasicMonster();
            monster = new Entity(x, y, 'T', 'troll', colors_1.Colors.DARK_GREEN, true, { fighter: fighter, ai: ai });
        }
        entities.push(monster);
    }
    // Choose random number of items
    var numItems = rng.nextRange(0, maxItems + 1);
    for (var i = 0; i < numItems; i++) {
        // Choose random spot for this item
        var x = rng.nextRange(room.x + 1, room.x2 - 1);
        var y = rng.nextRange(room.y + 1, room.y2 - 1);
        var item = null;
        var choice = rng.chooseKey(itemChances);
        if (choice === 'heal') {
            // Create a healing potion
            item = new Entity(x, y, '!', 'healing potion', colors_1.Colors.DARK_MAGENTA, false, { item: new Item(castHeal) });
        }
        else if (choice === 'lightning') {
            // Create a lightning bolt scroll
            item = new Entity(x, y, '#', 'scroll of lightning bolt', colors_1.Colors.YELLOW, false, { item: new Item(castLightning) });
        }
        else if (choice === 'fireball') {
            // Create a fireball scroll
            item = new Entity(x, y, '#', 'scroll of fireball', colors_1.Colors.YELLOW, false, { item: new Item(castFireball) });
        }
        else if (choice === 'confuse') {
            // Create a confuse scroll
            item = new Entity(x, y, '#', 'scroll of confusion', colors_1.Colors.YELLOW, false, { item: new Item(castConfuse) });
        }
        entities.push(item);
        item.sendToBack(); // items appear below other objects
    }
}
function renderBar(x, y, totalWidth, name, value, maximum, barColor, backColor) {
    // Render a bar (HP, experience, etc). first calculate the width of the bar
    var barWidth = Math.round(value / maximum * totalWidth);
    // Render the background first
    term.fillRect(x, y, totalWidth, 1, 0, 0, backColor);
    // Now render the bar on top
    if (barWidth > 0) {
        term.fillRect(x, y, barWidth, 1, 0, 0, barColor);
    }
    // Finally, some centered text with the values
    // term.fillForegroundRect(x, y, totalWidth, 1, Colors.WHITE);
    term.drawCenteredString(x + totalWidth / 2, y, name + ': ' + value + '/' + maximum, colors_1.Colors.WHITE);
}
function getNamesUnderMouse() {
    var x = term.mouse.x;
    var y = term.mouse.y;
    if (!map.isVisible(x, y)) {
        return '';
    }
    var names = [];
    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
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
    messages.push({ text: msg, color: (opt_color || colors_1.Colors.WHITE) });
}
function capitalize(str) {
    if (!str) {
        return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function playerMoveOrAttack(dx, dy) {
    var x = player.x + dx;
    var y = player.y + dy;
    var target = null;
    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        if (entity.fighter && entity.x === x && entity.y === y) {
            target = entity;
            break;
        }
    }
    if (target) {
        player.fighter.attack(target);
    }
    else {
        player.move(dx, dy);
        fovRecompute = true;
    }
    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        if (entity.ai) {
            entity.ai.takeTurn();
        }
    }
}
function handleKeys() {
    if (!player.fighter || player.fighter.hp <= 0) {
        return;
    }
    if (gui.handleInput()) {
        return;
    }
    if (targetFunction) {
        if (term.isKeyPressed(keys_1.Keys.VK_ENTER) || term.mouse.buttons[0].isClicked()) {
            endTargeting(targetCursor.x, targetCursor.y);
        }
        if (term.isKeyPressed(keys_1.Keys.VK_ESCAPE) || term.mouse.buttons[2].isClicked()) {
            cancelTargeting();
        }
        if (term.isKeyPressed(keys_1.Keys.VK_UP)) {
            targetCursor.y--;
        }
        if (term.isKeyPressed(keys_1.Keys.VK_LEFT)) {
            targetCursor.x--;
        }
        if (term.isKeyPressed(keys_1.Keys.VK_RIGHT)) {
            targetCursor.x++;
        }
        if (term.isKeyPressed(keys_1.Keys.VK_DOWN)) {
            targetCursor.y++;
        }
        if (term.mouse.dx !== 0 || term.mouse.dy !== 0) {
            targetCursor.x = term.mouse.x;
            targetCursor.y = term.mouse.y;
        }
        return;
    }
    if (term.isKeyPressed(keys_1.Keys.VK_ESCAPE)) {
        saveGame();
        appState = 'menu';
    }
    if (term.isKeyPressed(keys_1.Keys.VK_UP)) {
        playerMoveOrAttack(0, -1);
    }
    if (term.isKeyPressed(keys_1.Keys.VK_LEFT)) {
        playerMoveOrAttack(-1, 0);
    }
    if (term.isKeyPressed(keys_1.Keys.VK_RIGHT)) {
        playerMoveOrAttack(1, 0);
    }
    if (term.isKeyPressed(keys_1.Keys.VK_DOWN)) {
        playerMoveOrAttack(0, 1);
    }
    if (term.isKeyPressed(keys_1.Keys.VK_G)) {
        // Pick up an item
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            if (entity.x === player.x && entity.y === player.y && entity.item) {
                entity.item.pickUp();
            }
        }
    }
    if (term.isKeyPressed(keys_1.Keys.VK_I)) {
        if (inventory.length === 0) {
            gui.add(new messagedialog_1.MessageDialog('ALERT', 'Inventory is empty'));
        }
        else {
            var options = inventory.map(function (item) { return item.name; });
            gui.add(new selectdialog_1.SelectDialog('INVENTORY', options, useInventory));
        }
    }
    if (term.isKeyPressed(keys_1.Keys.VK_C)) {
        var levelUpXp = LEVEL_UP_BASE + player.level * LEVEL_UP_FACTOR;
        gui.add(new messagedialog_1.MessageDialog('CHARACTER', 'Level: ' + player.level +
            '\nExperience: ' + player.fighter.xp +
            '\nExperience to level up: ' + levelUpXp +
            '\n\nMaximum HP: ' + player.fighter.maxHp +
            '\nAttack: ' + player.fighter.power +
            '\nDefense: ' + player.fighter.defense));
    }
    if (term.isKeyPressed(keys_1.Keys.VK_COMMA)) {
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
    var levelUpXp = LEVEL_UP_BASE + player.level * LEVEL_UP_FACTOR;
    if (player.fighter.xp >= levelUpXp) {
        player.level++;
        player.fighter.xp -= levelUpXp;
        addMessage('Your battle skills grow stronger! You reached level ' + player.level + '!', colors_1.Colors.YELLOW);
        var options = [
            'Constitution (+20 HP, from ' + player.fighter.maxHp + ')',
            'Strength (+1 attack, from ' + player.fighter.power + ')',
            'Agility (+1 defense, from ' + player.fighter.defense + ')'
        ];
        gui.add(new selectdialog_1.SelectDialog('LEVEL UP', options, function (choice) {
            if (choice === 0) {
                player.fighter.maxHp += 20;
                player.fighter.hp += 20;
            }
            else if (choice === 1) {
                player.fighter.power += 1;
            }
            else if (choice === 2) {
                player.fighter.defense += 1;
            }
        }));
    }
}
function playerDeath(player) {
    addMessage('You died!', colors_1.Colors.LIGHT_RED);
}
function monsterDeath(monster) {
    addMessage(capitalize(monster.name) + ' is dead! You gain ' + monster.fighter.xp + ' XP.', colors_1.Colors.ORANGE);
    monster.char = '%';
    monster.color = colors_1.Colors.DARK_RED;
    monster.blocks = false;
    monster.fighter = undefined;
    monster.ai = undefined;
    monster.name = 'remains of ' + monster.name;
    monster.sendToBack();
}
function getClosestMonster(x, y, range) {
    var minDist = range + 1;
    var result = null;
    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        if (entity.fighter && entity !== player) {
            var dist = entity.distance(x, y);
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
    if (!player.fighter) {
        return;
    }
    // Heal the player
    if (player.fighter.hp === player.fighter.maxHp) {
        addMessage('You are already at full health.', colors_1.Colors.DARK_RED);
        return;
    }
    addMessage('Your wounds start to feel better!', colors_1.Colors.LIGHT_MAGENTA);
    player.fighter.heal(HEAL_AMOUNT);
    item.remove();
}
function castLightning(item) {
    // Find closest enemy (inside a maximum range) and damage it
    var monster = getClosestMonster(player.x, player.y, LIGHTNING_RANGE);
    if (!monster) {
        addMessage('No enemy is close enough to strike.', colors_1.Colors.LIGHT_RED);
        return;
    }
    // Zap it!
    addMessage('A lightning bolt strikes the ' + monster.name + ' with a loud thunder!', colors_1.Colors.LIGHT_BLUE);
    addMessage('The damage is ' + LIGHTNING_DAMAGE + ' hit points', colors_1.Colors.LIGHT_BLUE);
    monster.fighter.takeDamage(LIGHTNING_DAMAGE);
    item.remove();
}
function castFireball(item) {
    // Ask the player for a target tile to throw a fireball at
    addMessage('Left-click to cast fireball, or right-click to cancel.', colors_1.Colors.LIGHT_CYAN);
    startTargeting(function (x, y) {
        if (player.distance(x, y) > FIREBALL_RANGE) {
            addMessage('Target out of range.', colors_1.Colors.LIGHT_GRAY);
            return;
        }
        addMessage('The fireball explodes, burning everything within ' + FIREBALL_RADIUS + ' tiles!', colors_1.Colors.ORANGE);
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            if (entity.fighter && entity.distance(x, y) <= FIREBALL_RADIUS) {
                addMessage('The ' + entity.name + ' gets burned for ' + FIREBALL_DAMAGE + ' hit points.', colors_1.Colors.ORANGE);
                entity.fighter.takeDamage(FIREBALL_DAMAGE);
            }
        }
        item.remove();
    });
}
function castConfuse(item) {
    // Ask the player for a target to confuse
    addMessage('Left-click to cast confuse, or right-click to cancel.', colors_1.Colors.LIGHT_CYAN);
    startTargeting(function (x, y) {
        if (player.distance(x, y) > CONFUSE_RANGE) {
            addMessage('Target out of range.', colors_1.Colors.LIGHT_GRAY);
            return;
        }
        var monster = getMonsterAt(x, y);
        if (!monster) {
            addMessage('No monster there.', colors_1.Colors.LIGHT_GRAY);
            return;
        }
        monster.ai = new ConfusedMonster(monster.ai);
        monster.ai.owner = monster;
        addMessage('The eyes of the ' + monster.name + ' look vacant, as he stumbles around!', colors_1.Colors.LIGHT_GREEN);
        item.remove();
    });
}
function startTargeting(callback) {
    targetFunction = callback;
    targetCursor.x = player.x;
    targetCursor.y = player.y;
}
function endTargeting(x, y) {
    if (targetFunction) {
        targetFunction(x, y);
        cancelTargeting();
    }
}
function cancelTargeting() {
    targetFunction = undefined;
}
function renderAll() {
    if (fovRecompute) {
        map.computeFov(player.x, player.y, TORCH_RADIUS);
        fovRecompute = false;
    }
    for (var y_1 = 0; y_1 < MAP_HEIGHT; y_1++) {
        for (var x = 0; x < MAP_WIDTH; x++) {
            var visible = map.isVisible(x, y_1);
            var wall = map.grid[y_1][x].blockedSight;
            var color = colors_1.Colors.BLACK;
            if (visible) {
                // It's visible
                color = wall ? COLOR_LIGHT_WALL : COLOR_LIGHT_GROUND;
                map.grid[y_1][x].explored = true;
            }
            else if (map.grid[y_1][x].explored) {
                // It's remembered
                color = wall ? COLOR_DARK_WALL : COLOR_DARK_GROUND;
            }
            term.drawChar(x, y_1, 0, 0, color);
        }
    }
    for (var i = 0; i < entities.length; i++) {
        entities[i].draw();
    }
    // Prepare to render the GUI panel
    term.fillRect(0, PANEL_Y, SCREEN_WIDTH, PANEL_HEIGHT, 0, colors_1.Colors.WHITE, colors_1.Colors.BLACK);
    // Print the game messages, one line at a time
    var y = PANEL_Y + 1;
    for (var i = 0; i < messages.length; i++) {
        var message = messages[i];
        term.drawString(MSG_X, y, message.text, message.color);
        y++;
    }
    // Show the player's stats
    renderBar(1, PANEL_Y + 1, BAR_WIDTH, 'HP', player.fighter.hp, player.fighter.maxHp, colors_1.Colors.LIGHT_RED, colors_1.Colors.DARK_RED);
    renderBar(1, PANEL_Y + 2, BAR_WIDTH, 'XP', player.fighter.xp, LEVEL_UP_BASE + player.level * LEVEL_UP_FACTOR, colors_1.Colors.LIGHT_MAGENTA, colors_1.Colors.DARK_MAGENTA);
    term.drawString(1, PANEL_Y + 4, 'Dungeon level ' + dungeonLevel, colors_1.Colors.ORANGE);
    // Display names of objects under the mouse
    term.drawString(1, PANEL_Y, getNamesUnderMouse(), colors_1.Colors.LIGHT_GRAY);
    if (targetFunction) {
        var targetCell = term.getCell(targetCursor.x, targetCursor.y);
        if (targetCell) {
            targetCell.setBackground(colors_1.Colors.WHITE);
        }
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
    rng = new rng_1.RNG(Date.now());
    player = new Entity(40, 25, '@', 'player', colors_1.Colors.WHITE, true, { fighter: new Fighter(100, 1, 4, 0, playerDeath) });
    player.level = 1;
    entities = [player];
    messages = [];
    dungeonLevel = 1;
    map = createMap();
    fovRecompute = true;
    inventory = [];
    addMessage('Welcome stranger! Prepare to perish!', colors_1.Colors.DARK_RED);
    appState = 'game';
}
function nextLevel() {
    // Advance to the next level
    addMessage('You take a moment to rest, and recover your strength.', colors_1.Colors.LIGHT_MAGENTA);
    player.fighter.heal(player.fighter.maxHp / 2); // heal the player by 50%
    dungeonLevel++;
    addMessage('After a rare moment of peace, you descend deeper...', colors_1.Colors.LIGHT_RED);
    entities = [player];
    map = createMap(); // Create a fresh new level!
    fovRecompute = true;
}
function playGame() {
    handleKeys();
    renderAll();
}
function mainMenu() {
    if (gui.dialogs.length === 0) {
        var options = ['Play a new game', 'Continue last game'];
        gui.add(new selectdialog_1.SelectDialog('MAIN MENU', options, function (choice) {
            if (choice === 0) {
                newGame();
            }
            else if (choice === 1) {
                loadGame();
            }
        }));
    }
    gui.handleInput();
    term.clear();
    if (menuBg) {
        term.drawConsole(0, 0, menuBg, 0, 0, 80, 50);
    }
    term.drawCenteredString(40, 10, 'TOMBS OF THE ANCIENT KINGS', colors_1.Colors.YELLOW);
    term.drawCenteredString(40, 12, 'By Jotaf', colors_1.Colors.YELLOW);
    gui.draw();
}
var term = new terminal_1.Terminal(document.querySelector('canvas'), SCREEN_WIDTH, SCREEN_HEIGHT);
var gui = new gui_1.GUI(term);
var rng = null;
var player = null;
var stairs = null;
var entities = null;
var messages = null;
var dungeonLevel = 0;
var map = null;
var fovRecompute = true;
var inventory = null;
var targetFunction = undefined;
var targetCursor = { x: 0, y: 0 };
var appState = 'menu';
var menuBg = null;
image_1.loadImage2x('menu.png', function (result) { menuBg = result; });
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
