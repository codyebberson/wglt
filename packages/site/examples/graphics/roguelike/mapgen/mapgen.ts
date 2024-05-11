import { Rect, Vec2 } from '@wglt/core';
import { ItemQuality, Talent } from '@wglt/roguelike';
import { TileMap, getTileId } from '@wglt/tilemap';
import { FlashHealAbility } from '../abilities/flashheal';
import { LeapAbility } from '../abilities/leap';
import { LightningAbility } from '../abilities/lightning';
import { Player } from '../entities/player';
import { Soldier } from '../entities/soldier';
import { EquipmentBuilder } from '../equipment/equipmentbuilder';
import { EquipmentSlot } from '../equipment/equipmentslot';
import {
  BOOTS_SPRITE_1,
  MACE_SPRITE_1,
  PANTS_SPRITE_1,
  SHIRT_SPRITE_1,
} from '../equipment/equipmentsprites';
import { EquipmentType } from '../equipment/equipmenttype';
import { Game } from '../game';
import { Tiles } from './tiles';

// Size of the map
const MAP_WIDTH = 512;
const MAP_HEIGHT = 512;

export class MapGenerator {
  readonly game: Game;
  nextKeyId = 0;

  constructor(game: Game) {
    this.game = game;
  }

  createMap(): void {
    // Create portal entrance
    const game = this.game;
    const map = game.tileMap;

    const player = game.player as Player;
    player.x = 256;
    player.y = 256;
    player.home.x = player.x;
    player.home.y = player.y;

    player.proficiencies.push(EquipmentType.CLOTH);
    player.proficiencies.push(EquipmentType.LEATHER);
    player.proficiencies.push(EquipmentType.PLATE);
    player.proficiencies.push(EquipmentType.MACE);
    player.proficiencies.push(EquipmentType.SHIELD);
    player.talents.add(new Talent(player, new LeapAbility()));
    player.talents.add(new Talent(player, new LightningAbility()));
    player.talents.add(new Talent(player, new FlashHealAbility()));

    player.equipItem(
      new EquipmentBuilder(game)
        .withName("Squire's Vest")
        .withItemLevel(1)
        .withQuality(ItemQuality.COMMON)
        .withSlot(EquipmentSlot.CHEST)
        .withType(EquipmentType.PLATE)
        .withSprite(SHIRT_SPRITE_1)
        .withArmor(7)
        .build()
    );

    player.equipItem(
      new EquipmentBuilder(game)
        .withName("Squire's Pants")
        .withItemLevel(1)
        .withQuality(ItemQuality.COMMON)
        .withSlot(EquipmentSlot.LEGS)
        .withType(EquipmentType.PLATE)
        .withSprite(PANTS_SPRITE_1)
        .withArmor(6)
        .build()
    );

    player.equipItem(
      new EquipmentBuilder(game)
        .withName("Squire's Boots")
        .withItemLevel(1)
        .withQuality(ItemQuality.COMMON)
        .withSlot(EquipmentSlot.FEET)
        .withType(EquipmentType.PLATE)
        .withSprite(BOOTS_SPRITE_1)
        .withArmor(5)
        .build()
    );

    player.equipItem(
      new EquipmentBuilder(game)
        .withName('Battleworn Hammer')
        .withItemLevel(1)
        .withQuality(ItemQuality.COMMON)
        .withType(EquipmentType.MACE)
        .withSlot(EquipmentSlot.MAINHAND)
        .withDamage(1, 2)
        .withSprite(MACE_SPRITE_1)
        .build()
    );

    player.strength += 2;
    player.intelligence += 2;
    player.recalculateMaxHp();

    this.clearMap(map, new Rect(0, 0, MAP_WIDTH, MAP_HEIGHT), Tiles.GRASS, false, false);

    // this.createRandomWall(map, 1000);
    this.createRandomRoom(new Rect(4, 4, 504, 248));

    // Touch-up (add shadows, other ambient effects)
    this.touchUp(this.game.tileMap);

    for (let x = 0; x < MAP_WIDTH; x += 8) {
      for (let y = 0; y < MAP_HEIGHT; y += 8) {
        if (!map.isBlocked(x, y)) {
          const dist = Math.hypot(x - player.x, y - player.y);
          if (dist > 16) {
            const level = 1 + Math.floor((dist - 16) / 16);
            game.entities.add(new Soldier(game, x, y, level));
          }
        }
      }
    }

    // Initial FOV
    game.resetViewport();
    game.recomputeFov();
  }

