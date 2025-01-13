import {
  AppState,
  AutoRectRenderer,
  Button,
  ButtonSlot,
  Container,
  Dialog,
  FONT_04B03,
  GUI,
  GraphicsButtonRenderer,
  GraphicsLabelRenderer,
  GraphicsMessageLogRenderer,
  GraphicsSelectInputRenderer,
  Key,
  Label,
  Message,
  MessageLog,
  Panel,
  Point,
  RNG,
  Rect,
  SelectInput,
  Sprite,
  TileMap,
  getTileId,
} from 'wglt';
import { Ability, TargetType } from './ability';
import { Actor } from './actor';
import { BasicMonster } from './ai/basicmonster';
import { ConfusedMonster } from './ai/confusedmonster';
import { FadeInAnimation } from './animations/fadeinanimation';
import { FadeOutAnimation } from './animations/fadeoutanimation';
import { ProjectileAnimation } from './animations/projectileanimation';
import { App } from './app';
import { CompoundMessage } from './compoundmessage';
import { Entity } from './entity';
import { Game } from './game';
import { ItemButton } from './gui/itembutton';
import { ItemContainerButtonSlot } from './gui/itemcontainerbuttonslot';
import { ItemContainerDialog } from './gui/itemcontainerdialog';
import { ShortcutBar, ShortcutBarRenderer } from './gui/shortcutbar';
import { ShortcutButtonSlot } from './gui/shortcutbuttonslot';
import { TalentButton } from './gui/talentbutton';
import { TalentsDialog } from './gui/talentsdialog';
import { Item } from './item';
import { Palette } from './palette';
import { Talent } from './talent';

// Size of the map
const MAP_WIDTH = 60;
const MAP_HEIGHT = 40;

const TILE_SIZE = 16;
const TILE_WALL = getTileId(0, 2);
const TILE_FLOOR = getTileId(1, 2);
const TILE_SHADOW = getTileId(10, 10);

// Parameters for dungeon generator
const ROOM_MAX_SIZE = 10;
const ROOM_MIN_SIZE = 6;
const MAX_ROOMS = 30;
const MAX_ROOM_MONSTERS = 3;
const MAX_ROOM_ITEMS = 2;
// const TORCH_RADIUS = 10;

// Spell values
const HEAL_AMOUNT = 4;
const LIGHTNING_DAMAGE = 20;
const LIGHTNING_RANGE = 5;
const CONFUSE_RANGE = 8;
// const CONFUSE_NUM_TURNS = 10;
const FIREBALL_RANGE = 10;
const FIREBALL_RADIUS = 3;
const FIREBALL_DAMAGE = 12;

class Fighter extends Actor {
  constructor(game: Game, x: number, y: number, name: string, sprite: Sprite) {
    super(game, x, y, name, sprite, true);
  }

  onAttack(target: Actor, damage: number) {
    if (damage > 0) {
      this.game.log(`${this.name} attacks ${target.name} for ${damage} hit points.`, 0x808080ff);
    } else {
      this.game.log(`${this.name} attacks ${target.name} but it has no effect!`, 0x808080ff);
    }
  }
}

class Player extends Fighter {
  level: number;
  xp: number;
  maxXp: number;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'Player', new Sprite(0, 16, 16, 16, 2, true));
    this.level = 1;
    this.xp = 0;
    this.maxXp = 10;
    this.zIndex = 2;
  }

  onDeath() {
    this.game.log('You died!');
  }
}

class Monster extends Fighter {
  constructor(game: Game, x: number, y: number, name: string, sprite: Sprite) {
    super(game, x, y, name, sprite);
    this.hp = 20;
    this.ai = new BasicMonster(this, calculateDamage);
  }

  onBump(player: Actor) {
    player.attack(this, 10);
    return true;
  }

  onDeath() {
    game.log(`${this.name} is dead`);
    this.blocks = false;
    this.ai = undefined;
    this.name = `remains of ${this.name}`;
    this.sendToBack();

    const xpGain = 10;
    player.xp += xpGain;

    while (player.xp >= player.maxXp) {
      player.level++;
      player.xp = 0;
      player.maxXp *= 2;
      game.log(`You reached level ${player.level}`, 0xff8000ff);
    }
  }
}

class Orc extends Monster {
  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'Orc', new Sprite(32, 16, 16, 16, 2, true));
  }
}

class Troll extends Monster {
  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'Troll', new Sprite(64, 16, 16, 16, 2, true));
  }
}

