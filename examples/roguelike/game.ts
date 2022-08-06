import { Key } from '../../src';
import { Cell } from '../../src/cell';
import { Color, fromRgb } from '../../src/color';
import { Console } from '../../src/console';
import { MessageDialog } from '../../src/gui/messagedialog';
import { SelectDialog } from '../../src/gui/selectdialog';
import { Colors } from '../../src/palettes/colors';
import { computePath } from '../../src/path';
import { Rect } from '../../src/rect';
import { RNG } from '../../src/rng';
import { Actor } from './actor';
import { AI, BasicMonster, ConfusedMonster } from './ai';
import { App, AppState } from './app';
import { Entity } from './entity';
import { Item } from './item';

// Actual size of the window
const SCREEN_WIDTH = 80;
const SCREEN_HEIGHT = 45;

// Size of the map
const MAP_WIDTH = 80;
const MAP_HEIGHT = 39;

// Sizes and coordinates relevant for the GUI
const BAR_WIDTH = 20;
const PANEL_HEIGHT = 7;
const PANEL_Y = SCREEN_HEIGHT - PANEL_HEIGHT;
const MSG_X = BAR_WIDTH + 2;
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
const FIREBALL_RANGE = 10;
const FIREBALL_RADIUS = 3;
const FIREBALL_DAMAGE = 12;

// Experience and level-ups
const LEVEL_UP_BASE = 200;
const LEVEL_UP_FACTOR = 150;

const COLOR_DARK_WALL = fromRgb(0, 0, 100);
const COLOR_LIGHT_WALL = fromRgb(130, 110, 50);
const COLOR_DARK_GROUND = fromRgb(50, 50, 150);
const COLOR_LIGHT_GROUND = fromRgb(200, 180, 50);

export class Game implements AppState {
  readonly app: App;
  readonly rng: RNG;
  readonly player: Actor;
  readonly messages: { text: string; color: Color }[];
  stairs?: Entity;
  entities: Entity[];
  level: number;
  map: Console;
  fovRecompute: boolean;
  targetCursor: { x: number; y: number };
  targetFunction: ((x: number, y: number) => void) | undefined;
  path?: Cell[];
  pathIndex: number;
  pathWalking: boolean;

  constructor(app: App) {
    this.app = app;
    this.rng = new RNG(Date.now());
    this.player = new Actor(this, 40, 25, '@', 'Player', Colors.WHITE);
    this.player.level = 1;
    this.player.hp = 100;
    this.player.baseMaxHp = 100;
    this.player.baseDefense = 1;
    this.player.basePower = 4;
    this.entities = [this.player];
    this.messages = [];
    this.level = 1;
    this.map = this.createMap();
    this.fovRecompute = true;
    this.targetCursor = { x: 0, y: 0 };
    this.pathIndex = 0;
    this.pathWalking = false;
    this.addMessage('Welcome stranger! Prepare to perish!', Colors.DARK_RED);

    // Initial equipment: a dagger
    const dagger = new Item(this, 0, 0, '-', 'Dagger', Colors.LIGHT_CYAN);
    dagger.slot = 'right hand';
    dagger.powerBonus = 2;
    this.player.inventory.push(dagger);
    this.player.equip(dagger);
  }

