import { Rect, RNG } from 'wglt';
import { Actor } from './actor';
import { Engine } from './engine';
import {
  chainMailArmor,
  confusionScroll,
  fireballScroll,
  healingItem,
  lightningScroll,
  orc,
  sword,
  troll,
} from './entities';
import { GameMap } from './gamemap';
import { Item } from './item';

type FloorTable<T> = [number, T][];

type EntityCountTable = FloorTable<number>;

type EntityProbability<T> = [T, number];

type EntityProbabilityTable<T> = FloorTable<EntityProbability<T>[]>;

const maxItemsPerFloor: EntityCountTable = [
  [1, 1],
  [4, 2],
];

const maxMonstersPerFloor: EntityCountTable = [
  [1, 2],
  [4, 3],
  [6, 5],
];

const itemChances: EntityProbabilityTable<Item> = [
  [1, [[healingItem, 35]]],
  [
    3,
    [
      [healingItem, 35],
      [confusionScroll, 10],
    ],
  ],
  [
    5,
    [
      [healingItem, 35],
      [confusionScroll, 10],
      [lightningScroll, 25],
      [sword, 5],
    ],
  ],
  [
    7,
    [
      [healingItem, 35],
      [confusionScroll, 10],
      [lightningScroll, 25],
      [fireballScroll, 25],
      [sword, 5],
      [chainMailArmor, 15],
    ],
  ],
];

const monsterChances: EntityProbabilityTable<Actor> = [
  [1, [[orc, 80]]],
  [
    4,
    [
      [orc, 80],
      [troll, 15],
    ],
  ],
  [
    6,
    [
      [orc, 80],
      [troll, 30],
    ],
  ],
  [
    8,
    [
      [orc, 80],
      [troll, 60],
    ],
  ],
];

/**
 * Procedurally generates a dungeon.
 * @param engine The game engine.
 * @param level The dungeon level.
 * @param maxRooms The maximum number of rooms allowed in the dungeon. We’ll use this to control our iteration.
 * @param roomMinSize The minimum size of one room.
 * @param roomMaxSize The maximum size of one room.
 * @param mapWidth The width of the GameMap to create.
 * @param mapHeight The height of the GameMap to create.
 * @returns A new dungeon.
 */
export function generateDungeon(
  engine: Engine,
  level: number,
  maxRooms: number,
  roomMinSize: number,
  roomMaxSize: number,
  mapWidth: number,
  mapHeight: number
): GameMap {
  const { rng, player } = engine;

  const dungeon = new GameMap(engine, mapWidth, mapHeight, [player]);
  dungeon.level = level;

  const rooms: Rect[] = [];
  let center = undefined;

  for (let r = 0; r < maxRooms; r++) {
    const w = rng.nextRange(roomMinSize, roomMaxSize);
    const h = rng.nextRange(roomMinSize, roomMaxSize);

    const x = rng.nextRange(0, mapWidth - w - 1);
    const y = rng.nextRange(0, mapHeight - h - 1);

    // "Rect" class makes rectangles easier to work with
    const newRoom = new Rect(x, y, w, h);

    // Run through the other rooms and see if they intersect with this one
    if (rooms.some((room) => room.intersects(newRoom))) {
      // This room intersects, so go to the next attempt.
      continue;
    }

    // Dig out this rooms inner area.
    dungeon.createRoom(newRoom);

    // Center coordinates of new room, will be useful later
    center = newRoom.getCenter();

    if (rooms.length === 0) {
      // This is the first room, where the player starts at
      player.parent = dungeon;
      player.x = center.x;
      player.y = center.y;
    } else {
      // All rooms after the first:
      // Dig out a tunnel between this room and the previous one.
      // Center coordinates of previous room
      const prev = rooms[rooms.length - 1].getCenter();
      if (rng.nextRange(0, 1) === 1) {
        // First move horizontally, then vertically
        dungeon.createHTunnel(prev.x, center.x, prev.y);
        dungeon.createVTunnel(prev.y, center.y, center.x);
      } else {
        // First move vertically, then horizontally
        dungeon.createVTunnel(prev.y, center.y, prev.x);
        dungeon.createHTunnel(prev.x, center.x, center.y);
      }
    }

    placeEntities(rng, newRoom, dungeon, level);

    dungeon.makeStairs(center.x, center.y);

    // Finally, append the new room to the list
    rooms.push(newRoom);
  }

  return dungeon;
}

function placeEntities(rng: RNG, room: Rect, dungeon: GameMap, floor: number): void {
  const maxMonsters = getValueForFloor(maxMonstersPerFloor, floor);
  const maxItems = getValueForFloor(maxItemsPerFloor, floor);

  const numMonsters = rng.nextRange(0, maxMonsters + 1);
  const numItems = rng.nextRange(0, maxItems + 1);

  const monsterChancesForFloor = getValueForFloor(monsterChances, floor);
  const itemChancesForFloor = getValueForFloor(itemChances, floor);

  for (let i = 0; i < numMonsters; i++) {
    const x = rng.nextRange(room.x + 1, room.x2 - 1);
    const y = rng.nextRange(room.y + 1, room.y2 - 1);

    if (!dungeon.getBlockingEntity(x, y)) {
      getRandomEntity(rng, itemChancesForFloor).spawn(dungeon, x, y);
    }
  }

  for (let i = 0; i < numItems; i++) {
    const x = rng.nextRange(room.x + 1, room.x2 - 1);
    const y = rng.nextRange(room.y + 1, room.y2 - 1);

    if (!dungeon.getBlockingEntity(x, y)) {
      getRandomEntity(rng, monsterChancesForFloor).spawn(dungeon, x, y);
    }
  }
}

function getValueForFloor<T>(probabilityTable: FloorTable<T>, floor: number): T {
  for (const [rowFloor, rowValue] of probabilityTable) {
    if (floor <= rowFloor) {
      return rowValue;
    }
  }
  return probabilityTable[probabilityTable.length - 1][1];
}

function getRandomEntity<T>(rng: RNG, probabilities: EntityProbability<T>[]): T {
  let sum = 0;
  for (const p of probabilities) {
    sum += p[1];
  }

  let r = sum * rng.nextFloat();
  for (const p of probabilities) {
    r -= p[1];
    if (r <= 0) {
      return p[0];
    }
  }

  return probabilities[probabilities.length - 1][0];
}