// class Item extends Item {
//   onPickup(entity) {
//     this.game.log(`${entity.name} picked up gold coins`, Palette.GREEN);
//   }
// }

function createRoom(map: TileMap, room: Rect): void {
  for (let y = room.y1 + 1; y < room.y2; y++) {
    for (let x = room.x1 + 1; x < room.x2; x++) {
      map.setTile(x, y, 0, TILE_FLOOR);
      map.setBlocked(x, y, false);
    }
  }
}

function createHTunnel(map: TileMap, x1: number, x2: number, y: number): void {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
    map.setTile(x, y, 0, TILE_FLOOR);
    map.setBlocked(x, y, false);
  }
}

function createVTunnel(map: TileMap, y1: number, y2: number, x: number): void {
  for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
    map.setTile(x, y, 0, TILE_FLOOR);
    map.setBlocked(x, y, false);
  }
}

function createMap() {
  // Reset all FOV data
  map.clear();

  // Clear the map to all walls
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      map.setTile(x, y, 0, TILE_WALL);
      map.setAnimated(x, y, 0, false);
      map.setBlocked(x, y, true);
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
        map.setTile(player.x, player.y, 1, TILE_SHADOW);
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
  const stairs = new Entity(
    game,
    stairsLoc.x,
    stairsLoc.y,
    'stairs',
    new Sprite(32, 32, 16, 16, 1),
    true
  );
  stairs.onBump = () => {
    nextLevel();
    return true;
  };
  game.entities.add(stairs);

  // Initial FOV
  game.resetViewport();
  game.recomputeFov();
}

function placeObjects(room: Rect) {
  // Choose random number of monsters
  const numMonsters = rng.nextRange(0, MAX_ROOM_MONSTERS);

  for (let i = 0; i < numMonsters; i++) {
    // Choose random spot for this monster
    const x = rng.nextRange(room.x1 + 1, room.x2 - 1);
    const y = rng.nextRange(room.y1 + 1, room.y2 - 1);
    let monster = undefined;

    // Only place it if the tile is not blocked
    // 80% chance of getting an orc
    if (rng.nextRange(0, 100) < 80) {
      monster = new Orc(game, x, y);
    } else {
      monster = new Troll(game, x, y);
    }

    game.entities.add(monster);
  }

  // Choose random number of items
  const numItems = rng.nextRange(0, MAX_ROOM_ITEMS);

  for (let i = 0; i < numItems; i++) {
    // Choose random spot for this item
    const x = rng.nextRange(room.x1 + 1, room.x2 - 1);
    const y = rng.nextRange(room.y1 + 1, room.y2 - 1);

    const dice = rng.nextRange(0, 100);
    let itemName = undefined;
    let itemSprite = undefined;
    let itemUse: ((actor: Actor, item: Item) => void) | undefined = undefined;
    let itemAbility = undefined;
    let itemTooltips = undefined;

    if (dice < 50) {
      // Create a healing potion (50% chance)
      itemName = 'healing potion';
      itemSprite = new Sprite(128, 16, 16, 16, 1);
      itemUse = castHeal;
      itemTooltips = [
        new Message('Ancient Healing Potion', Palette.BLUE),
        new Message('Item Level 5', Palette.YELLOW),
        new Message('Use: Restore 10 health', Palette.GREEN),
      ];
    } else if (dice < 50 + 20) {
      // Create a lightning bolt scroll (20% chance)
      itemName = 'scroll of lightning bolt';
      itemSprite = new Sprite(144, 16, 16, 16, 1);
      itemUse = readScroll;
      itemAbility = new LightningAbility();
    } else if (dice < 50 + 20 + 15) {
      // Create a fireball scroll (15% chance)
      itemName = 'scroll of fireball';
      itemSprite = new Sprite(144, 16, 16, 16, 1);
      itemUse = readScroll;
      itemAbility = new FireballAbility();
    } else {
      // Create a confuse scroll (15% chance)
      itemName = 'scroll of confusion';
      itemSprite = new Sprite(144, 16, 16, 16, 1);
      itemUse = readScroll;
      itemAbility = new ConfuseAbility();
    }

    const item = new Item(game, x, y, itemName, itemSprite);
    item.onPickup = pickupCallback;
    item.onUse = itemUse;
    item.ability = itemAbility;
    item.tooltipMessages = itemTooltips;
    game.entities.add(item);
  }
}

function pickupCallback(entity: Actor, item: Item) {
  game.log(`${entity.name} picked up a ${item.name}`, Palette.GREEN);
}