  isBlocked(x: number, y: number): boolean {
    // First test the map tile
    if (this.map.grid[y][x].blocked) {
      return true;
    }

    // Now check for any blocking objects
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];
      if (entity.blocks && entity.x === x && entity.y === y) {
        return true;
      }
    }

    return false;
  }

  createRoom(map: Console, room: Rect): void {
    for (let y = room.y + 1; y < room.y2; y++) {
      for (let x = room.x + 1; x < room.x2; x++) {
        map.grid[y][x].blocked = false;
        map.grid[y][x].blockedSight = false;
      }
    }
  }

  createHTunnel(map: Console, x1: number, x2: number, y: number): void {
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      map.grid[y][x].blocked = false;
      map.grid[y][x].blockedSight = false;
    }
  }

  createVTunnel(map: Console, y1: number, y2: number, x: number): void {
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
      map.grid[y][x].blocked = false;
      map.grid[y][x].blockedSight = false;
    }
  }

  createMap(): Console {
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
      const w = this.rng.nextRange(ROOM_MIN_SIZE, ROOM_MAX_SIZE);
      const h = this.rng.nextRange(ROOM_MIN_SIZE, ROOM_MAX_SIZE);

      // Random position without going out of the boundaries of the map
      const x = this.rng.nextRange(0, MAP_WIDTH - w - 1);
      const y = this.rng.nextRange(0, MAP_HEIGHT - h - 1);

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
        this.createRoom(map, newRoom);

        // Center coordinates of new room, will be useful later
        const center = newRoom.getCenter();

        if (rooms.length === 0) {
          // This is the first room, where the player starts at
          this.player.x = center.x;
          this.player.y = center.y;
        } else {
          // All rooms after the first:
          // Connect it to the previous room with a tunnel

          // Center coordinates of previous room
          const prev = rooms[rooms.length - 1].getCenter();

          // Draw a coin (random number that is either 0 or 1)
          if (this.rng.nextRange(0, 1) === 1) {
            // First move horizontally, then vertically
            this.createHTunnel(map, prev.x, center.x, prev.y);
            this.createVTunnel(map, prev.y, center.y, center.x);
          } else {
            // First move vertically, then horizontally
            this.createVTunnel(map, prev.y, center.y, prev.x);
            this.createHTunnel(map, prev.x, center.x, center.y);
          }
        }

        if (r > 0) {
          // Add some contents to this room, such as monsters
          this.placeObjects(newRoom);
        }

        // Finally, append the new room to the list
        rooms.push(newRoom);
      }
    }

    // Create stairs at the center of the last room
    const stairsLoc = rooms[rooms.length - 1].getCenter();
    this.stairs = new Entity(this, stairsLoc.x, stairsLoc.y, '<', 'Stairs', Colors.WHITE);
    this.entities.push(this.stairs);
    this.stairs.sendToBack();
    return map;
  }

  fromDungeonLevel(table: number[][]): number {
    // Returns a value that depends on level.
    // The table specifies what value occurs after each level, default is 0.
    for (let i = 0; i < table.length; i++) {
      const value = table[i][0];
      const level = table[i][1];
      if (this.level >= level) {
        return value;
      }
    }
    return 0;
  }

  placeObjects(room: Rect): void {
    // This is where we decide the chance of each monster or item appearing.

    // Maximum number of monsters per room
    const maxMonsters = this.fromDungeonLevel([
      [1, 1],
      [2, 2],
      [3, 4],
      [5, 6],
    ]);

    // Chance of each monster
    const monsterChances = {
      orc: 80, // orc always shows up, even if all other monsters have 0 chance
      troll: this.fromDungeonLevel([
        [15, 3],
        [30, 5],
        [60, 7],
      ]),
    };

    // Maximum number of items per room
    const maxItems = this.fromDungeonLevel([
      [1, 1],
      [2, 4],
    ]);

    // Chance of each item (by default they have a chance of 0 at level 1, which then goes up)
    const itemChances = {
      heal: 35, // healing potion always shows up, even if all other items have 0 chance
      lightning: this.fromDungeonLevel([[25, 4]]),
      fireball: this.fromDungeonLevel([[25, 6]]),
      confuse: this.fromDungeonLevel([[10, 2]]),
      sword: this.fromDungeonLevel([[5, 4]]),
      shield: this.fromDungeonLevel([[15, 8]]),
    };

    // Choose random number of monsters
    const numMonsters = this.rng.nextRange(0, maxMonsters + 1);

    for (let i = 0; i < numMonsters; i++) {
      // Choose random spot for this monster
      const x = this.rng.nextRange(room.x + 1, room.x2 - 1);
      const y = this.rng.nextRange(room.y + 1, room.y2 - 1);
      let monster = null;

      const choice = this.rng.chooseKey(monsterChances);
      if (choice === 'orc') {
        monster = new Actor(this, x, y, 'o', 'Orc', Colors.LIGHT_GREEN);
        monster.hp = 20;
        monster.baseDefense = 0;
        monster.basePower = 4;
        monster.xp = 35;
        monster.setAi(new BasicMonster());
      } else if (choice === 'troll') {
        monster = new Actor(this, x, y, 'T', 'Troll', Colors.DARK_GREEN);
        monster.hp = 30;
        monster.baseDefense = 2;
        monster.basePower = 8;
        monster.xp = 100;
        monster.setAi(new BasicMonster());
      }

      if (monster) {
        this.entities.push(monster);
      }
    }

    // Choose random number of items
    const numItems = this.rng.nextRange(0, maxItems + 1);

    for (let i = 0; i < numItems; i++) {
      // Choose random spot for this item
      const x = this.rng.nextRange(room.x + 1, room.x2 - 1);
      const y = this.rng.nextRange(room.y + 1, room.y2 - 1);
      let item = null;

      const choice = this.rng.chooseKey(itemChances);
      if (choice === 'heal') {
        // Create a healing potion
        item = new Item(this, x, y, '!', 'Healing Potion', Colors.DARK_MAGENTA);
        item.useFunction = (item) => this.castHeal(item);
      } else if (choice === 'lightning') {
        // Create a lightning bolt scroll
        item = new Item(this, x, y, '#', 'Scroll of Lightning Bolt', Colors.YELLOW);
        item.useFunction = (item) => this.castLightning(item);
      } else if (choice === 'fireball') {
        // Create a fireball scroll
        item = new Item(this, x, y, '#', 'Scroll of Fireball', Colors.YELLOW);
        item.useFunction = (item) => this.castFireball(item);
      } else if (choice === 'confuse') {
        // Create a confuse scroll
        item = new Item(this, x, y, '#', 'Scroll of Confusion', Colors.YELLOW);
        item.useFunction = (item) => this.castConfuse(item);
      } else if (choice === 'sword') {
        // Create a sword
        item = new Item(this, x, y, '/', 'Sword', Colors.LIGHT_CYAN);
        item.useFunction = (item) => this.player.equip(item);
      } else if (choice === 'shield') {
        // Create a shield
        item = new Item(this, x, y, '[', 'Shield', Colors.BROWN);
        item.useFunction = (item) => this.player.equip(item);
      }

      if (item) {
        this.entities.push(item);
        item.sendToBack(); // items appear below other objects
      }
    }
  }

  renderBar(
    x: number,
    y: number,
    totalWidth: number,
    name: string,
    value: number,
    maximum: number,
    barColor: Color,
    backColor: Color
  ): void {
    // Render a bar (HP, experience, etc). first calculate the width of the bar
    const barWidth = Math.round((value / maximum) * totalWidth);

    // Render the background first
    this.app.term.fillRect(x, y, totalWidth, 1, 0, 0, backColor);

    // Now render the bar on top
    if (barWidth > 0) {
      this.app.term.fillRect(x, y, barWidth, 1, 0, 0, barColor);
    }

    // Finally, some centered text with the values
    this.app.term.drawCenteredString(x + totalWidth / 2, y, name + ': ' + value + '/' + maximum, Colors.WHITE);
  }

  getNamesUnderMouse(): string {
    const x = this.app.term.mouse.x;
    const y = this.app.term.mouse.y;

    if (!this.map.isVisible(x, y)) {
      return '';
    }

    const names = [];

    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];
      if (entity.x === x && entity.y === y) {
        names.push(entity.name);
      }
    }

    return names.join(', ');
  }

  addMessage(msg: string, opt_color?: Color): void {
    while (this.messages.length >= MSG_HEIGHT) {
      this.messages.shift();
    }
    this.messages.push({ text: msg, color: opt_color || Colors.WHITE });
  }

  playerMoveOrAttack(dx: number, dy: number): void {
    const x = this.player.x + dx;
    const y = this.player.y + dy;

    let target: Actor | null = null;
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];
      if (entity instanceof Actor && entity != this.player && entity.x === x && entity.y === y) {
        target = entity;
        break;
      }
    }

    if (target && target.blocks) {
      this.player.attack(target);
    } else {
      this.player.move(dx, dy);
      this.fovRecompute = true;
    }

    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];
      if (entity instanceof Actor && entity.ai) {
        entity.ai.takeTurn();
      }
    }
  }

  handleKeys(): void {
    if (this.player.hp <= 0) {
      return;
    }

    if (this.app.gui.handleInput()) {
      return;
    }

    const term = this.app.term;
    const movementKey = term.getMovementKey();

    if (this.targetFunction) {
      if (term.isKeyPressed(Key.VK_ENTER) || term.mouse.buttons[0].isClicked()) {
        this.endTargeting(this.targetCursor.x, this.targetCursor.y);
      }
      if (term.isKeyPressed(Key.VK_ESCAPE) || term.mouse.buttons[2].isClicked()) {
        this.cancelTargeting();
      }
      if (movementKey) {
        this.targetCursor.x += movementKey.x;
        this.targetCursor.y += movementKey.y;
      }
      if (term.mouse.dx !== 0 || term.mouse.dy !== 0) {
        this.targetCursor.x = term.mouse.x;
        this.targetCursor.y = term.mouse.y;
      }
      return;
    }
    if (movementKey) {
      this.playerMoveOrAttack(movementKey.x, movementKey.y);
    }
    if (term.isKeyPressed(Key.VK_G)) {
      // Pick up an item
      for (let i = 0; i < this.entities.length; i++) {
        const entity = this.entities[i];
        if (entity instanceof Item && entity.x === this.player.x && entity.y === this.player.y) {
          this.player.pickUp(entity);
        }
      }
    }
    if (term.isKeyPressed(Key.VK_I)) {
      if (this.player.inventory.length === 0) {
        this.app.gui.add(new MessageDialog('ALERT', 'Inventory is empty'));
      } else {
        const options = this.player.inventory.map((item) => {
          if (item.equipped) {
            return item.name + ' (on ' + item.slot + ')';
          } else {
            return item.name;
          }
        });
        this.app.gui.add(new SelectDialog('INVENTORY', options, (choice) => this.useInventory(choice)));
      }
    }
    if (term.isKeyPressed(Key.VK_C)) {
      const levelUpXp = LEVEL_UP_BASE + this.player.level * LEVEL_UP_FACTOR;
      this.app.gui.add(
        new MessageDialog(
          'CHARACTER',
          'Level: ' +
            this.player.level +
            '\nExperience: ' +
            this.player.xp +
            '\nExperience to level up: ' +
            levelUpXp +
            '\n\nMaximum HP: ' +
            this.player.maxHp +
            '\nAttack: ' +
            this.player.power +
            '\nDefense: ' +
            this.player.defense
        )
      );
    }
    if (term.isKeyPressed(Key.VK_COMMA)) {
      if (this.player.x === this.stairs?.x && this.player.y === this.stairs?.y) {
        this.nextLevel();
      }
    }

    // If the mouse is hovering over the play area,
    // then draw the path from the player to the cursor
    if (!this.pathWalking) {
      if (term.mouse.x >= 0 && term.mouse.x < MAP_WIDTH && term.mouse.y >= 0 && term.mouse.y < MAP_HEIGHT) {
        this.path = computePath(this.map, this.player, term.mouse, 100);
      } else {
        this.path = undefined;
      }
    }
    if (!this.pathWalking && this.path && term.mouse.buttons[0].upCount === 1) {
      this.pathWalking = true;
      this.pathIndex = 0;
    }
    if (this.pathWalking && this.path && this.pathIndex >= 0) {
      // Advance to the player's current position
      while (
        this.pathIndex < this.path.length &&
        this.player.x === this.path[this.pathIndex].x &&
        this.player.y === this.path[this.pathIndex].y
      ) {
        this.pathIndex++;
      }
      // If there are still remaining steps...
      if (this.pathIndex < this.path.length) {
        // Try to move to the next step
        const next = this.path[this.pathIndex];
        this.playerMoveOrAttack(next.x - this.player.x, next.y - this.player.y);
        if (this.player.x !== next.x || this.player.y !== next.y) {
          // If it fails, then cancel autowalking
          this.pathWalking = false;
          this.pathIndex = -1;
          this.path = undefined;
        }
      } else {
        // Otherwise player reached the end of the path
        this.pathWalking = false;
        this.pathIndex = -1;
        this.path = undefined;
      }
    }
  }

  useInventory(choice: number): void {
    if (choice >= 0) {
      this.player.useItem(this.player.inventory[choice]);
    }
  }

  checkLevelUp(): void {
    // See if the player's experience is enough to level-up
    const levelUpXp = LEVEL_UP_BASE + this.player.level * LEVEL_UP_FACTOR;
    if (this.player.xp >= levelUpXp) {
      this.player.level++;
      this.player.xp -= levelUpXp;
      this.addMessage('Your battle skills grow stronger! You reached level ' + this.player.level + '!', Colors.YELLOW);

      const options = [
        'Constitution (+20 HP, from ' + this.player.maxHp + ')',
        'Strength (+1 attack, from ' + this.player.power + ')',
        'Agility (+1 defense, from ' + this.player.defense + ')',
      ];

      this.app.gui.add(
        new SelectDialog('LEVEL UP', options, (choice) => {
          if (choice === 0) {
            this.player.baseMaxHp += 20;
            this.player.hp += 20;
          } else if (choice === 1) {
            this.player.basePower += 1;
          } else if (choice === 2) {
            this.player.baseDefense += 1;
          }
        })
      );
    }
  }

  getClosestMonster(x: number, y: number, range: number): Actor | null {
    let minDist = range + 1;
    let result = null;
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];
      if (entity instanceof Actor && entity !== this.player) {
        const dist = entity.distance(x, y);
        if (dist < minDist) {
          minDist = dist;
          result = entity;
        }
      }
    }
    return result;
  }

  getMonsterAt(x: number, y: number): Actor | null {
    return this.getClosestMonster(x, y, 0);
  }

  castHeal(item: Item): void {
    // Heal the player
    if (this.player.hp === this.player.maxHp) {
      this.addMessage('You are already at full health.', Colors.DARK_RED);
      return;
    }

    this.addMessage('Your wounds start to feel better!', Colors.LIGHT_MAGENTA);
    this.player.heal(HEAL_AMOUNT);
    this.player.removeItem(item);
  }

  castLightning(item: Item): void {
    // Find closest enemy (inside a maximum range) and damage it
    const monster = this.getClosestMonster(this.player.x, this.player.y, LIGHTNING_RANGE);
    if (!monster) {
      this.addMessage('No enemy is close enough to strike.', Colors.LIGHT_RED);
      return;
    }

    // Zap it!
    this.addMessage('A lightning bolt strikes the ' + monster.name + ' with a loud thunder!', Colors.LIGHT_BLUE);
    this.addMessage('The damage is ' + LIGHTNING_DAMAGE + ' hit points', Colors.LIGHT_BLUE);
    monster.takeDamage(LIGHTNING_DAMAGE);
    this.player.removeItem(item);
  }

  castFireball(item: Item): void {
    // Ask the player for a target tile to throw a fireball at
    this.addMessage('Left-click to cast fireball, or right-click to cancel.', Colors.LIGHT_CYAN);
    this.startTargeting((x, y) => {
      if (this.player.distance(x, y) > FIREBALL_RANGE) {
        this.addMessage('Target out of range.', Colors.LIGHT_GRAY);
        return;
      }

      this.addMessage('The fireball explodes, burning everything within ' + FIREBALL_RADIUS + ' tiles!', Colors.ORANGE);

      for (let i = 0; i < this.entities.length; i++) {
        const entity = this.entities[i];
        if (entity instanceof Actor && entity.hp > 0 && entity.distance(x, y) <= FIREBALL_RADIUS) {
          this.addMessage('The ' + entity.name + ' gets burned for ' + FIREBALL_DAMAGE + ' hit points.', Colors.ORANGE);
          entity.takeDamage(FIREBALL_DAMAGE);
        }
      }

      this.player.removeItem(item);
    });
  }

  castConfuse(item: Item): void {
    // Ask the player for a target to confuse
    this.addMessage('Left-click to cast confuse, or right-click to cancel.', Colors.LIGHT_CYAN);
    this.startTargeting((x, y) => {
      if (this.player.distance(x, y) > CONFUSE_RANGE) {
        this.addMessage('Target out of range.', Colors.LIGHT_GRAY);
        return;
      }

      const monster = this.getMonsterAt(x, y);
      if (!monster) {
        this.addMessage('No monster there.', Colors.LIGHT_GRAY);
        return;
      }

      monster.setAi(new ConfusedMonster(monster.ai as AI));
      this.addMessage('The eyes of the ' + monster.name + ' look vacant, as he stumbles around!', Colors.LIGHT_GREEN);
      this.player.removeItem(item);
    });
  }

  startTargeting(callback: (x: number, y: number) => void): void {
    this.targetFunction = callback;
    this.targetCursor.x = this.player.x;
    this.targetCursor.y = this.player.y;
  }

  endTargeting(x: number, y: number): void {
    if (this.targetFunction) {
      this.targetFunction(x, y);
      this.cancelTargeting();
    }
  }

  cancelTargeting(): void {
    this.targetFunction = undefined;
  }

  renderAll(): void {
    const term = this.app.term;

    if (this.fovRecompute) {
      this.map.computeFov(this.player.x, this.player.y, TORCH_RADIUS);
      this.fovRecompute = false;
    }

    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const visible = this.map.isVisible(x, y);
        const wall = this.map.grid[y][x].blockedSight;
        let color = Colors.BLACK;

        if (visible) {
          // It's visible
          color = wall ? COLOR_LIGHT_WALL : COLOR_LIGHT_GROUND;
          this.map.grid[y][x].explored = true;
        } else if (this.map.grid[y][x].explored) {
          // It's remembered
          color = wall ? COLOR_DARK_WALL : COLOR_DARK_GROUND;
        }

        term.drawChar(x, y, 0, 0, color);
      }
    }

    // If the mouse is hovering over the play area,
    // then draw the path from the player to the cursor
    if (!this.pathWalking && this.path) {
      for (let i = 1; i < this.path.length; i++) {
        term.drawChar(this.path[i].x, this.path[i].y, 0, 0, Colors.WHITE);
      }
    }

    // Draw entities
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].draw();
    }

    // Prepare to render the GUI panel
    term.fillRect(0, PANEL_Y, SCREEN_WIDTH, PANEL_HEIGHT, 0, Colors.WHITE, Colors.BLACK);

    // Print the game this.messages, one line at a time
    let y = PANEL_Y + 1;
    for (let i = 0; i < this.messages.length; i++) {
      const message = this.messages[i];
      term.drawString(MSG_X, y, message.text, message.color);
      y++;
    }

    // Show the player's stats
    this.renderBar(
      1,
      PANEL_Y + 1,
      BAR_WIDTH,
      'HP',
      this.player.hp,
      this.player.maxHp,
      Colors.LIGHT_RED,
      Colors.DARK_RED
    );

    this.renderBar(
      1,
      PANEL_Y + 2,
      BAR_WIDTH,
      'XP',
      this.player.xp,
      LEVEL_UP_BASE + this.player.level * LEVEL_UP_FACTOR,
      Colors.LIGHT_MAGENTA,
      Colors.DARK_MAGENTA
    );

    term.drawString(1, PANEL_Y + 4, 'Dungeon level ' + this.level, Colors.ORANGE);

    // Display names of objects under the mouse
    term.drawString(1, PANEL_Y, this.getNamesUnderMouse(), Colors.LIGHT_GRAY);

    if (this.targetFunction) {
      const targetCell = term.getCell(this.targetCursor.x, this.targetCursor.y);
      if (targetCell) {
        targetCell.setBackground(Colors.WHITE);
      }
    }

    // Draw dialog boxes
    this.app.gui.draw();
  }

  nextLevel(): void {
    // Advance to the next level
    this.addMessage('You take a moment to rest, and recover your strength.', Colors.LIGHT_MAGENTA);
    this.player.heal(this.player.maxHp / 2); // heal the player by 50%
    this.level++;
    this.addMessage('After a rare moment of peace, you descend deeper...', Colors.LIGHT_RED);
    this.entities = [this.player];
    this.map = this.createMap(); // Create a fresh new level!
    this.fovRecompute = true;
  }

  update(): void {
    this.handleKeys();
    this.renderAll();
  }
}
