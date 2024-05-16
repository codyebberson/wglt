import { Rect, Vec2 } from 'wglt';
import { Sprite } from 'wglt';
import { ItemQuality } from 'wglt';
import { Bat } from '../entities/bat';
import { Ghost } from '../entities/ghost';
import { King } from '../entities/king';
import { Player } from '../entities/player';
import { Snake } from '../entities/snake';
import { Soldier } from '../entities/soldier';
import { Spider } from '../entities/spider';
import { Vendor } from '../entities/vendor';
import { EquipmentBuilder } from '../equipment/equipmentbuilder';
import { Game } from '../game';
import { GrapplingHook } from '../items/grapplinghook';
import { HealthPotion } from '../items/healthpotion';
import { Portal } from '../items/portal';
import { MapGenerator } from './mapgen';
import { Tiles } from './tiles';

const OVERWORLD_WIDTH = 256;
const OVERWORLD_HEIGHT = 256;

export class Overworld {
  readonly rect: Rect;

  constructor(mapGen: MapGenerator) {
    const game = mapGen.game;
    const map = game.tileMap;
    const player = game.player as Player;
    const rng = game.rng;

    const outerOverworld = new Rect(0, 0, OVERWORLD_WIDTH, OVERWORLD_HEIGHT);
    const overworld = new Rect(4, 4, OVERWORLD_WIDTH - 8, OVERWORLD_HEIGHT - 8);

    mapGen.clearMap(map, outerOverworld, Tiles.WATER, true, false);
    mapGen.clearMap(map, overworld, Tiles.GRASS, false, false);

    player.x = (OVERWORLD_WIDTH / 2) | 0;
    player.y = (OVERWORLD_HEIGHT / 2) | 0;
    player.home.x = player.x;
    player.home.y = player.y;

    // Make sure there's a ring of water around the map
    const point = new Vec2(0, 0);
    for (point.y = outerOverworld.y1; point.y < outerOverworld.y2; point.y++) {
      for (point.x = outerOverworld.x1; point.x < outerOverworld.x2; point.x++) {
        if (!overworld.contains(point)) {
          map.setAnimated(point.x, point.y, 0, true);
        }
      }
    }

    // Create a river
    // mapGen.createRiver(map, overworld, 5000);

    // Make sure the player starts on ground
    for (let y = player.y - 4; y <= player.y + 4; y++) {
      for (let x = player.x - 4; x <= player.x + 4; x++) {
        map.setTile(x, y, 0, Tiles.GRASS);
        map.setAnimated(x, y, 0, false);
        map.setBlocked(x, y, false);
      }
    }

    // Create graveyards
    const graveyards = [];
    for (let i = 0; i < 5; i++) {
      const w = rng.nextRange(14, 18);
      const h = rng.nextRange(8, 12);
      const x = rng.nextRange(overworld.x1, overworld.x2 - w);
      const y = rng.nextRange(overworld.y1, overworld.y2 - h);
      const graveyard = new Rect(x, y, w, h);
      const center = graveyard.getCenter();
      for (let y = graveyard.y1; y < graveyard.y2; y++) {
        for (let x = graveyard.x1; x < graveyard.x2; x++) {
          map.setTile(x, y, 0, Tiles.GRASS);
          map.setAnimated(x, y, 0, false);

          if (x === graveyard.x1 && y === graveyard.y1) {
            // Top-left corner
            map.setTile(x, y, 1, Tiles.FENCE8);
            map.setBlocked(x, y, true, false);
          } else if (x === graveyard.x2 - 1 && y === graveyard.y1) {
            // Top-right corner
            map.setTile(x, y, 1, Tiles.FENCE7);
            map.setBlocked(x, y, true, false);
          } else if (x === graveyard.x1 && y === graveyard.y2 - 1) {
            // Bottom-left corner
            map.setTile(x, y, 1, Tiles.FENCE6);
            map.setBlocked(x, y, true, false);
          } else if (x === graveyard.x2 - 1 && y === graveyard.y2 - 1) {
            // Bottom-right corner
            map.setTile(x, y, 1, Tiles.FENCE5);
            map.setBlocked(x, y, true, false);
          } else if (x === graveyard.x1) {
            // Vertical-left fence
            map.setTile(x, y, 1, Tiles.FENCE10);
            map.setBlocked(x, y, true, false);
          } else if (x === graveyard.x2 - 1) {
            // Vertical-right fence
            map.setTile(x, y, 1, Tiles.FENCE9);
            map.setBlocked(x, y, true, false);
          } else if (y === graveyard.y1 || y === graveyard.y2 - 1) {
            // Horizontal fence
            map.setTile(x, y, 1, Tiles.FENCE1);
            map.setBlocked(x, y, true, false);
          } else {
            // Middle space
            map.setBlocked(x, y, false);
          }
        }
      }

      // Create entrances
      map.setTile(center.x, graveyard.y1, 0, Tiles.GRASS);
      map.setTile(center.x, graveyard.y1, 1, Tiles.EMPTY);
      map.setBlocked(center.x, graveyard.y1, false);

      map.setTile(center.x, graveyard.y2 - 1, 0, Tiles.GRASS);
      map.setTile(center.x, graveyard.y2 - 1, 1, Tiles.EMPTY);
      map.setBlocked(center.x, graveyard.y2 - 1, false);

      // Create a ghost
      const distance = Math.hypot(center.x - player.x, center.y - player.y);
      const level = Math.round(distance / 5);
      const ghost = new Ghost(game, center.x, center.y, level);
      game.entities.add(ghost);

      graveyards.push(graveyard);
    }

    // Create trees
    for (let i = 0; i < 5000; i++) {
      const treeX = rng.nextRange(overworld.x1, overworld.x2);
      const treeY = rng.nextRange(overworld.y1, overworld.y2);
      const distance = Math.hypot(treeX - player.x, treeY - player.y);
      if (distance < 6) {
        // Too close to start location
        continue;
      }
      if (
        map.getTile(treeX, treeY, 0) !== Tiles.GRASS ||
        map.getTile(treeX, treeY, 1) === Tiles.PATH ||
        map.isBlocked(treeX, treeY)
      ) {
        // Already occupied
        continue;
      }
      // Create a tree
      map.setTile(treeX, treeY, 0, Tiles.GRASS);
      map.setBlocked(treeX, treeY, true);
      const treeType = rng.nextRange(0, 2);
      if (treeType === 0) {
        map.setTile(treeX, treeY, 1, Tiles.TREE1);
      } else {
        map.setTile(treeX, treeY, 1, Tiles.TREE2);
      }
    }

    // Create baddies
    for (let i = 0; i < 600; i++) {
      // Choose random spot for this monster
      const x = rng.nextRange(overworld.x1 + 1, overworld.x2 - 2);
      const y = rng.nextRange(overworld.y1 + 1, overworld.y2 - 2);
      const distance = Math.hypot(x - player.x, y - player.y);
      if (distance < 10) {
        // Too close to start location
        continue;
      }

      const roll = rng.nextRange(0, 100);

      for (let j = 0; j < 3; j++) {
        const pos = game.findFreeTile(x, y, 3);
        if (!pos) {
          // No more free tiles
          break;
        }

        if (map.getTile(pos.x, pos.y, 0) !== Tiles.GRASS) {
          // Not grass, ignore
          continue;
        }

        const level = Math.round((distance - 10) / 10) + rng.nextRange(1, 3);
        let monster = null;

        if (roll < 25) {
          monster = new Spider(game, pos.x, pos.y, level);
        } else if (roll < 50) {
          monster = new Snake(game, pos.x, pos.y, level);
        } else if (roll < 75) {
          monster = new Bat(game, pos.x, pos.y, level);
        } else {
          monster = new Soldier(game, pos.x, pos.y, level);
        }

        game.entities.add(monster);
      }
    }

    // Create portal entrance
    const portalSprite = new Sprite(528, 408, 16, 16, 1, false);
    const portal1 = new Portal(game, player.x + 2, player.y, 'portal', portalSprite);
    const portal2 = new Portal(
      game,
      graveyards[0].x + 2,
      graveyards[0].y + 2,
      'portal',
      portalSprite
    );
    portal1.other = portal2;
    portal2.other = portal1;
    game.entities.add(portal1);
    game.entities.add(portal2);

    const king = new King(game, player.x - 2, player.y);
    game.entities.add(king);

    // Create one vendor by the player
    this.createVendor(game, player.x, player.y + 2, 1);

    // Create random vendors

    const hook = new GrapplingHook(game);
    hook.x = player.x + 2;
    hook.y = player.y + 2;
    game.entities.add(hook);

    this.rect = outerOverworld;
  }

  private createVendor(game: Game, x: number, y: number, level: number): void {
    const vendor = new Vendor(game, x, y, level);
    for (let i = 0; i < 20; i++) {
      vendor.inventory.add(new HealthPotion(game));
    }
    for (let i = 0; i < 4; i++) {
      vendor.inventory.add(
        new EquipmentBuilder(game).withRandomDrop(level + i, ItemQuality.UNCOMMON).build()
      );
    }
    game.entities.add(vendor);
  }
}