function getClosestMonster(x: number, y: number, range: number) {
  let minDist = range + 1;
  let result = undefined;
  for (let i = 0; i < game.entities.length; i++) {
    const entity = game.entities.get(i);
    if (entity instanceof Actor && entity !== player) {
      const dist = entity.distance(x, y);
      if (dist < minDist) {
        minDist = dist;
        result = entity;
      }
    }
  }
  return result;
}

// function getMonsterAt(x, y) {
//   return getClosestMonster(x, y, 0);
// }

function calculateDamage(_attacker: Actor, _target: unknown) {
  return 10;
}

function castHeal(caster: Actor, item: Item) {
  // Heal the player
  if (caster.hp === caster.maxHp) {
    game.log('You are already at full health.', Palette.RED);
    return;
  }

  game.log('Your wounds start to feel better!', Palette.PINK);
  caster.takeHeal(HEAL_AMOUNT);
  caster.inventory.remove(item);
  caster.ap--;
}

class LightningAbility implements Ability {
  name: string;
  sprite: Sprite;
  targetType: TargetType;
  cooldown: number;
  tooltipMessages: Message[];
  minRange = 1;
  maxRange = 25;

  constructor() {
    this.name = 'Lightning';
    this.sprite = new Sprite(128, 32, 16, 16, 3);
    this.targetType = TargetType.SELF;
    this.cooldown = 10;
    this.tooltipMessages = [
      new Message('Lightning', Palette.WHITE),
      new Message('2% of base mana', Palette.WHITE),
      new Message('2 turn cast', Palette.WHITE),
      new Message('Hurls a bolt of lightning at the target', Palette.YELLOW),
      new Message('dealing 20 damage.', Palette.YELLOW),
    ];
  }

  cast(caster: Actor): boolean {
    // Find closest enemy (inside a maximum range) and damage it
    const monster = getClosestMonster(caster.x, caster.y, LIGHTNING_RANGE);
    if (!monster) {
      game.log('No enemy is close enough to strike.', Palette.RED);
      return false;
    }

    // Zap it!
    game.log(`A lightning bolt strikes the ${monster.name} with a loud thunder!`, Palette.BLUE);
    game.log(`The damage is ${LIGHTNING_DAMAGE} hit points`, Palette.BLUE);
    monster.takeDamage(caster, LIGHTNING_DAMAGE);
    caster.ap--;
    return true;
  }
}

class FireballAbility implements Ability {
  name: string;
  sprite: Sprite;
  targetType: TargetType;
  cooldown: number;
  tooltipMessages: Message[];
  minRange = 1;
  maxRange = 25;

  constructor() {
    this.name = 'Fireball';
    this.sprite = new Sprite(128, 32, 16, 16, 3);
    this.targetType = TargetType.TILE;
    this.cooldown = 20;
    this.tooltipMessages = [
      new Message('Fireball', Palette.WHITE),
      new Message('2% of base mana', Palette.WHITE),
      new Message('2 turn cast', Palette.WHITE),
      new Message('Throws a fiery ball causing 10 damage', Palette.YELLOW),
      new Message('to all enemies within 3 tiles.', Palette.YELLOW),
    ];
  }

  cast(caster: Actor, target: Actor): boolean {
    const distance = caster.distanceTo(target);
    if (distance > FIREBALL_RANGE) {
      game.log('Target out of range.', Palette.LIGHT_GRAY);
      return false;
    }

    const speed = 8;
    const count = distance * (TILE_SIZE / speed);
    const dx = (target.x * TILE_SIZE - caster.pixelX) / count;
    const dy = (target.y * TILE_SIZE - caster.pixelY) / count;

    game.addAnimation(
      new ProjectileAnimation(
        new Sprite(128, 32, 16, 16, 3, false),
        new Point(caster.pixelX, caster.pixelY),
        new Point(dx, dy),
        count
      )
    );

    game.addAnimation(
      new ProjectileAnimation(
        new Sprite(176, 32, 16, 16, 4, false, 4),
        new Point(target.x * TILE_SIZE, target.y * TILE_SIZE),
        new Point(0, 0),
        16
      )
    );

    game.log(
      `The fireball explodes, burning everything within ${FIREBALL_RADIUS} tiles!`,
      Palette.ORANGE
    );

    for (let i = game.entities.length - 1; i >= 0; i--) {
      const entity = game.entities.get(i);
      if (entity instanceof Actor && entity.distanceTo(target) <= FIREBALL_RADIUS) {
        game.log(
          `The ${entity.name} gets burned for ${FIREBALL_DAMAGE} hit points.`,
          Palette.ORANGE
        );
        entity.takeDamage(caster, FIREBALL_DAMAGE);
      }
    }

    caster.ap--;
    return true;
  }
}