  clearMap(map: TileMap, rect: Rect, tile: number, blocked: boolean, blockedSight: boolean): void {
    for (let y = rect.y1; y < rect.y2; y++) {
      for (let x = rect.x1; x < rect.x2; x++) {
        map.setTile(x, y, 0, tile);
        map.setAnimated(x, y, 0, false);
        map.setBlocked(x, y, blocked, blockedSight);
        for (let z = 1; z < 4; z++) {
          map.setTile(z, x, y, Tiles.EMPTY);
          map.setAnimated(x, y, z, false);
        }
      }
    }
  }

  createRandomRoom(bounds: Rect): void {
    const rng = this.game.rng;
    const width = rng.nextRange(Math.floor(bounds.width / 2), bounds.width);
    const height = rng.nextRange(Math.floor(bounds.height / 2), bounds.height);
    if (width < 4 || height < 4) {
      return;
    }

    const x = rng.nextRange(bounds.x1, bounds.x2 - width);
    const y = rng.nextRange(bounds.y1, bounds.y2 - height);

    // // Make sure there is no existing room here
    // for (let y2 = y; y2 < y + height; y2++) {
    //   for (let x2 = x; x2 < x + width; x2++) {
    //     if (this.game.tileMap.isBlocked(x2, y2)) {
    //       return;
    //     }
    //   }
    // }

    // Create the outer square
    const wallProb = 0.8;
    for (let y2 = y; y2 < y + height; y2++) {
      if (rng.nextFloat() < wallProb) {
        this.createWall(x, y2);
      }
      if (rng.nextFloat() < wallProb) {
        this.createWall(x + width - 1, y2);
      }
    }
    for (let x2 = x; x2 < x + width; x2++) {
      if (rng.nextFloat() < wallProb) {
        this.createWall(x2, y);
      }
      if (rng.nextFloat() < wallProb) {
        this.createWall(x2, y + height - 1);
      }
    }

    // Create random door on each wall
    this.createFloor(rng.nextRange(x + 1, x + width - 2), y);
    this.createFloor(rng.nextRange(x + 1, x + width - 2), y + height - 1);
    this.createFloor(x, rng.nextRange(y + 1, y + height - 2));
    this.createFloor(x + width - 1, rng.nextRange(y + 1, y + height - 2));

    // Create random number of inner rooms
    if (width > 20 && height > 20) {
      const rect = new Rect(x + 8, y + 8, width - 16, height - 16);
      const numRooms = rng.nextRange(2, 4);
      for (let i = 0; i < numRooms; i++) {
        this.createRandomRoom(rect);
      }
    }
  }

  createWall(x: number, y: number): void {
    const map = this.game.tileMap;
    map.setTile(x, y, 0, Tiles.WALL_ISLAND);
    map.setAnimated(x, y, 0, false);
    map.setBlocked(x, y, true, true);
  }

  createFloor(x: number, y: number): void {
    const map = this.game.tileMap;
    map.setTile(x, y, 0, Tiles.FLOOR);
    map.setAnimated(x, y, 0, false);
    map.setBlocked(x, y, false, false);
  }

  createRandomWall(map: TileMap, length: number): void {
    const rng = this.game.rng;
    // const pos = new Vec2(rng.nextRange(0, map.width), rng.nextRange(0, map.height));
    const pos = new Vec2(256, 280);
    console.log('start pos', pos.x, pos.y);
    const dir = new Vec2(1, 0);

    for (let i = 0; i < length; i++) {
      map.setTile(pos.x, pos.y, 0, Tiles.WALL_ISLAND);
      map.setAnimated(pos.x, pos.y, 0, false);
      map.setBlocked(pos.x, pos.y, true, true);

      if (rng.nextFloat() < 0.1) {
        const r = rng.nextFloat();
        if (r < 0.25) {
          // pos.x++;
          dir.x = 1;
          dir.y = 0;
        } else if (r < 0.5) {
          dir.x = -1;
          dir.y = 0;
        } else if (r < 0.75) {
          // pos.y++;
          dir.x = 0;
          dir.y = 1;
        } else {
          // pos.y--;
          dir.x = 0;
          dir.y = -1;
        }
      }

      pos.x += dir.x;
      pos.y += dir.y;

      if (pos.x < 0 || pos.x >= map.width || pos.y < 0 || pos.y >= map.height) {
        console.log('out of bounds pos', pos.x, pos.y);
        break;
      }
    }
    console.log('end pos', pos.x, pos.y);
  }

