import { RNG, Rect, TileMap, getTileId, zzfx } from 'wglt';
import { ConfuseAbility } from './abilities/confuse';
import { FireballAbility } from './abilities/fireball';
import { LightningAbility } from './abilities/lightning';
import { Orc, Troll } from './actors/monster';
import { Player } from './actors/player';
import { FadeInAnimation } from './animations/fadeinanimation';
import { FadeOutAnimation } from './animations/fadeoutanimation';
import { Entity } from './entity';
import { Game } from './game';
import { Item } from './item';
import { HealthPotion } from './items/healthpotion';
import { Scroll } from './items/scroll';
import { Palette } from './palette';
import { nextLevelSound } from './sounds';
import { Sprites } from './sprites';

// Size of the map
const MAP_WIDTH = 60;
const MAP_HEIGHT = 40;

const TILE_WALL = getTileId(0, 2);
const TILE_FLOOR = getTileId(1, 2);

// Parameters for dungeon generator
const ROOM_MAX_SIZE = 10;
const ROOM_MIN_SIZE = 6;
const MAX_ROOMS = 30;
const MAX_ROOM_MONSTERS = 3;
const MAX_ROOM_ITEMS = 2;

const rng = new RNG();

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

export function createMap(game: Game): void {
  const map = game.tileMap;
  const player = game.player as Player;

  // Clear all entities
  game.entities.clear();
  game.entities.add(player);

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
      placeObjects(game, newRoom);

      // Finally, append the new room to the list
      rooms.push(newRoom);
    }
  }

  // Create stairs at the center of the last room
  const stairsLoc = rooms[rooms.length - 1].getCenter();
  const stairs = new Entity(game, stairsLoc.x, stairsLoc.y, 'stairs', Sprites.STAIRS, true);
  stairs.onBump = (): boolean => {
    nextLevel(game);
    zzfx(...nextLevelSound);
    return true;
  };
  game.entities.add(stairs);

  // Initial FOV
  game.resetViewport();
  game.recomputeFov();
}

function placeObjects(game: Game, room: Rect): void {
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
    let item: Item;

    if (dice < 50) {
      // Create a healing potion (50% chance)
      item = new HealthPotion(game, x, y);
    } else if (dice < 50 + 20) {
      // Create a lightning bolt scroll (20% chance)
      item = new Scroll(game, x, y, new LightningAbility(game));
    } else if (dice < 50 + 20 + 15) {
      // Create a fireball scroll (15% chance)
      item = new Scroll(game, x, y, new FireballAbility(game));
    } else {
      // Create a confuse scroll (15% chance)
      item = new Scroll(game, x, y, new ConfuseAbility(game));
    }

    game.entities.add(item);
  }
}

function nextLevel(game: Game): void {
  const player = game.player as Player;

  game.addAnimation(new FadeOutAnimation(30)).onDone(() => {
    game.log('You take a moment to rest, and recover your strength.', Palette.PINK);
    game.log('After a rare moment of peace, you descend deeper...', Palette.RED);
    game.entities.add(player);
    game.stopAutoWalk();
    createMap(game);
    game.addAnimation(new FadeInAnimation(30));
  });
}