class ConfuseAbility {
  name: string;
  sprite: Sprite;
  targetType: TargetType;
  cooldown: number;
  tooltipMessages: Message[];
  minRange = 1;
  maxRange = 25;

  constructor() {
    this.name = 'Confuse';
    this.sprite = new Sprite(128, 32, 16, 16, 3);
    this.targetType = TargetType.ENTITY;
    this.cooldown = 20;
    this.tooltipMessages = [
      new Message('Confuse', Palette.WHITE),
      new Message('2% of base mana', Palette.WHITE),
      new Message('2 turn cast', Palette.WHITE),
      new Message('Throws a fiery ball causing 10 damage', Palette.YELLOW),
      new Message('to all enemies within 3 tiles.', Palette.YELLOW),
    ];
  }

  cast(caster: Actor, target: Actor): boolean {
    if (caster.distanceTo(target) > CONFUSE_RANGE) {
      game.log('Target out of range.', Palette.LIGHT_GRAY);
      return false;
    }

    target.ai = new ConfusedMonster(target);
    game.log(`The eyes of the ${target.name} look vacant, as he stumbles around!`, Palette.GREEN);
    caster.ap--;
    return true;
  }
}

function readScroll(_caster: Actor, item: Item) {
  const ability = item.ability as Ability;
  player.cast(ability, undefined, () => {
    player.inventory.remove(item);
  });
}

function nextLevel() {
  game.addAnimation(new FadeOutAnimation(30)).then(() => {
    game.log('You take a moment to rest, and recover your strength.', Palette.PINK);
    game.log('After a rare moment of peace, you descend deeper...', Palette.RED);
    game.entities.add(player);
    game.stopAutoWalk();
    createMap();
    game.addAnimation(new FadeInAnimation(30));
  });
}

const app = new App({
  imageUrl: '/graphics2.png',
  size: new Rect(0, 0, 400, 224),
  font: FONT_04B03,
});

const dialogSourceRect = new Rect(0, 64, 24, 24);

const gui = new GUI(app);
// gui.renderers.set(BottomPanel, new BottomPanelRenderer());
// gui.renderers.set(EntityFrames, new EntityFramesRenderer());
gui.renderers.set(Dialog, new AutoRectRenderer(dialogSourceRect));
gui.renderers.set(ButtonSlot, new AutoRectRenderer(dialogSourceRect));
gui.renderers.set(Panel, new AutoRectRenderer(dialogSourceRect));
gui.renderers.set(Label, new GraphicsLabelRenderer());
gui.renderers.set(Button, new GraphicsButtonRenderer());
gui.renderers.set(TalentButton, new GraphicsButtonRenderer());
gui.renderers.set(ShortcutBar, new ShortcutBarRenderer());
gui.renderers.set(ShortcutButtonSlot, new AutoRectRenderer(dialogSourceRect));
gui.renderers.set(MessageLog, new GraphicsMessageLogRenderer());
gui.renderers.set(ItemContainerDialog, new AutoRectRenderer(dialogSourceRect));
gui.renderers.set(ItemContainerButtonSlot, new AutoRectRenderer(dialogSourceRect));
gui.renderers.set(ItemButton, new GraphicsButtonRenderer());
gui.renderers.set(SelectInput, new GraphicsSelectInputRenderer());

const game = new Game(app, gui);

game.targetSprite = new Sprite(0, 48, 16, 16);
game.cooldownSprite = new Sprite(0, 160, 16, 16, 24);
game.blackoutRect = new Rect(0, 32, 16, 16);
// gui.renderer.baseRect = new Rect(0, 64, 24, 24);
// gui.renderer.closeButtonRect = new Rect(208, 16, 16, 16);
// gui.renderer.buttonSlotRect = new Rect(0, 88, 24, 24);

const map = game.tileMap;
const rng = new RNG(1);
const player = new Player(game, 30, 20);
game.player = player;
game.entities.add(player);

game.messageLog = new MessageLog(new Rect(1, -78, 100, 50));
gui.addChild(game.messageLog);
game.log(
  new CompoundMessage(
    new Message('Welcome stranger! ', Palette.DARK_PURPLE),
    new Message('Prepare to perish!', Palette.RED)
  )
);

const playerStats = new Panel(new Rect(1, 1, 100, 100));
// playerStats.drawContents = () => {
//   const frameY = 0;
//   app.drawString(1, frameY, player.name);