  private touchUp(map: TileMap): void {
    // const game = this.game;
    // const rng = game.rng;

    // Touch up walls / half walls
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        const t1 = map.getTile(x, y, 0);
        const t2 = map.getTile(x, y + 1, 0);
        const t3 = map.getTile(x - 1, y, 0);
        const t4 = map.getTile(x + 1, y, 0);
        const t5 = map.getTile(x, y - 1, 0);

        if (isWall(t1)) {
          const north = isWall(t5);
          const south = isWall(t2);
          const west = isWall(t3);
          const east = isWall(t4);

          if (north && south && west && east) {
            map.setTile(x, y, 0, Tiles.WALL_INTERSECTION);
          } else if (north && south && !west && east) {
            map.setTile(x, y, 0, Tiles.WALL_WEST_T);
          } else if (north && south && west && !east) {
            map.setTile(x, y, 0, Tiles.WALL_EAST_T);
          } else if (!north && south && west && east) {
            map.setTile(x, y, 0, Tiles.WALL_NORTH_T);
          } else if (north && !south && west && east) {
            map.setTile(x, y, 0, Tiles.WALL_SOUTH_T);
          } else if (north && south && !west && !east) {
            map.setTile(x, y, 0, Tiles.WALL_VERTICAL);
          } else if (!north && !south && east && west) {
            map.setTile(x, y, 0, Tiles.WALL_HORIZONTAL);
          } else if (!north && south && !west && east) {
            map.setTile(x, y, 0, Tiles.WALL_NORTH_WEST_CORNER);
          } else if (!north && south && west && !east) {
            map.setTile(x, y, 0, Tiles.WALL_NORTH_EAST_CORNER);
          } else if (north && !south && !west && east) {
            map.setTile(x, y, 0, Tiles.WALL_SOUTH_WEST_CORNER);
          } else if (north && !south && west && !east) {
            map.setTile(x, y, 0, Tiles.WALL_SOUTH_EAST_CORNER);
          } else if (north && !south && !west && !east) {
            map.setTile(x, y, 0, Tiles.WALL_SOUTH_END);
          } else if (!north && south && !west && !east) {
            map.setTile(x, y, 0, Tiles.WALL_NORTH_END);
          } else if (!north && !south && west && !east) {
            map.setTile(x, y, 0, Tiles.WALL_EAST_END);
          } else if (!north && !south && !west && east) {
            map.setTile(x, y, 0, Tiles.WALL_WEST_END);
          }
        }

        // if (
        //   t1 === Tiles.FLOOR &&
        //   t3 === Tiles.WALL &&
        //   t5 === Tiles.HALF_WALL &&
        //   rng.nextRange(0, 4) === 0
        // ) {
        //   map.setTile(x, y, 1, Tiles.COBWEB_NORTHWEST);
        // }

        // if (
        //   t1 === Tiles.FLOOR &&
        //   t4 === Tiles.WALL &&
        //   t5 === Tiles.HALF_WALL &&
        //   rng.nextRange(0, 4) === 0
        // ) {
        //   map.setTile(x, y, 1, Tiles.COBWEB_NORTHEAST);
        // }

        // if (
        //   t1 === Tiles.FLOOR &&
        //   t3 === Tiles.WALL &&
        //   t2 === Tiles.WALL &&
        //   rng.nextRange(0, 4) === 0
        // ) {
        //   map.setTile(x, y, 1, Tiles.COBWEB_SOUTHWEST);
        // }

        // if (
        //   t1 === Tiles.FLOOR &&
        //   t4 === Tiles.WALL &&
        //   t2 === Tiles.WALL &&
        //   rng.nextRange(0, 4) === 0
        // ) {
        //   map.setTile(x, y, 1, Tiles.COBWEB_SOUTHEAST);
        // }

        // if (t1 === Tiles.CLOSED_DOOR && t2 !== Tiles.WALL) {
        //   map.setTile(x, y + 1, 2, Tiles.SHADOW);
        // }

        // if (t1 === Tiles.WALL && t2 !== Tiles.WALL && t2 !== Tiles.CLOSED_DOOR) {
        //   const r = rng.nextRange(0, 20);
        //   if (r === 0) {
        //     map.setTile(x, y, 0, Tiles.HALF_WALL2);
        //   } else if (r === 1) {
        //     map.setTile(x, y, 0, Tiles.HALF_WALL3);
        //   } else {
        //     map.setTile(x, y, 0, Tiles.HALF_WALL);
        //   }
        //   map.setTile(x, y + 1, 2, Tiles.SHADOW);
        // }

        // if (t1 !== Tiles.WATER && t2 === Tiles.WATER) {
        //   map.setTile(x, y + 1, 2, Tiles.SHADOW);
        // }
      }
    }
  }
}

function isWall(t: number): boolean {
  return (
    (t >= getTileId(2, 48) && t <= getTileId(7, 48)) ||
    (t >= getTileId(2, 49) && t <= getTileId(7, 49)) ||
    (t >= getTileId(2, 50) && t <= getTileId(7, 50))
  );
}