//   const hpPercent = player.hp / player.maxHp;
//   app.drawImage(0, frameY + 7, 32, 64, 32, 12);
//   app.drawImage(2, frameY + 9, 32, 80, 8, 8, undefined, Math.round(hpPercent * 28));
//   app.drawString(3, frameY + 10, `${player.hp}/${player.maxHp}`);

//   const xpPercent = player.xp / player.maxXp;
//   app.drawImage(32, frameY + 7, 32, 64, 32, 12);
//   app.drawImage(34, frameY + 9, 32, 80, 8, 8, undefined, Math.round(xpPercent * 28));
//   app.drawString(35, frameY + 10, `${player.xp}/${player.maxXp}`);
// };
gui.addChild(playerStats);

const buttonSlotRect = new Rect(0, 88, 24, 24);
const shortcutBar = new ShortcutBar(new Rect(1, 224 - 26, 26 * 6, 26), buttonSlotRect, 6);
gui.addChild(shortcutBar);

const inventoryButton = new Button(
  new Rect(400 - 24, 224 - 24, 24, 24),
  new Sprite(192, 16, 16, 16),
  Key.VK_I,
  () => {
    inventoryDialog.visible = !inventoryDialog.visible;
    talentsDialog.visible = false;
  }
);
inventoryButton.tooltip = Container.fromMessages([
  new Message("Traveler's Backpack", Palette.GREEN),
  new Message('Item Level 55', Palette.YELLOW),
  new Message('16 Slot Bag', Palette.WHITE),
  new Message('Sell Price: 87 coins', Palette.WHITE),
]);
gui.addChild(inventoryButton);

const talentsButton = new Button(
  new Rect(400 - 48, 224 - 24, 24, 24),
  new Sprite(192, 16, 16, 16),
  Key.VK_T,
  () => {
    talentsDialog.visible = !talentsDialog.visible;
    inventoryDialog.visible = false;
  }
);
talentsButton.tooltip = Container.fromMessages([
  new Message('Talents', Palette.WHITE),
  new Message('A list of all of your', Palette.YELLOW),
  new Message("character's talents.", Palette.YELLOW),
]);
gui.addChild(talentsButton);

const inventoryDialog = new ItemContainerDialog(
  new Rect(10, 25, 110, 110),
  [
    new Message("Traveler's Backpack", Palette.GREEN),
    new Message('Click to use', Palette.LIGHT_GRAY),
    new Message('Drag for shortcut', Palette.LIGHT_GRAY),
  ],
  16,
  player.inventory
);
inventoryDialog.visible = false;
gui.addChild(inventoryDialog);

const talentsDialog = new TalentsDialog(
  new Rect(10, 25, 110, 110),
  [
    new Message('Talents', Palette.GREEN),
    new Message('Click to use', Palette.LIGHT_GRAY),
    new Message('Drag for shortcut', Palette.LIGHT_GRAY),
  ],
  16,
  player.talents
);
talentsDialog.visible = false;
gui.addChild(talentsDialog);

player.inventory.addListener({
  onAdd: (_, item) => {
    console.log('add item!', item);
    shortcutBar.addItem(player.inventory, item, true);
  },
  onRemove: (_, _talent) => {},
});

player.talents.addListener({
  onAdd: (_, talent) => {
    console.log('add talent!', talent);
    shortcutBar.addTalent(talent);
  },
  onRemove: (_, _talent) => {},
});

player.talents.add(new Talent(player, new FireballAbility()));
player.talents.add(new Talent(player, new LightningAbility()));

// Generate the map
createMap();

class MainMenu extends AppState<App> {
  constructor(
    app: App,
    readonly gui: GUI<App>
  ) {
    super(app);
  }

  update(): void {
    this.gui.handleInput();
    this.gui.draw();
  }
}

const mainMenu = new MainMenu(app, gui);
// mainMenu.gui.renderer.baseRect = new Rect(0, 64, 24, 24);
// mainMenu.gui.add(new ImagePanel(new Rect(0, 768, 400, 224), new Rect(0, 0, 400, 224)));
mainMenu.gui.addChild(
  new Dialog(
    new Rect(150, 62, 100, 100),
    'Main Menu',
    new SelectInput(
      new Rect(0, 0, 100, 100),
      [
        { id: 'new', name: 'NEW GAME' },
        { id: 'continue', name: 'CONTINUE' },
      ],
      (choice) => {
        if (choice.id === 'new') {
          app.state = game;
        }
      }
    )
  )
);

app.state = mainMenu;
